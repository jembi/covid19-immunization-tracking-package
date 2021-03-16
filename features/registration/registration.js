'use strict'

const {When, Then, setDefaultTimeout} = require('@cucumber/cucumber')
const {
  sendRegistrationAuthorized,
  sendRegistrationUnAuthorized,
  verifyAuthorizationError,
  verifyRegistrationExistsAndCleanup
} = require('./utils')

setDefaultTimeout(20000)

When(
  'a registration is sent through by an authorized client',
  sendRegistrationAuthorized
)

When(
  'a registration is sent through by an unauthorized client',
  sendRegistrationUnAuthorized
)

Then(
  'there should be a registration authorization error',
  verifyAuthorizationError
)

Then(
  'the registration should exist in Hapi Fhir',
  verifyRegistrationExistsAndCleanup
)
