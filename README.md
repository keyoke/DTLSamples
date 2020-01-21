# DTLSamples
https://events-regulated-lab-hub.azurewebsites.net/runtime/webhooks/EventGrid?functionName=ClaimEventHandler&code=
https://[ACCOUNT ID].ngrok.io/runtime/webhooks/EventGrid?functionName=ClaimEventHandler

az group deployment create --resource-group regulated-lab-spoke1 --template-file deploy-eventgrid-subscription.json --parameters webhookUrl=https://77dd4d31.ngrok.io/runtime/webhooks/EventGrid?functionName=ClaimEventHandler


# Identity
Function app must be assigned a System Managed Identity not User Managed

# Deployment
npm run build:production 
func azure functionapp publish <APP_NAME>