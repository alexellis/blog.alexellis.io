---
title: "Learning node.js"
slug: "working-with-node-js-2"
date: "2015-03-18T13:39:51Z"
author: "Alex Ellis"
---

### Fresh perspective
Working with node.js has given me a fresh perspective on JavaScript and programming. The first thing that I noticed was JavaScript's asynchronous nature and how that forced me to think differently about approaching problems. This is one of the draws of this tool and what makes it suitable for high performance IO. The second thing was the wealth of utilities, supporting frameworks and tools which are freely available. This is a brief post on a few aspects I've used lately. 

```
var fs = require('fs');

var print = function(v) {
	fs.writeFile(v+'.txt', 'Value was: '+v, function(err){
		console.log('Written file: ' + v);
	});	
}
for(var i = 0; i < 10; i++) {
	var value= i;
	print(value);
}
console.log('Writers started');
```

**Program writes a number of text files to disk, we may expect this to execute in sequential order.**

```
Writers started
Written file: 3
Written file: 1
Written file: 2
Written file: 4
Written file: 5
Written file: 6
Written file: 7
Written file: 8
Written file: 9
Written file: 0
```
**The writeFile operation is asynchronous which allows the for loop to continue running until the end before all the writes have finished.**

I did not expect this behaviour because I had become so accustomed to synchronous programming.

##### Moving onto web

Up to now I've mainly used node for writing headless utilities, scripts for my Raspberry PI and a very small web app called [Logr](https://github.com/alexellis/logr) for logging sensor data. I was simply concatenating strings of HTML tags and iterating json objects from a SQLite driver rather than relying on a view-engine or a HTML templating framework.
More recently I've started a similar project but with the explict intention of using all the standard tools available for creating views, middle-ware, database, source control and testing. The learning curve is steep because the variety and modularity of the offerings in the open source space. This gives a different experience from a tightly integrated development environment. You can use as many or few tools or frameworks as you like, which brings me to the Quick web server example in node below.

##### Quick web server
```
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
```
This fantastic simplicity is a real attraction - especially when compared to heavy-weight alternatives such as fully-blown IIS. This may be all that is needed to provide a simple service for an IoT device or mini web-service, but in most cases you will start to want more and then its time to do research and to look into some frameworks and libraries. 


##### npm
> Node package manager

Ruby/python etc and even C# all have their own package managers which allow you to download pre-built tools, add-ons and libraries for your project. Node.js is no exception - an assumption when starting a node project is that you will add a package.json file which describes which dependencies to download from npm for your project. It also makes publishing your project on the package manager easier, if that is what you choose to do.

> Useful commands:

`npm install` prepares all the dependencies specified in the package.json file

`npm install <packageName> --save` automatically installs a package from NPM and then saves it in your package.json file.

`npm start` runs the start command for the package or library.

##### Git/hub
Git and github was something I hadn't used up until the beginning of the year. It assumes that the first thing you would do is write a README file in a 'mark-up' language and then pick a license for how other people can use your project. This is something that I've not thought about when writing internal commercial software. The README.md file ideally would have a brief description of what the code does, how to install and run it. 
By default, everything is done through the command line and after installing the 'git' utility it is very quick to get started. When it comes to merging code and collaborating with others this is more complicated and I haven't had a chance to try this yet in my pet projects.

##### CasperJS/PhantomJS
Casper/Phantom are JavaScript libaries which wrap up a headless WebKit browser to enable automation. It lets the developer perform general browser automation and verification. This can be used for a range of tasks such as deployment testing to specific user acceptance tests - i.e. does a form produce validation errors when submitted with empty fields?

```
casper.test.begin('Validate all fields required, fails',2,
 function suite(test){
   casper.start('http://localhost:3000/log/', function() {
	test.assertExists('form');
	casper.fill('.form-group', {
	 'site' : 'Home'
	},true);
   });
   casper.then(function() {
	test.assertExists('.fail');
   });
   casper.run(function() {
	test.done();
   });

});
casper.test.begin('Did page load OK', 1, function suite(test) {
   casper.start('http://localhost:3000/log/', function() {
        	test.assertExists('h2');
	}).run(function(){
		test.done();
    });
});
```
**I am by no means a ninja when it comes to CasperJS**

This test navigates to the /log/ URL to check for the presence of a `h2` element, if present then the page has likely loaded successfully. If the element is missing then the database driver or view parser may have failed. It then submits a partially filled out form, then checks that the `.fail` class was present somewhere in the document - showing me that the data did not upsert. This test also executes very quickly on my test application and gives xUnit type output:

```
[~/#] casperjs test tests/casper/*

Test file: tests/casper/index.js                                                
# Did page load OK
PASS Find an element matching: h2
Test file: tests/casper/latest.js                                               
# Did page load OK
PASS Find an element matching: h2
Test file: tests/casper/log.js                                                  
# Validate all fields required, fails
PASS Find an element matching: form
PASS Find an element matching: .fail
# Did page load OK
PASS Find an element matching: h2
PASS 5 tests executed in 0.599s, 5 passed, 0 failed, 0 dubious, 0 skipped.  
```

**Wrapping up**

I hope to make enough progress with my web project to make it useful and then move it onto github as a public repo. The aim is to keep track of sensor data logged by various remote Raspberry PI nodes and then have a meaningful presentation layer on top of it. I still have a long way to go, but I am learning a good amount and I hope I can transfer the skills to my day-job in the .NET world.