
## Accelerated
After deploying countless number of NodeJS Express engine apps, I've grown tired of writing the same boilerplate. Even more, NPM is a fantastic way to manage depdencies and reusable code, but everything out there claiming to the silver bullet for app and api development, never fully acknowledge that successful services and software require scalable and well-separated codebases.

I've designed and open-sourced Accelerated to be an easy way to create scalable applications, while still maintaining that much-needed transparency in application development. This isn't a black box. This is a bunch of similar patterned CommonJS modules, working together to save your time and energy, so you can skip the boilerplate and build your damn app -- but in a scalable and truly maintainable way.

Think of this as how certain gems are to ruby. Ruby developers can easily spin seamless and time-tested API's with almost no effort. Well, this is what Accelerated is meant to be for NodeJS. Node is still maturing, but that comes with its loyal developers maturing, and I hope this is a shining example of just that.

```
npm install accelerated.api --save
```

## App vs. Network env.json 
There are two ways anyone can load the env.json file, one relative to the particular express app, and one relative to the entire network.

Here's an example. Let's say that your entire service relies on a network that involves 3 different machines working together. It'd be hard to keep up with 3 different env.json files. Instead, you can declare each machine's env.json by having a network env.json file. 

The network env.json is declared differently, but it's intuitive. Here's how the network env.json file would look:

```
{
	"api": {},
	"queue": {},
	"worker": {}
}
```

## Note on Network env.json
The keys are directly referencing the folder names, and so this really only makes sense when using locally. At that point, make sure you take the pains to separately spin up the different resources in production, and appropriately lock down each resource.

## Note on env.json
Since all variables in ```env.json``` are being loaded directly into ```process.env```, just remember that you won't be able to use any nested variables! In other words, you're persisting non-objects into ```process.env```. The easiest way to organize your environment variables to an extreme amount of detail, is prefixing your variables keys. 

## Logging
By default, Accelerated comes with a built-in logging mechanism, giving you the ease and functionality needed to keep your application honest.

Easiest way to get started, is by configuring these ```env.json``` parameters, which are completely optional:

```
//Enable logging to your console
"API_LOG_CONSOLE": true | false

//Enable logging to /logs/api.log
"API_LOG_FILE": true | false

//Set the desired level of logging
"API_LOG_LEVEL": "ALL | TRACE | DEBUG | INFO | WARN | ERROR | FATAL | OFF"

//Can modify log formatting for Express level logging
"API_LOG_EXPRESS_FORMAT": "[:status] [:method] :url"

```

## Using Logging
1. Call ```app.get('logger')``` to get access to your Accelerated logger object
2. Call any of the following logger methods to display your message: 

```
var logger = app.get('logger');
logger.trace('Entering route');
logger.debug('Received parameters');
logger.info('All parameters have been accounted for');
logger.warn('One parameter fails criteria');
logger.error('Parameters are wrong');
logger.fatal('Must retry request');

```

## Install Quick Example
As of v1.0.24, you can now install a starter app, right from command line! Also worth mentioning, this will get you an example ```env.json``` in your node project. 

From your node project, copy and paste the following command and Accelerated will install an example app into a ```example``` directory, in your working path:

```
cd node_modules/accelerated.api && npm run-script example ./../../ && cd ../../
```

## Install Blank Template
As of v1.0.25, you can now install a blank template of our starter app, and then go right into your application logic! This isn't much different than installing our example in the ```example``` directory, but this dumps everything (safely, that is it won't overwrite any already-existing files) into your node project.

We recommend using this script, so that you're really moving fast with super-minimal effort. From your node project, copy and paste the following command to get your blank starter template installed:

```
cd node_modules/accelerated.api && npm run-script blank ./../../ && cd ../../
```

# Issues, Bug Tracking
If you have any issues and need to get something into bug tracker, go over to the GitHub repo and submit an issue! I'll try and get your request looked at pronto.

