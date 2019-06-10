async function app(initConfigs){
	if (
		!initConfigs.volumeList ||
		!initConfigs.id
	){
		return
	}

	let router = app.router = app.routerFactory(document.getElementById("app"))
	let indexView = app.indexView = await app.initIndexView(initConfigs.volumeList, router)
	app.router.rout()

	console.log(initConfigs)
}

// Init ========================================================

// app.init() is called in the index.html file
app.init = doAsync("start", function(dontInstaStart){
	let initObject = {}

	// while we're doing nothing and waiting for fetching might as well load the configs
	fetch("/ln/volumes.json")
		.then(owo=>owo.json())
		.then(owo=>(initObject.volumeList = owo) && this.jumpto("app")(initObject))
		.catch(uwu=>this.jumpto("error")(uwu))

	this.jumpto("getReadingState")(initObject)

})
.then("getReadingState", function(initObject){
	Object.assign(initObject, app.getSettings())
	this.pass(initObject)
})
.then("app", app)
.then("error", function(uwu){
	console.warn(uwu)
	alert("failed to load volumes data")
})
