Feature: Patient-authorization

  Rule: An unauthorized client should not be able to send through a registration

    Scenario: An unauthorized client sends a registration
      Given that the openhim and mediators are up and running
      When registration is sent through by an unauthorized client
      Then there should be an authorization error
