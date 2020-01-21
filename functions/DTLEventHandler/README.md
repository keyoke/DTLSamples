# Handling DTL Events with Azure Functions

# Local Configuration
For running this function locally you will need to add the following keys to a local.settings.json file in function app root
{
  "Values": {
    "APPINSIGHTS_INSTRUMENTATIONKEY": "[APPLICATION INSIGHTS IKEY]",
    "SERVICE_PRINCIPAL_CLIENT_ID":"[SP CLIENT ID FOR LOCAL DEBUGGING]",
    "SERVICE_PRINCIPAL_CLIENT_SECRET":"[SP CLIENT SECRET FOR LOCAL DEBUGGING]",
    "SERVICE_PRINCIPAL_TENANT_ID":"[SP TENANT ID FOR LOCAL DEBUGGING]"
  }
}

# Local Debugging
https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-local

https://[ACCOUNT ID].ngrok.io/runtime/webhooks/EventGrid?functionName=HandleEvent

# Identity
Function app must be assigned a System Managed Identity not User Managed

# Deployment
npm run build:production 
func azure functionapp publish <APP_NAME>