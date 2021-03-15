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

exports.verifyOpenhimIsRunning = verifyOpenhimIsRunning

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
    `Immunization?patient=${immunization.patient.reference}`
  )
}
