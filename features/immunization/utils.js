'use strict'

const fs = require('fs')

const {
  sendRequest,
  verifyResourceExistsAndCleanup,
  verifyOpenhimIsRunning
} = require('../utils')

let authorizationError

const immunization = JSON.parse(
  fs.readFileSync(`${__dirname}/payload/immunization.json`, 'utf8')
)
const patient = JSON.parse(
  fs.readFileSync(`${__dirname}/payload/patient.json`, 'utf8')
)

// set the immunization patient reference
immunization.patient.reference = `Patient/${patient.id}`

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

exports.ensurePatientExists = async () => {
  await sendRequest(patient, `fhir/Patient/${patient.id}`, 'PUT')
}

exports.sendImmunizationAuthorized = async () => {
  await sendRequest(immunization, 'immunization')
}

exports.sendImmunizationUnAuthorized = async () => {
  try {
    await sendRequest(immunization, 'immunization', 'POST', 'Invalid token')
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
  await verifyResourceExistsAndCleanup(
    `/Immunization?patient=${immunization.patient.reference}`
  )
}
