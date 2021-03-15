'use strict'

const fs = require('fs')

const {
  sendRequest,
  deleteResource,
  verifyOpenhimIsRunning
} = require('../utils')

let authorizationError, retrievedPatient

const patient = JSON.parse(
  fs.readFileSync(`${__dirname}/payload/patient.json`, 'utf8')
)

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

exports.ensurePatientExists = async () => {
  await sendRequest(patient, 'patient-registration')
}

exports.getPatientUnAuthorized = async () => {
  try {
    await sendRequest('', 'patient-search', 'GET', 'invalid Token')
  } catch (_err) {
    authorizationError = true
  }
}

exports.getPatientAuthorized = async () => {
  const response = await sendRequest('', `patient-search?given:exact=${patient.name[0].given[0]}`, 'GET')
  retrievedPatient = response.data.entry[0]
}

exports.verifyPatientRetrievalAndCleanUp = () => {
  if (
    !retrievedPatient ||
    retrievedPatient.name[0].given[0] != patient.name[0].given[0]
  ) throw Error('Verification of patient retrieval has failed')

  await deleteResource(retrievedPatient._id, 'Patient')
}
