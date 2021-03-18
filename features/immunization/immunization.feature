Feature: Patient-immunization

  Rule: An authorized client should be able to send through an immunization

    Scenario: An authorized client sends an immunization
      Given that the openhim and mediators are up and running
      And the patient for the immunization exists
      When an immunization is sent through by an authorized client
      Then the immunization should exist in Hapi Fhir
