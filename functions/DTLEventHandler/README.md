# Handling DTL Events with Azure Functions


# Local Debugging
https://docs.microsoft.com/en-us/azure/azure-functions/functions-develop-local

https://[ACCOUNT ID].ngrok.io/runtime/webhooks/EventGrid?functionName=HandleEvent

# Identity
Function app must be assigned a System Managed Identity not User Managed

# Deployment
npm run build:production 
func azure functionapp publish <APP_NAME>