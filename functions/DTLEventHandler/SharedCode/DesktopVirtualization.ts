import * as msRest from "@azure/ms-rest-js";
import * as msRestAzure from "@azure/ms-rest-azure-js";

// Replace with the NODE SDK - @azure/arm-devtestlabs?
export class DesktopVirtualization {
    private client: msRestAzure.AzureServiceClient;
    constructor(client: msRestAzure.AzureServiceClient) {    
        this.client = client;
    }   
    public async AddUserAppGroup(tenantGroupName:string, tenantName: string, hostPoolName: string, appGroupName: string, upn: string) : Promise<boolean>
    {
        // we will return the status
        let isAddUserAppGroup : boolean = false;

        // https://docs.microsoft.com/en-us/rest/api/virtual-desktop/appgroup/adduser
        const reqAddUserAppGroup: msRest.RequestPrepareOptions = {
            url: `https://rdbroker.wvd.microsoft.com/RdsManagement/V1/TenantGroups/${tenantGroupName}/Tenants/${tenantName}/HostPools/${hostPoolName}/AppGroups/${appGroupName}/AssignedUsers/${upn}`,
            method: "POST"
          };

          // Send the request
        const resAddUserAppGroup = await this.client.sendLongRunningRequest(reqAddUserAppGroup);

        if(resAddUserAppGroup.status === 200)
        {
            isAddUserAppGroup = true;
        }
       
        return isAddUserAppGroup;
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