const fs = require("fs");

const createJdlFromJson = (fileName, res) => {
    console.log(fileName);

    // read the JSON file
    const jsonData = JSON.parse(fs.readFileSync(fileName + '.json', 'utf8'));

    // Applications
    const applications = jsonData.application;
    const applicationCount = Object.keys(applications).length;
    const appData = [];
    const applicationError = new Map();
    for (let i = 0; i < applicationCount; i++) {
        // Error handling
        if (applications[i].applicationName === "") {
            if (i in applicationError)
                applicationError.get(i).set("Application Name cannot be empty");
            else
                applicationError[i] = ["Application Name cannot be empty"];
        }
        if (applications[i].applicationType === "") {
            if (i in applicationError)
                applicationError.get(i).set("Application Type cannot be empty");
            else
                applicationError[i] = ["Application Type cannot be empty"];
        }
        if (applications[i].packageName === "") {
            if (i in applicationError)
                applicationError.get(i).set("Package Name cannot be empty");
            else
                applicationError[i] = ["Package Name cannot be empty"];
        }
        if (applications[i].authenticationType === "") {
            if (i in applicationError)
                applicationError.get(i).set("Authentication Type cannot be empty");
            else
                applicationError[i] = ["Authentication Type cannot be empty"];
        }
        if (applications[i].databaseType === "") {
            if (i in applicationError)
                applicationError.get(i).set("Database cannot be empty");
            else
                applicationError[i] = ["Database cannot be empty"];
        }
        if (applications[i].prodDatabaseType === "") {
            if (i in applicationError)
                applicationError.get(i).set("Prod Database cannot be empty");
            else
                applicationError[i] = ["Prod Database cannot be empty"];
        }
        if (applications[i].clientFramework === "") {
            if (i in applicationError)
                applicationError.get(i).set("Client framework cannot be empty");
            else
                applicationError[i] = ["Client framework cannot be empty"];
        }
        if (applications[i].serviceDiscoveryType === "") {
            if (i in applicationError)
                applicationError.get(i).set("Service discovery type cannot be empty");
            else
                applicationError[i] = ["Service discovery type cannot be empty"];
        }
        if (applications[i].serverPort === "") {
            if (i in applicationError)
                applicationError.get(i).set("Server Port cannot be empty");
            else
                applicationError[i] = ["Server Port cannot be empty"];
        }

        // Conversion of json to jdl (Application Options)
        const data = `
application {
    config {
        baseName ${applications[i].applicationName.toLowerCase()},
        applicationType ${applications[i].applicationType.toLowerCase()},
        packageName ${applications[i].packageName.toLowerCase()},
        authenticationType ${applications[i].authenticationType.toLowerCase()},
        databaseType ${applications[i].databaseType.toLowerCase()},
        prodDatabaseType ${applications[i].prodDatabaseType.toLowerCase()},
        clientFramework ${applications[i].clientFramework.toLowerCase()},
        serviceDiscoveryType ${applications[i].serviceDiscoveryType.toLowerCase()},
        serverPort ${applications[i].serverPort},
    }
    entities *
}
    
`;
        appData.push(data);
    }


    // Communications
    const communications = jsonData.communication;
    const communicationCount = Object.keys(communications).length;
    const communicationData = [];
    const communicationError = new Map();
    for (let i = 0; i < communicationCount; i++) {
        // Error handling
        if (communications[i].clientName === "") {
            if (i in communicationError)
                communicationError.get(i).set("Client Name cannot be empty");
            else
                communicationError[i] = ["Client Name cannot be empty"];
        }
        if (communications[i].serverName === "") {
            if (i in communicationError)
                communicationError.get(i).set("Server Name cannot be empty");
            else
                communicationError[i] = ["Server Name cannot be empty"];
        }
        const data = `
communication {
    client "${communications[i].clientName.toLowerCase()}",
    server "${communications[i].serverName.toLowerCase()}"
}
    
`;

    communicationData.push(data);
    }


    // deployment 
    const deployment = jsonData.deployment;
    let deploymentError = [];
    // Error handling
    if (deployment.deploymentType === "") {
        deploymentError.push("Deployment Type cannot be empty");
    }
    if (deployment.appsFolders === []) {
        deploymentError.push("Application Folders cannot be empty");
    }
    if (deployment.dockerRepositoryName === "") {
        deploymentError.push("Repository Name cannot be empty");
    }
    if (deployment.serviceDiscoveryType === "") {
        deploymentError.push("Service discovery Type cannot be empty");
    }
    if (deployment.kubernetesServiceType === "") {
        deploymentError.push("Kubernetes Service Type cannot be empty");
    }
    if (deployment.ingressDomain === "") {
        deploymentError.push("Ingress Domain cannot be empty");
    }
    if (deployment.ingressType === "") {
        deploymentError.push("Ingress Type cannot be empty");
    }
    if (deployment.kubernetesUseDynamicStorage === "") {
        deploymentError.push("Use Dynamic Storage cannot be empty");
    }
    
    const deploymentData = `
deployment {
    deploymentType ${deployment.deploymentType.toLowerCase()},
    appsFolders [${deployment.appsFolders}],
    dockerRepositoryName "${deployment.dockerRepositoryName.toLowerCase()}",
    kubernetesNamespace ${deployment.kubernetesNamespace.toLowerCase()},
    serviceDiscoveryType ${deployment.serviceDiscoveryType.toLowerCase()},
    istio ${deployment.istio.toLowerCase()},
    ingressDomain "${deployment.ingressDomain.toLowerCase()}",
    kubernetesUseDynamicStorage ${deployment.kubernetesUseDynamicStorage.toLowerCase()},
    kubernetesStorageClassName "${deployment.kubernetesStorageClassName.toLowerCase()}",
    kubernetesStorageProvisioner "${deployment.kubernetesStorageProvisioner.toLowerCase()}",


}

`;


    const errorData = new Map();
    if(applicationError.size > 0)
        errorData["applications"] = applicationError;
    if(communicationError.size > 0)
        errorData["communication"] = communicationError;
    if(deploymentError.length > 0)
        errorData["deployment"] = deploymentError;


    // return error response
    if (Object.keys(errorData).length >= 1){
        console.log(errorData);
        return res.status(400).send(errorData);
    }


    let combinedData = appData.concat(communicationData, deploymentData);


    const combinedArrayData = Array.from(combinedData);
    const concatenatedJDL = combinedArrayData.join(' ');
    

    fs.writeFile(fileName + '.jdl', concatenatedJDL, (err) => {
        if (err) throw err;
        console.log('Json data written to JDL file');
    });

};


module.exports = {
    createJdlFromJson: createJdlFromJson
} 