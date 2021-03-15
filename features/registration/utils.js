'use strict'

const fs = require('fs')

const {
  sendRequest,
  verifyOpenhimIsRunning,
  verifyResourceExistsAndCleanup
} = require('../utils')

let authorizationError

const patient = JSON.parse(
  fs.readFileSync(`${__dirname}/payload/patient.json`, 'utf8')
)

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

exports.sendRegistrationAuthorized = () => {
  await sendRequest(patient, 'patient-registration')
}

exports.sendRegistrationUnAuthorized = async () => {
  try {
    await sendRequest(patient, 'patient-registration', 'POST', 'invalid Token')
  } catch (_err) {
    authorizationError = true
  }
}

exports.verifyAuthorizationError = () => {
  if (!authorizationError) throw Error('Could not verify authorization error')
}

exports.verifyRegistrationExistsAndCleanup = async () => {
  await verifyResourceExistsAndCleanup(`Patient?given=${patient.name[0].given[0]}`)
}
