# ARM Templates for Event Grid Subscription

az group deployment create --resource-group regulated-lab-spoke1 --template-file deploy-eventgrid-subscription.json --parameters webhookUrl=https://[ACCOUNT ID].ngrok.io/runtime/webhooks/EventGrid?functionName=ClaimEventHandler
