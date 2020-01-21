import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
export class AppAuthentication {
    private clientId = process.env["SERVICE_PRINCIPAL_CLIENT_ID"];
    private secret = process.env["SERVICE_PRINCIPAL_CLIENT_SECRET"];
    private tenant = process.env["SERVICE_PRINCIPAL_TENANT_ID"];
    public async getAppServiceCredentialsAsync() : Promise<msRestNodeAuth.MSIAppServiceTokenCredentials | msRestNodeAuth.ApplicationTokenCredentials>{
        if (process.env["MSI_ENDPOINT"]){
          return await this.loginWithAppServiceMSI();
        } else {  
          // https://docs.microsoft.com/en-us/javascript/api/@azure/ms-rest-nodeauth/index?view=azure-node-latest#withauthfile-any-
          // Alternative to supplying SP details manually
          // return await this.loginWithAuthFileAsync();
          return this.loginWithServicePrincipalSecret();
        }
    }

    private async loginWithAppServiceMSI() : Promise<msRestNodeAuth.MSIAppServiceTokenCredentials> {
      return new Promise<msRestNodeAuth.MSIAppServiceTokenCredentials>((resolve, reject) => {
          msRestNodeAuth.loginWithAppServiceMSI((err : Error, credentials : msRestNodeAuth.MSIAppServiceTokenCredentials) => {
            if(err)
            {
              reject(err);
            }
            else
            {
              resolve(credentials);
            }
          });
      });
    }
    
    private async loginWithAuthFileAsync() : Promise<msRestNodeAuth.ApplicationTokenCredentials> {
      return new Promise<msRestNodeAuth.ApplicationTokenCredentials>((resolve, reject) => {
          msRestNodeAuth.loginWithAuthFile((err: Error, credentials: msRestNodeAuth.ApplicationTokenCredentials, subscriptions : Array<msRestNodeAuth.LinkedSubscription>) => {
            if(err)
            {
              reject(err);
            }
            else
            {
              resolve(credentials);
            }
          });
      });
  }

  private loginWithServicePrincipalSecret() : Promise<msRestNodeAuth.ApplicationTokenCredentials> {
    return msRestNodeAuth.loginWithServicePrincipalSecret(this.clientId, this.secret,this.tenant);
  }
}