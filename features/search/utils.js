'use strict'

const fs = require('fs')

const {
  sendRequest,
  deleteResource,
  verifyOpenhimIsRunning
} = require('../utils')

let authorizationError, retrievedPatient, patientId

const patient = JSON.parse(
  fs.readFileSync(`${__dirname}/payload/patient.json`, 'utf8')
)

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

exports.ensurePatientExists = async () => {
  const response = await sendRequest(patient, 'patient-registration')
  patientId = response.data._id
}

exports.getPatientUnAuthorized = async () => {
  try {
    await sendRequest('', 'patient-search', 'GET', 'invalid Token')
  } catch (_err) {
    authorizationError = true
  }
}

exports.getPatientAuthorized = async () => {
  const response = await sendRequest('', `patient-search?_id=${patientId}`, 'GET')
  retrievedPatient = response.data
}

exports.verifyPatientRetrievalAndCleanUp = () => {
  if (
    !retrievedPatient ||
    retrievedPatient.patient.reference != patient.patient.reference
  ) throw Error('Verification of patient retrieval has failed')

  await deleteResource(patientId, 'Patient')
}
