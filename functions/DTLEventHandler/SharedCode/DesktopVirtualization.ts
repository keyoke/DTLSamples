import * as msRest from "@azure/ms-rest-js";
import * as msRestAzure from "@azure/ms-rest-azure-js";

// Replace with the NODE SDK - @azure/arm-devtestlabs?
export class DesktopVirtualization {
    private client: msRestAzure.AzureServiceClient;
    constructor(client: msRestAzure.AzureServiceClient) {    
        this.client = client;
    }   
    public async ApplyAppRole(tenantGroupName:string, tenantName: string, hostPoolName: string, roleName: string, appId: string) : Promise<boolean>
    {
        // we will return the status
        let isAppRoleAssigned : boolean = false;

        // https://docs.microsoft.com/en-us/rest/api/virtual-desktop/hostpool/assignapplicationrole
        const reqAppRole: msRest.RequestPrepareOptions = {
            url: `https://rdbroker.wvd.microsoft.com/RdsManagement/V1/TenantGroups/${tenantGroupName}/Tenants/${tenantName}/HostPools/${hostPoolName}/Rds.Authorization/roleAssignments/${roleName}/Users/appid/${appId}`,
            method: "PUT"
          };

          // Send the request
        const resAppRole = await this.client.sendLongRunningRequest(reqAppRole);

        if(resAppRole.status === 200)
        {
            isAppRoleAssigned = true;
        }
       
        return isAppRoleAssigned;
    }
    public async ApplyUserRole(tenantGroupName:string, tenantName: string, hostPoolName: string, roleName: string, upn: string) : Promise<boolean>
    {
        // we will return the status
        let isUserAssigned : boolean = false;

        // https://docs.microsoft.com/en-us/rest/api/virtual-desktop/hostpool/assignuserrole
        const reqUserRole: msRest.RequestPrepareOptions = {
            url: `https://rdbroker.wvd.microsoft.com/RdsManagement/V1/TenantGroups/${tenantGroupName}/Tenants/${tenantName}/HostPools/${hostPoolName}/Rds.Authorization/roleAssignments/${roleName}/Users/upn/${upn}`,
            method: "PUT"
          };

        // Send the request
        const resUserRole = await this.client.sendLongRunningRequest(reqUserRole);

        if(resUserRole.status === 200)
        {
            isUserAssigned = true;
        }
       
        return isUserAssigned;
    }
}