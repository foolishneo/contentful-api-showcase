#  Contentful API Showcase

[Contentful](http://contentful.com) is a content delivery backend with a RESTful JSON API, plus a web app for managing the content. Documentaion about the APIs is [here](https://www.contentful.com/developers/docs/concepts/apis/)

This web application employs the Content Delivery API and Images API to load images and mofidy the images online. It was developed with the [Mean.io](http://learn.mean.io) framework. Please refer to Mean.io website for more information about prequisite technologies and installation of Mean.io

## Installaton

```bash
$ git clone https://github.com/foolishneo/contentful-api-showcase.git contentful-api-showcase
$ cd contentful-api-showcase
$ npm install
```

## Run
```bash
$ gulp
```
then run the website at http://localhost:3000

## Code Structure

The application resides in a custom package `packages/custom/cda-api`

**Server**

Packages are registered in the **app.js**
Defines package name, version and `mean=true` in the **package.json**

All of the Server side code resides in the `/server` directory.

    Server
    --- config        # Configuration files
    --- controllers   # Server side logic goes here
    --- models        # Database Schema Models
    --- routes        # Rest api endpoints for routing
    --- views         # Swig based html rendering

**Client**

All of the Client side code resides in the `/public` directory.

    public            
    --- assets        # JavaScript/CSS/Images (not aggregated)
    --- controllers   # Angular controllers
    --- config        # Contains routing files
    --- services      # Angular services (also directive and filter folders)
    --- views         # Angular views

All JavaScript within `public` is automatically aggregated with the exception of files in `public/assets`, which can be manually added using the `aggregateAsset()` function.

Files within the `public` directory of the package can be accessed externally at `/[package-name]/path-to-file-relative-to-public`. For example, to access the `Tokens` Angular controller, `tokens/controllers/tokens.js`.

## Code Walkthrough

The AngularJS controllers in `public/controllers/cdaApi.js` will call the [$http](https://docs.angularjs.org/api/ng/service/$http) service to request data from the server. 

```javascript
// get all Assets in a Contentful's Space
CdaApi.getAssets().then(function (results) {
  $scope.assetList = results.data.items;
});

// get the resized image
CdaApi.resizeImage(this.width, this.height, this.fit, this.r).then(function (results) {
  $scope.newImage = results.data;
});
```

The services is defined in `public/services/cdaApi.js`. They will communication with the remote HTTP servers via the browser's [XMLHttpRequest](https://developer.mozilla.org/en/xmlhttprequest) object or via [JSONP](http://en.wikipedia.org/wiki/JSONP).

```javascript
getAssets: function () {
  var urlBase = '/api/assets',
  callbackName = 'JSON_CALLBACK',
  url = urlBase + '?callback=' + callbackName;
  return $http.jsonp(url);
},

resizeImage: function (w , h, f, r) {
  var urlBase = '/api/resize',
  callbackName = 'JSON_CALLBACK',
  url = urlBase + '?w=' + w + '&h=' + h + '&f=' + f + '&r=' + r + '&callback=' + callbackName;
  return $http.get(url);
}
```



MEAN has 3 pre registered dependencies:
  - `app` Makes the express app available .
  - `auth` Includes some basic authentication functions
  - `database` Contains the Mongoose database connection

> All dependencies specified must be registered in order to use them

###Dependency Injection

> An injection is the passing of a dependency (a service) to a dependent
> object (a client). The service is made part of the client's state.
> Passing the service to the client, rather than allowing a client to
> build or find the service, is the fundamental requirement of the
> pattern. [Wikipedia](http://en.wikipedia.org/wiki/Dependency_injection)


Dependency injection allows you to declare what dependencies you require and rely on the package system to resolve all dependencies for you. Any package registered is automatically made available to anyone who would like to depend on them.

Looking again at the registration example we can see that `MyPackage` depends on the `Tokens` package and can make use of its full functionality, including overriding it.
 
```javascript
// Example of registering the tokens package
MyPackage.register(function(app, auth, database, Tokens) {

  // I can make use of the tokens within my module
  MyPackage.someExampleFunction('some parameter');

  // I can override functions
  MyPackage.someExampleFunction = function(param) {
    //my custom logic goes here
  };
});
```

> Packages when in code are used in a capitalized form

###Angular Modules and Dependencies

Every package registration automatically creates a corresponding angular module of the form `mean.[package-name]`

The package system injects this information into the mean init functions and allows developers to base their controllers, services, filters, directives etc on either an existing module or on their own one.

In addition you are able to declare which angular dependencies you want your angular module to use.

Below is an example of adding an angular dependency to our angular module.

```javascript
// Example of adding an angular dependency of the ngDragDrop to the
MyPackage.angularDependencies(['ngDragDrop']);
```

> See the assets section for an example how to add external libraries to
> the client such as the `gDragDrop `javascript library

###Assets and Aggregation

All assets such as images, javascript libraries and CSS stylesheets should be within `public/assets` of the package file structure.

Javascript and CSS from `assets` can be aggregated to the global aggregation files. By default all javascript is automatically wrapped within an anonymous function unless given the option `{global:true}` to not enclose the javascript within a contained scope

```javascript

//Adding jquery to the mean project
MyPackage.aggregateAsset('js','jquery.min.js');

//Adding another library - global by default is false
MyPackage.aggregateAsset('js','jquery.min.js', {global:true});

//Adding some css to the mean project
MyPackage.aggregateAsset('css','default.css');
```

> Javascript files outside of assets are automatically aggregated and
> injected into the mean project. As a result libraries that you do not
> want aggregated should be placed within `public/assets/js`

The aggregation supports the ability to control the location of where to inject the aggregated code and if you add a weight and a group to your aggregateAsset method you can make sure it's included in the correct region.

```javascript
MyPackage.aggregateAsset('js','first.js',{global:true,  weight: -4, group: 'header'});
```

>The line that gets loaded in your head.html calls the header group and injects the js you want to include first-
> in packages/system/server/views/includes/head.html
> <script type="text/javascript" src="/modules/aggregated.js?group=header"></script>

###Settings Object
The settings object is a persistence object that is stored in the packages collection and allows for saving persistent information per package such as configuration options or admin settings for the package.

  Receives two arguments the first being the settings object the second is a callback function
  
```javascript
MyPackage.settings({'someSetting':'some value'}, function (err, settings) {
    // You will receive the settings object on success
});

// Another save settings example this time with no callback
// This writes over the last settings.
MyPackage.settings({'anotherSettings':'some value'});

// Get settings. Retrieves latest saved settings
MyPackage.settings(function (err, settings) {
  // You now have the settings object
});
```

> Each time you save settings you overwrite your previous value.
> Settings are designed to be used to store basic configuration options
> and should not be used as a large data store


###Express Routes
All routing to server side controllers is handled by express routes. The package system uses the typical express approach. The package system has a route function that passes along the package object to the main routing file typically `server/routes/myPackage.js`

  By default the Package Object is passed to the routes along with the other arguments
  `MyPackage.routes(app, auth, database);`


Example from the `server/routes/myPackage.js`

```javascript
// The Package is past automatically as first parameter
module.exports = function(MyPackage, app, auth, database) {

  // example route
  app.get('/myPackage/example/anyone', function (req,res,next) {
    res.send('Anyone can access this');
  });
};
```

###Angular Routes
The angular routes are defined in `public/routes/myPackage.js`. Just like the latest version of mean, the packages  use the `$stateProvider`

```javascript
$stateProvider
  .state('myPackage example page', {
    url: '/myPackage/example',
    templateUrl: 'myPackage/views/index.html'
  });
```

> The angular views are publically accessible via templateUrl when
> prefixed with the package name

###Menu System

Packages are able to hook into an existing menu system and add links to various menus integrated within Mean.

Each link specifies its `title`, `template`, `menu` and `role` that is allowed to see the link. If the menu specified does not exist, a new menu will be created. The menu object is made accessible within the client by means of a *menu angular service* that queries the menu controller for information about links.

Below is an example how to add a link to the main menu from `app.js`

```javascript
//We are adding a link to the main menu for all authenticated users
MyPackage.menus.add({
  title: "myPackage example page",
  link: "myPackage example page",
  roles: ["authenticated"],
  menu: "main"
});
```


> You can look at the angular header controller in the mean project for
> more info. You can find it `public/system/controllers/header.js` and
> see how the menu service is implemented

###Html View Rendering
The packages come built in with a rendering function allowing packages to render static html. The default templating engine is *swig*. The views are found in `server/views` of the package and should end with the `.html` suffix

Below is an example rendering some simple html

```javascript
app.get('/myPackage/example/render', function (req,res,next) {
  MyPackage.render('index', {packageName:'myPackage'}, function (err, html) {
    //Rendering a view from the Package server/views
    res.send(html);
  });
});
```

###Overriding the default layouts
One is able to override the default layout of the application through a custom package.

Below is an example overriding the default layout of system and instead using the layourts found locally within the package

```javascript
MyPackage.register(function(system, app) {
  app.set('views', __dirname + '/server/views');
  // ...
```

> Please note that the package must depend on `System` to ensure it is
> evaluated after `System` and can thus override the views folder

### Overriding views
You may override public views used by certain core packages.  To create a custom home page, you would create a custom package and modify the script in it's public folder like so:

```javascript
angular.module('mean.mycustompackage', ['mean.system'])
.config(['$viewPathProvider', function($viewPathProvider) {
  $viewPathProvider.override('system/views/index.html', 'mycustompackage/views/myhomepage.html');
}]);
```

This will render *mycustompackage/views/myhomepage.html* as the home page.

### Creating your own package
To create your own package and scaffold its initial code, run the following command:

```bash
$ mean package <packageName>
```

This will create a package under */packages/custom/pkgName*

### Deleting a package
To delete your package, and remove its files:

```bash
$ mean uninstall myPackage
```
Where "myPackage" is the name of your package.


### Contributing your package
Once your package is in good shape and you want to share it with the world you can start the process of contributing it and submiting it so it can be included in the package repository.
To contribute your package register to the network (see the section below) and run

```bash 
$ mean register # register to the mean network (see below)
$ cd <packages/custom/pkgName>
$ mean publish
```

## MEAN Network
Mean is a stand-alone instance that you can install locally or host on your server.
We want to provide value to developers and are assembling a set of services which will be called the mean network.
We're building all of this as we speak but we already have some elements in place.

### Network User Management

#### Registration
```bash
$ mean register
```
#### Identity
```bash
$ mean whoami
```
### Deploy
Coming soon!

## Config
All the configuration is specified in the [config](/config/) folder,
through the [env](config/env/) files, and is orchestrated through the [meanio](https://github.com/linnovate/meanio) NPM module.
Here you will need to specify your application name, database name, and hook up any social app keys if you want integration with Twitter, Facebook, GitHub, or Google.

### Environmental Settings

There is a shared environment config: __all__

* __root__ - This the default root path for the application.
* __port__ - DEPRECATED to __http.port__ or __https.port__.
* __http.port__ - This sets the default application port.
* __https__ - These settings are for running HTTPS / SSL for a secure application.
* __port__ - This sets the default application port for HTTPS / SSL. If HTTPS is not used then is value is to be set to __false__ which is the default setting. If HTTPS is to be used the standard HTTPS port is __443__.
* __ssl.key__ - The path to public key.
* __ssl.cert__ - The path to certificate.

There are three environments provided by default: __development__, __test__, and __production__.
Each of these environments has the following configuration options:

* __db__ - This is where you specify the MongoDB / Mongoose settings
* __url__ - This is the url/name of the MongoDB database to use, and is set by default to __mean-dev__ for the development environment.
* __debug__ - Setting this option to __true__ will log the output all Mongoose executed collection methods to your console.  The default is set to __true__ for the development environment.
* __options__ - These are the database options that will be passed directly to mongoose.connect in the __production__ environment: [server, replset, user, pass, auth, mongos] (http://mongoosejs.com/docs/connections.html#options) or read [this] (http://mongodb.github.io/node-mongodb-native/driver-articles/mongoclient.html#mongoclient-connect-options) for more information.
* __app.name__ - This is the name of your app or website, and can be different for each environment. You can tell which environment you are running by looking at the TITLE attribute that your app generates.
* __Social OAuth Keys__ - Facebook, GitHub, Google, Twitter. You can specify your own social application keys here for each platform:
  * __clientID__
  * __clientSecret__
  * __callbackURL__
* __emailFrom__ - This is the from email address displayed when sending an email.
* __mailer__ - This is where you enter your email service provider, username and password.

To run with a different environment, just specify NODE_ENV as you call grunt:
```bash
$ NODE_ENV=test grunt
```
If you are using node instead of grunt, it is very similar:
```bash
$ NODE_ENV=test node server
```
To simply run tests
```bash
$ npm test
```
> NOTE: Running Node.js applications in the __production__ environment enables caching, which is disabled by default in all other environments.

### Logging

As from mean-0.4.4 control over the logging format has been delegated to the env configuration files.
The formats and implementation are done using the morgan node module and it's [predefined format](https://github.com/expressjs/morgan#predefined-formats)
Within each configuration file (config/env/development.js) for instance you state the format in the 'logging' object.
```
'use strict';

module.exports = {
  db: 'mongodb://' + (process.env.DB_PORT_27017_TCP_ADDR || 'localhost') + '/mean-dev',
  debug: true,
  logging: {
    format: 'tiny'
  },
```

The default for the development environment uses [tiny format](https://github.com/expressjs/morgan#tiny)
```
GET /system/views/index.html 304 2.379 ms - -
GET /admin/menu/main 304 8.687 ms - -
GET /system/assets/img/logos/meanlogo.png 304 2.803 ms - -
GET /system/assets/img/backgrounds/footer-bg.png 304 4.481 ms - -
GET /system/assets/img/ninja/footer-ninja.png 304 3.309 ms - -
GET /system/assets/img/logos/linnovate.png 304 3.001 ms - -
```

The production uses the widely used [combined format](https://github.com/expressjs/morgan#combined).
```
:1 - - [22/Mar/2015:13:13:42 +0000] "GET /modules/aggregated.js HTTP/1.1" 200 - "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"
::1 - - [22/Mar/2015:13:13:42 +0000] "GET /modules/aggregated.js?group=header HTTP/1.1" 200 0 "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"
::1 - - [22/Mar/2015:13:13:42 +0000] "GET / HTTP/1.1" 200 - "-" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"
::1 - - [22/Mar/2015:13:13:42 +0000] "GET /modules/aggregated.css HTTP/1.1" 200 - "http://localhost:3000/" "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36"
```

## Staying up to date
After initializing a project, you'll see that the root directory of your project is already a git repository. MEAN uses git to download and update its own code. To handle its own operations, MEAN creates a remote called `upstream`. This way you can use git as you would in any other project. 

To update your MEAN app to the latest version of MEAN

```bash
$ git pull upstream master
$ npm install
```

To maintain your own public or private repository, add your repository as remote. See here for information on [adding an existing project to GitHub](https://help.github.com/articles/adding-an-existing-project-to-github-using-the-command-line).

```bash
$ git remote add origin <remote repository URL>
$ git push -u origin master
```


## Hosting MEAN
Since version 0.4.2 MEAN provides a command to easily upload your app to the *mean cloud*.
To do so all you need to do is the following steps.

1. make sure you have a unique name for your app (not the default mean) and that the name is in the package.json
1. Run `mean deploy`
1. It will create the meanio remote which can be used to update your remote app by `git push meanio master`
1. You can add remote command using the --remote flag for instance to add a role to a user on the remote cloud instance run `mean user -a RoleName emailAddress --remote`
1. To get an idea of whats happening on the mean log (node.js based logging) run `mean logs -n 100` to get the last 100 lines...

### Heroku
Before you start make sure you have the [Heroku toolbelt](https://toolbelt.heroku.com/)
installed and an accessible MongoDB instance - you can try [MongoHQ](http://www.mongohq.com/)
which has an easy setup).

Add the db string to the production env in *server/config/env/production.js*.

```bash
$ git init
$ git add .
$ git commit -m "initial version"
$ heroku apps:create
$ heroku config:add NODE_ENV=production
$ heroku config:add BUILDPACK_URL=https://github.com/mbuchetics/heroku-buildpack-nodejs-grunt.git
$ git push heroku master
$ heroku config:set NODE_ENV=production
```

### OpenShift

1. Register for an account on Openshift (http://www.openshift.com).
1. Create an app on Openshift by choosing a 'Node' type site to create. Create the site by making Openshift use Linnovate's Openshift git repo as its source code (https://github.com/linnovate/mean-on-openshift.git).
1. On the second screen after the new application has been created, add a Mongo database.
1. When the site has been built, you can visit it on your newly created domain, which will look like my-domain.openshift.com. You may need to restart the instance on Openshift before you can see it. It will look like Mean.io boilerplate.
1. On your new app's console page on Openshift, make a note of the git repo where the code lives. Clone that repo to your local computer where your mean.io app codebase is.
1. Merge your completed local app into this new repo. You will have some conflicts, so merge carefully, line by line.
1. Commit and push the repo with the Openshift code back up to Openshift. Restart your instance on Openshift, you should see your site!


## More Information
  * Visit us at [Linnovate.net](http://www.linnovate.net/).
  * Visit our [Ninja's Zone](http://www.meanleanstartupmachine.com/) for extended support.

## Credits
  * To our awesome <a href="https://github.com/orgs/linnovate/teams/mean">core team</a> with help of our <a href="https://github.com/linnovate/mean/graphs/contributors">contributors</a> which have made this project a success.
  * <a href="https://github.com/vkarpov15">Valeri Karpov</a> for coining the term *mean* and triggering the mean stack movement.
  * <a href="https://github.com/amoshaviv">Amos Haviv</a>  for the creation of the initial version of Mean.io while working for us @linnovate.
  * <a href="https://github.com/madhums/">Madhusudhan Srinivasa</a> who inspired us with his great work.

## License
We believe that mean should be free and easy to integrate within your existing projects so we chose [The MIT License](http://opensource.org/licenses/MIT)
=======
>>>>>>> 49a42d574a2e45d838b3cc894ce7a3124df5fcaa
# contentful-api-showcase
