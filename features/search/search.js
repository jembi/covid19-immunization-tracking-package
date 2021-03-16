'use strict'

const {Given, When, Then, setDefaultTimeout} = require('@cucumber/cucumber')
const {
  getPatientAuthorized,
  getPatientUnAuthorized,
  verifyAuthorizationError,
  verifyPatientRetrievalAndCleanup,
  ensurePatientExists
} = require('./utils')

setDefaultTimeout(20000)

Given('the patient exists', ensurePatientExists)

When('an authorized client requests a patient', getPatientAuthorized)

When('an unauthorized client requests a patient', getPatientUnAuthorized)

Then('there should be a search authorization error', verifyAuthorizationError)

Then('the patient should be retrieved', verifyPatientRetrievalAndCleanup)
