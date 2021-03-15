'use strict'

const {Given, When, Then, setDefaultTimeout} = require('@cucumber/cucumber')
const {
  verifyOpenhimIsRunning,
  sendImmunizationAuthorized,
  sendImmunizationUnAuthorized,
  verifyAuthorizationError,
  verifyImmunizationExistsAndCleanup
} = require('./utils')

setDefaultTimeout(20000)

Given(
  'that the openhim and mediators are up and running',
  verifyOpenhimIsRunning
)

When(
  'immunization is sent through by an authorized client',
  sendImmunizationAuthorized
)

When(
  'immunization is sent through by an unauthorized client',
  sendImmunizationUnAuthorized
)

Then('there should be an authorization error', verifyAuthorizationError)

Then(
  'the immunization should exist in Hapi Fhir',
  verifyImmunizationExistsAndCleanup
)
