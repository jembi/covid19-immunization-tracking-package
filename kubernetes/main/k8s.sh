#!/bin/bash

k8sMainRootFilePath=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

if [ "$1" == "init" ]; then
    kubectl apply -k $k8sMainRootFilePath
    bash "$k8sMainRootFilePath"/../importer/k8s.sh up

    # TODO add ../importer/volume/config_instant.json file to OpenCR volume then restart the OpenCR container
    # See this packages compose.sh docker script

elif [ "$1" == "up" ]; then
    kubectl apply -k $k8sMainRootFilePath
elif [ "$1" == "down" ]; then
    kubectl delete deployment covid19immunization-mapper-deployment
elif [ "$1" == "destroy" ]; then
    kubectl delete deployments,services,jobs -l package=covid19immunization
else
    echo "Valid options are: up, down, or destroy"
fi
