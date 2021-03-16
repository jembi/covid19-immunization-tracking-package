Feature: Patient-search-authorization

  Rule: An unauthorized client should not be able to retrieve a patient
    Scenario: An unauthorized client requests a patient
      Given that the openhim and mediators are up and running
      When an unauthorized client requests a patient
      Then there should be an authorization error
