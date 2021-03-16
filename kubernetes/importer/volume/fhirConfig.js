'use strict'

const http = require('http')
const axios = require('axios')
const AdmZip = require('adm-zip')

const HAPI_FHIR_PATH = process.env.HAPI_FHIR_PATH || '/fhir'
const HAPI_FHIR_HOSTNAME = process.env.HAPI_FHIR_HOSTNAME || 'hapi-fhir'
const HAPI_FHIR_PORT = process.env.HAPI_FHIR_PORT || 8080
const COVID19_IG_URL =
  process.env.COVID19_IG_URL ||
  'https://jembi.github.io/covid19-immunization-ig'
const resourceTypes = ['CodeSystem', 'ConceptMap', 'ValueSet']

const postToFHIRServer = ({resourceName, data}) =>
  new Promise((resolve, reject) => {
    const options = {
      protocol: process.env.COVID19_IG_PROTOCOL || 'http:',
      host: HAPI_FHIR_HOSTNAME,
      port: HAPI_FHIR_PORT,
      path: `${HAPI_FHIR_PATH}/${resourceName}/${JSON.parse(data).id}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }

    const req = http.request(options, res => {
      if (res.statusCode !== 201) {
        let responseData = ''
        res.on('data', chunk => {
          responseData += chunk.toString()
        })

        res.on('end', () => {
          if (responseData) {
            reject(`${resourceName} resource creation failed: ${responseData}`)
          }
        })

        res.on('error', reject)
        return
      } else {
        resolve(`Successfully created ${resourceName} resource`)
      }
    })

    req.on('error', error => {
      reject('Failed to add resource: ', error)
    })

    req.write(data)
    req.end()
  })

const getResources = async url => {
  const response = await axios.get(url, {responseType: 'arraybuffer'})
  const zip = AdmZip(response.data)
  return zip
    .getEntries()
    .filter(
      entry =>
        entry.entryName.endsWith('.json') &&
        !entry.entryName.startsWith('ImplementationGuide')
    )
}

const findMatch = ({file, resourceTypes}) => {
  const regex = new RegExp(resourceTypes.join('|'), 'g')
  const match = file.match(regex)
  return match ? match[0] : null
}

const buildResourceCollectionsObject = ({files, resourceTypes}) => {
  const result = Object.create({Other: []})
  resourceTypes.forEach(resourceType => {
    result[resourceType] = []
  })

  files.forEach(file => {
    const match = findMatch({file: file.entryName, resourceTypes})
    result[match ? match : 'Other'].push(file)
  })

  return result
}

const getResourceType = ({file, resourceTypes}) => {
  const match = findMatch({file, resourceTypes})
  return match || file.split(/-/)[0]
}

async function sendResources(resources) {
  if (!resources.length) return

  const resource = resources.pop()
  const resourceName = getResourceType({
    file: resource.entryName,
    resourceTypes
  })
  const data = resource.getData().toString('utf-8')
  await postToFHIRServer({resourceName, data})

  await sendResources(resources)
}

;(async () => {
  const resources = await getResources(`${COVID19_IG_URL}/definitions.json.zip`)
  const resourceCollections = buildResourceCollectionsObject({
    files: resources,
    resourceTypes
  })

  try {
    await sendResources(
      resourceCollections['Other'].concat(
        resourceCollections['ValueSet'],
        resourceCollections['CodeSystem'],
        resourceCollections['ConceptMap']
      )
    )
    console.log('Posting of Resources resources to Hapi FHIR successfully done')
  } catch (err) {
    console.log(err)
  }
})()
