# Covid19 Immunization Tracking Package

This package sets up a mapping mediator instance that handles the mapping of COVID-19 vaccinations into FHIR resources.

To enable this package within the Instant OpenHIE, mount this project directory with your Instant OpenHIE start command. More details available on the [Instant OpenHIE docs site](https://openhie.github.io/instant/docs/how-to/creating-packages#how-to-execute-your-new-package)

## Example message structures

The input message will be sent through the OpenHIM.

The following channels are set up:

- GET  <http://localhost:5001/patient-search>
- POST <http://localhost:5001/patient-registration>
- PUT  <http://localhost:5001/patient-registration/{FHIR_ID}>
- POST <http://localhost:5001/immunization>

### Patient Resource

To **create** a patient, send through the following payload to `/patient-registration`

```json
{
  "resourceType": "Patient",
  "id": "Covid19PatientExample",
  "meta": {
    "profile": [
      "https://jembi.github.io/covid19-immunization-ig//StructureDefinition/covid19-patient"
    ]
  },
  "text": {
    "status": "extensions",
    "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><p><b>Eligible For Vaccine</b>: true</p><p><b>Patient Area Type</b>: <span title=\"Codes: \">urban</span></p><p><b>identifier</b>: id: 12345</p><p><b>name</b>: John Doe </p><p><b>telecom</b>: ph: (+27) 00 123 4567(WORK)</p><p><b>gender</b>: male</p><p><b>birthDate</b>: 1981-05-21</p></div>"
  },
  "extension": [
    {
      "url": "https://jembi.github.io/covid19-immunization-ig//StructureDefinition/eligible-for-vaccine",
      "valueBoolean": true
    },
    {
      "url": "https://jembi.github.io/covid19-immunization-ig//StructureDefinition/area-type",
      "valueCodeableConcept": {
        "coding": [
          {
            "code": "urban"
          }
        ]
      }
    }
  ],
  "identifier": [
    {
      "system": "https://jembi.github.io/covid19-immunization-ig/patient-id",
      "value": "12345"
    }
  ],
  "name": [
    {
      "family": "Doe",
      "given": ["John"]
    }
  ],
  "telecom": [
    {
      "system": "phone",
      "value": "(+27) 00 123 4567",
      "use": "work"
    }
  ],
  "gender": "male",
  "birthDate": "1981-05-21"
}
```

You should receive the created form of the Patient resource in HAPI FHIR - notice the Resource now has an `id` field.

To **update** a patient, send through the payload above to `/patient-registration/{FHIR_ID}` but add the field `id` to the object root.
Also substitute in the `id` into the Request path in the `FHIR_ID` placeholder position.

### Immunization Resource

To **create** an immunization, send through the following payload to `/immunization`

```json
{
  "resourceType" : "Immunization",
  "id" : "Covid19ImmunizationExample",
  "meta" : {
    "profile" : [
      "https://jembi.github.io/covid19-immunization-ig//StructureDefinition/covid19-immunization"
    ]
  },
  "text" : {
    "status" : "extensions",
    "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><p><b>Last Dose</b>: false</p><p><b>Dose Given</b>: true</p><p><b>status</b>: completed</p><p><b>vaccineCode</b>: <span title=\"Codes: {http://snomed.info/sct 840534001}\">COVID-19 vaccination</span></p><p><b>patient</b>: <a href=\"Covid19Patient/example\">Covid19Patient/example</a></p><p><b>occurrence</b>: Jan 26, 2021, 10:26:54 AM</p><h3>ProtocolApplieds</h3><table class=\"grid\"><tr><td>-</td><td><b>DoseNumber[x]</b></td></tr><tr><td>*</td><td>100</td></tr></table></div>"
  },
  "extension" : [
    {
      "url" : "https://jembi.github.io/covid19-immunization-ig//StructureDefinition/last-dose",
      "valueBoolean" : false
    },
    {
      "url" : "https://jembi.github.io/covid19-immunization-ig//StructureDefinition/dose-given",
      "valueBoolean" : true
    }
  ],
  "status" : "completed",
  "vaccineCode" : {
    "coding" : [
      {
        "system" : "http://snomed.info/sct",
        "code" : "840534001",
        "display" : "COVID-19 vaccination"
      }
    ]
  },
  "patient" : {
    "reference" : "Covid19Patient/example"
  },
  "occurrenceDateTime" : "2021-01-26T10:26:54.421Z",
  "protocolApplied" : [
    {
      "doseNumberPositiveInt" : 100
    }
  ]
}
```
