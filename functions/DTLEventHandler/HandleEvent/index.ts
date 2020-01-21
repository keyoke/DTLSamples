import { AzureFunction, Context } from '@azure/functions';
import * as msRest from "@azure/ms-rest-js";
import * as msRestAzure from "@azure/ms-rest-azure-js";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { AppAuthentication } from '../SharedCode/AppAuthentication';
import { DevTestLabs } from '../SharedCode/DevTestLabs';

const auth = new AppAuthentication();
const clientOptions: msRestAzure.AzureServiceClientOptions = { };

// When we get here we have already filtered only the events we are interested in
const handleEvent: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {
    // Log the incoming event payload
    context.log(eventGridEvent);

    // Get standard Lab event properties
    const resourceUri = eventGridEvent.data.resourceUri;
    const resourceUriSegments = resourceUri.split("/");
    const subscription = resourceUriSegments[2];
    const resourceGroup = resourceUriSegments[4];
    const lab = resourceUriSegments[8];

    // Get our login credentials and setup the DTL client
    const credentials = await auth.getAppServiceCredentialsAsync();
    const client = new msRestAzure.AzureServiceClient(credentials, clientOptions);
    const devTestLabs = new DevTestLabs(client);

    // Create or Update a DTL Lab
    if(eventGridEvent.eventType === "Microsoft.Resources.ResourceWriteSuccess" && 
        eventGridEvent.data.operationName === "microsoft.devtestlab/labs/write") {
        context.log(`DTL Lab '${lab}' created or updated!`);
    }

    // Create Or Update DTL VM
    if(eventGridEvent.eventType === "Microsoft.Resources.ResourceWriteSuccess" && 
    eventGridEvent.data.operationName === "microsoft.devtestlab/labs/virtualmachines/write")  {
        // Get non-standard Lab event properties
        const vm = resourceUriSegments[10];
        context.log(`VM '${vm}' created or updated for DTL Lab '${lab}'.`);
    }

    // Start DTL VM
    if(eventGridEvent.eventType === "Microsoft.Resources.ResourceActionSuccess" && 
        eventGridEvent.data.operationName === "microsoft.devtestlab/labs/virtualmachines/start/action") {
        // Get non-standard Lab event properties
        const vm = resourceUriSegments[10];
        context.log(`VM '${vm}' started for DTL Lab '${lab}'.`);
    }

    // Claim event for the DTL VM
    if(eventGridEvent.eventType === "Microsoft.Resources.ResourceActionSuccess" && 
        eventGridEvent.data.operationName === "microsoft.devtestlab/labs/virtualmachines/claim/action") {
        // Artifact Details
        const artifactName = "Add user to Local Group";
        const artifactSourceName = process.env["ARTIFACT_SOURCE_NAME"];
        // Get non-standard Lab event properties
        const vm = resourceUriSegments[10];
        const claimer = eventGridEvent.data.claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"];
        context.log(`VM '${vm}' claimed by '${claimer}' for DTL Lab '${lab}'.`);

        // Example of Applying a DTL VM Artifact
        if(await devTestLabs.applyVMArtifact(subscription, resourceGroup, lab, vm, artifactSourceName, artifactName))
        {
            context.log('Artifacts Successfully Applied!');
        }
    }

    // Unclaim event for the DTL VM
    if(eventGridEvent.eventType === "Microsoft.Resources.ResourceActionSuccess" && 
        eventGridEvent.data.operationName === "microsoft.devtestlab/labs/virtualmachines/unclaim/action") {
        // Get non-standard Lab event properties
        const vm = resourceUriSegments[10];
        const claimer = eventGridEvent.data.claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"];
        context.log(`VM '${vm}' unclaimed by '${claimer}' for DTL Lab '${lab}'.`);
    }
};

export default handleEvent;
