Feature: Patient-immunization-authorization

  Rule: An unauthorized client should not be able to send through an immunization

    Scenario: An unauthorized client sends an immunization
      Given that the openhim and mediators are up and running
      When an immunization is sent through by an unauthorized client
      Then there should be an immunization authorization error
