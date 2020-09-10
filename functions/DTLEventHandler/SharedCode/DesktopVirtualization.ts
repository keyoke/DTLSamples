import * as msRest from "@azure/ms-rest-js";
import * as msRestAzure from "@azure/ms-rest-azure-js";

// Replace with the NODE SDK - @azure/arm-devtestlabs?
export class DesktopVirtualization {
    private client: msRestAzure.AzureServiceClient;
    constructor(client: msRestAzure.AzureServiceClient) {    
        this.client = client;
    }   
    public async AssignUser(subscriptionId:string, resourceGroupName: string, hostPoolName: string, sessionHostName: string, upn: string) : Promise<boolean>
    {
        // we will return the status
        let isUserAssigned : boolean = false;

        // https://docs.microsoft.com/en-Us/rest/api/desktopvirtualization/sessionhosts/update
        const reqAssignUser: msRest.RequestPrepareOptions = {
            url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DesktopVirtualization/hostPools/${hostPoolName}/sessionHosts/${sessionHostName}?api-version=2019-12-10-preview`,
            method: "PATCH",
            body: {
                properties: {
                    assignedUser : `${upn}`
                }
            }
          };

        // Send the request
        const resAssignUser = await this.client.sendLongRunningRequest(reqAssignUser);

        if(resAssignUser.status === 200)
        {
            isUserAssigned = true;
        }
       
        return isUserAssigned;
    }
}