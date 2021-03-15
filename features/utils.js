'use strict'

const axios = require('axios')

const OPENHIM_PROTOCOL = process.env.OPENHIM_PROTOCOL || 'http'
const OPENHIM_API_HOSTNAME = process.env.OPENHIM_API_HOSTNAME || 'localhost'
const OPENHIM_TRANSACTION_API_PORT =
  process.env.OPENHIM_TRANSACTION_API_PORT || '5001'
const OPENHIM_API_PORT = process.env.OPENHIM_API_PORT || '8080'
const CUSTOM_TOKEN_ID = process.env.CUSTOM_TOKEN_ID || '8c161731-4e72-4446-8950-ce79aadaa75c'

const deleteResource = (id, resourceType) => {
  return axios({
      url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_TRANSACTION_API_PORT}/fhir/${resourceType}/${id}`,
      method: 'DELETE'
  })
}

const retrieveResource = path => {
  return axios({
    url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_TRANSACTION_API_PORT}/fhir/${path}`,
    method: 'GET'
  })
}

exports.deleteResource = deleteResource

exports.verifyOpenhimIsRunning = async () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
  const response = await axios({
    url: `https://${OPENHIM_API_HOSTNAME}:${OPENHIM_API_PORT}/heartbeat`,
    method: 'GET'
  })

  if (response.status !== 200) throw Error('The OpenHim is currently down')

  if (
    !response.data.mediators ||
    !Object.keys(response.data.mediators).length
  ) throw Error('Mediators are currently down')
}

exports.sendRequest = async (data, path, method = 'POST', token = CUSTOM_TOKEN_ID) => {
  const response = await axios({
    url: `${OPENHIM_PROTOCOL}://${OPENHIM_API_HOSTNAME}:${OPENHIM_TRANSACTION_API_PORT}/${path}`,
    method: method,
    headers: {
      "Content-Type": 'application/json',
      Authorization: `Custom ${token}`
    },
    data: data
  })

  if (response.status != 202) throw Error(`Sending of request on path ${path} failed`)
  return response
}

exports.verifyResourceExistsAndCleanup = async path => {
  const retrievedResult = await retrieveResource(path)

  if (retrievedResult.status != 200 || !retrievedResult.data.total) {
    throw Error(`Resource on path ${path} does not exist`)
  }

  const deleteResult = await deleteResource(
    retrievedResult.data.entry[0]._id,
    retrievedResult.data.entry[0].resourceType
  )

  if (deleteResult.status != 200) {
    throw Error(`Resource on path ${path} could not be deleted`)
  }
}
