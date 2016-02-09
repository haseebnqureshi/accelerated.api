
In order to give the most flexibilty in using various DB adapters and services, we bootstrap our modeling individually by resource.

Then using our Config.DB_ADAPTER, each resource toggles between the selected DB_ADAPTER, allowing the app to change DB provider with only one quick change in the config.js file.

But sometimes it's advantageous to move one resource to another DB provider, in order to complete an entire DB service migration.

For these instances, requiring any resource's index.js can take an optional second argument. This second argument is the resource's DB_ADAPTER override. 
