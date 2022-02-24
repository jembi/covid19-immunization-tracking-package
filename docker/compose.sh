#!/bin/bash

sleep 10

composeFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/docker-compose.dev.yml -f "$composeFilePath"/importer/docker-compose.config.yml up -d

    echo "Sleep 90 - Give importers time to complete"
    sleep 90

    docker rm covid19-immunization-openhim-config-importer covid19-immunization-config-importer hapi-fhir-config-importer opencr-config-importer
elif [ "$1" == "up" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/docker-compose.dev.yml up -d
elif [ "$1" == "down" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/docker-compose.dev.yml -f "$composeFilePath"/importer/docker-compose.config.yml stop
elif [ "$1" == "destroy" ]; then
    docker-compose -p instant -f "$composeFilePath"/docker-compose.yml -f "$composeFilePath"/docker-compose.dev.yml -f "$composeFilePath"/importer/docker-compose.config.yml down
else
    echo "Valid options are: init, up, down, or destroy"
fi
