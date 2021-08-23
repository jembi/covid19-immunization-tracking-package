'use strict'

const fs = require('fs')

const {
  sendRequest,
  verifyOpenhimIsRunning,
  verifyResourceExistsAndCleanup
} = require('../utils')

let authorizationError, patientId

const patient = JSON.parse(
  fs.readFileSync(`${__dirname}/payload/patient.json`, 'utf8')
)

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

exports.sendRegistrationAuthorized = async () => {
  const result = await sendRequest(patient, 'Patient')
  patientId = result.data.id
}

exports.sendRegistrationUnAuthorized = async () => {
  try {
    await sendRequest(patient, 'Patient', 'POST', 'invalid Token')
  } catch (_err) {
    authorizationError = true
  }
}

exports.verifyAuthorizationError = () => {
  if (!authorizationError) throw Error('Could not verify authorization error')
}

exports.verifyRegistrationExistsAndCleanup = async () => {
  await verifyResourceExistsAndCleanup(`Patient?_id=${patientId}`)
}
