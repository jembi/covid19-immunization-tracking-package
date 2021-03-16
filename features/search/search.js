'use strict'

const {Given, When, Then, setDefaultTimeout} = require('@cucumber/cucumber')
const {
  verifyOpenhimIsRunning,
  getPatientAuthorized,
  getPatientUnAuthorized,
  verifyAuthorizationError,
  verifyPatientRetrievalAndCleanup,
  ensurePatientExists
} = require('./utils')

setDefaultTimeout(20000)

Given(
  'that the openhim and mediators are up and running',
  verifyOpenhimIsRunning
)

Given('the patient exists', ensurePatientExists)

When('an authorized client requests a patient', getPatientAuthorized)

When('an unauthorized client requests a patient', getPatientUnAuthorized)

Then('there should be an authorization error', verifyAuthorizationError)

Then('the patient should be retrieved', verifyPatientRetrievalAndCleanup)
