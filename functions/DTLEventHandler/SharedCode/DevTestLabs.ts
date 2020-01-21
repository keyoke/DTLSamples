import * as msRest from "@azure/ms-rest-js";
import * as msRestAzure from "@azure/ms-rest-azure-js";

// Replace with the NODE SDK - @azure/arm-devtestlabs?
export class DevTestLabs {
    private client: msRestAzure.AzureServiceClient;
    constructor(client: msRestAzure.AzureServiceClient) {    
        this.client = client;
    }   
    public async IsVirtualMachineReadyForArtifactsAsync(subscriptionId:string, resourceGroupName: string, devTestLabName: string, virtualMachineName: string) : Promise<boolean>
    {
        // we will return the status
        let isVmReady : boolean = false;

        // Build our HTTP GET request
        const reqDtlVM: msRest.RequestPrepareOptions = {
            url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DevTestLab/labs/${devTestLabName}/virtualmachines/${virtualMachineName}?api-version=2018-09-15`,
            method: "GET"
          };
        
        // Send the request
        const resDtlVM = await this.client.sendLongRunningRequest(reqDtlVM);

        // Make sure we get valid response status of succeeded
        if(resDtlVM.status === 200)
        {
            // get the JSON Object for the response
            const bodyDtlVM = resDtlVM.parsedBody;
            // has the VM successfully been provisioned
            if(bodyDtlVM.properties.provisioningState === "Succeeded")
            {
                
                // Build our HTTP GET request
                const reqVM: msRest.RequestPrepareOptions = {
                    url: `https://management.azure.com${bodyDtlVM.properties.computeId}?$expand=instanceView&api-version=2019-03-01`,
                    method: "GET"
                };
                
                // Send the request
                const resVM = await this.client.sendLongRunningRequest(reqVM);

                // Make sure we get valid response status of succeeded
                if(resVM.status === 200)
                {
                    // get the JSON Object for the response
                    const bodyVM = resVM.parsedBody;
                    var provisioningStates = bodyVM.properties.instanceView.statuses.filter(function(item) {
                        return item.code.startsWith('ProvisioningState/');
                      })
                    var powerStates = bodyVM.properties.instanceView.statuses.filter(function(item) {
                        return item.code.startsWith('PowerState/');
                      })
                    // has the VM successfully been provisioned
                    if(powerStates.length >= 1 &&
                        provisioningStates.length >= 1)
                    {
                        const provisioningState : string = provisioningStates[0].code.replace("ProvisioningState/", "");
                        const powerState : string = powerStates[0].code.replace("PowerState/", "");
                        if(powerState === 'running' &&
                            provisioningState === 'Succeeded')
                        {
                            isVmReady = true;
                        }
                    }
                }
            }
        }
        return isVmReady;
    }

    public async applyVMArtifact(subscriptionId:string, resourceGroupName: string, devTestLabName: string, virtualMachineName: string, artifactSourceName: string, artifactName: string) : Promise<boolean>
    {
        // we will return the status
        let isArtifactApplied : boolean = false;
        if(await this.IsVirtualMachineReadyForArtifactsAsync(subscriptionId, resourceGroupName, devTestLabName, virtualMachineName))
        {
            // We can Safely install the Artifacts here
            isArtifactApplied = true;
        }

        return isArtifactApplied;
    }
}