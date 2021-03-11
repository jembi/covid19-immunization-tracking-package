'use strict'

const fs = require('fs')

const {
  sendRequest,
  verifyResourceExistsAndCleanup,
  verifyOpenhimIsRunning
} = require('../utils')

let authorizationError

const immunization = JSON.parse(
  fs.readFileSync(`${__dirname}/payloads/immunization.json`, 'utf8')
)

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

exports.sendImmunizationAuthorized = async () => {
  const result = await sendRequest(immunization, 'Immunization')
  immunization.id = result.id
}

exports.sendImmunizationUnAuthorized = async () => {
  try {
    await sendRequest(immunization, 'Immunization', 'Invalid token')
  } catch (err) {
    if (err.response.status == 401) {
      authorizationError = true
    }
  }
}

exports.verifyAuthorizationError = () => {
  if (!authorizationError) throw Error('Could not verify authorization error')
}

exports.verifyImmunizationExistsAndCleanup = async () => {
  await verifyResourceExistsAndCleanup(immunization.id, 'Immunization')
}
