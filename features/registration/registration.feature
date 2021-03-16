Feature: Patient-registration

  Rule: An authorized client should be able to send through a registration

    Scenario: An authorized client sends a registration
      Given that the openhim and mediators are up and running
      When a registration is sent through by an authorized client
      Then the registration should exist in Hapi Fhir
