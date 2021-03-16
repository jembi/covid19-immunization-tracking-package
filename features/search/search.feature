Feature: Patient-search

  Rule: An authorized client should be able to retrieve a patient
    Scenario: An authorized client requests a patient
      Given that the openhim and mediators are up and running
      And the patient exists
      When an authorized client requests a patient
      Then the patient should be retrieved
