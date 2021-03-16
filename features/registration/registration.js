'use strict'

const {Given, When, Then, setDefaultTimeout} = require('@cucumber/cucumber')
const {
  verifyOpenhimIsRunning,
  sendRegistrationAuthorized,
  sendRegistrationUnAuthorized,
  verifyAuthorizationError,
  verifyRegistrationExistsAndCleanup
} = require('./utils')

setDefaultTimeout(20000)

Given(
  'that the openhim and mediators are up and running',
  verifyOpenhimIsRunning
)

When(
  'registration is sent through by an authorized client',
  sendRegistrationAuthorized
)

When(
  'registration is sent through by an unauthorized client',
  sendRegistrationUnAuthorized
)

Then('there should be an authorization error', verifyAuthorizationError)

Then(
  'the registration should exist in Hapi Fhir',
  verifyRegistrationExistsAndCleanup
)
