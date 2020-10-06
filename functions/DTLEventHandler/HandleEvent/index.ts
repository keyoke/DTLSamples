import { AzureFunction, Context } from '@azure/functions';
import * as msRest from "@azure/ms-rest-js";
import * as msRestAzure from "@azure/ms-rest-azure-js";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { AppAuthentication } from '../SharedCode/AppAuthentication';
import { DesktopVirtualization } from '../SharedCode/DesktopVirtualization';

const auth = new AppAuthentication();
const clientOptions: msRestAzure.AzureServiceClientOptions = { };
// WVD Details
const subscriptionId = process.env["SUBSCRIPTION_ID"];
const resourceGroupName = process.env["RESOURCE_GROUP_NAME"];
const hostPoolName = process.env["HOST_POOL_NAME"];

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
    const desktopVirtualization = new DesktopVirtualization(client);

    // Claim event for the DTL VM
    if(eventGridEvent.eventType === "Microsoft.Resources.ResourceActionSuccess" && 
        eventGridEvent.data.operationName === "microsoft.devtestlab/labs/virtualmachines/claim/action") {
        // Get non-standard Lab event properties
        const vm = resourceUriSegments[10];
        const claimer = eventGridEvent.data.claims["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn"];
        context.log(`VM '${vm}' claimed by '${claimer}' for DTL Lab '${lab}'.`);

        // Example of performing user direct assignment for the WVD session host
        if(await desktopVirtualization.AssignUser(subscriptionId, resourceGroupName, hostPoolName, vm, claimer))
        {

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
