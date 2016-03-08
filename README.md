
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

## Example
Visit https://github.com/haseebnqureshi/accelerated.api.example for the easiest and quickest way to get going.

