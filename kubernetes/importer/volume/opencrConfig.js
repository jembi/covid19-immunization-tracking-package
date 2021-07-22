'use strict'

const fs = require('fs')
const http = require('http')
const path = require('path')

const OPENCR_HOSTNAME = process.env.OPENCR_HOST_NAME || 'localhost'
const OPENCR_API_PORT = process.env.OPENCR_API_PORT || 3000

const data = fs.readFileSync(path.resolve(__dirname, 'opencr_config.json'))

const options = {
  protocol: 'http:',
  host: OPENCR_HOSTNAME,
  port: OPENCR_API_PORT,
  path: '/updateConfig',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

const req = http.request(options, res => {
  if (res.statusCode != 200) {
    throw Error(`Failed to update config: ${res.statusCode}`)
  } else {
    console.log('Successfully updated config')
  }
})

req.on('error', error => console.error('Failed to update the config: ', error))

req.write(data)
req.end()
