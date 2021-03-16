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
  const result = await sendRequest(patient, 'patient-registration')
  patientId = result.data.id
}

exports.getPatientUnAuthorized = async () => {
  try {
    await sendRequest('', 'patient-search', 'GET', 'invalid Token')
  } catch (_err) {
    authorizationError = true
  }
}

exports.getPatientAuthorized = async () => {
  const response = await sendRequest(
    '',
    `patient-search?_id=${patientId}`,
    'GET'
  )
  retrievedPatient = response.data.entry[0].resource
}

exports.verifyPatientRetrievalAndCleanup = async () => {
  if (
    !retrievedPatient ||
    retrievedPatient.name[0].given[0] != patient.name[0].given[0]
  )
    throw Error('Verification of patient retrieval has failed')

  await deleteResource(retrievedPatient.id, 'Patient')
}

exports.verifyAuthorizationError = () => {
  if (!authorizationError) throw Error('Could not verify authorization error')
}
