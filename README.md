#  Contentful API Showcase

[Contentful](http://contentful.com) is a content delivery backend with a RESTful JSON API, plus a web app for managing the content. Documentaion about the APIs is [here](https://www.contentful.com/developers/docs/concepts/apis/)

This web application employs the Content Delivery API and Images API to load images and mofidy the images online. 

[![Contenful API Showcase](https://github.com/foolishneo/contentful-api-showcase/blob/master/screenshot/cda-api.png?raw=true)](https://github.com/foolishneo/contentful-api-showcase/blob/master/screenshot/cda-api.png?raw=true)

[![Contenful API Showcase](https://github.com/foolishneo/contentful-api-showcase/blob/master/screenshot/images-api.png?raw=true)](https://github.com/foolishneo/contentful-api-showcase/blob/master/screenshot/images-api.png?raw=true)

## Installaton

**Note**: this app was developed with the [Mean.io](http://learn.mean.io) framework. Please refer to Mean.io website for more information about prequisite technologies and installation of Mean.io

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

The services are defined in `public/services/cdaApi.js`. They will communication with the remote HTTP servers via the browser's [XMLHttpRequest](https://developer.mozilla.org/en/xmlhttprequest) object or via [JSONP](http://en.wikipedia.org/wiki/JSONP).

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

Requests to server are handled by routing definition at `server/routes/cdaApi.js`

```javascript
app.route('/api/assets').get(cdaApi.getAssets);
app.route('/api/resize').get(cdaApi.resizeImage);
```
These setting will define the request URL and assign what controller will handle the request.

Finally, the controllers in `server/controllers/cdaApi.js` will extract parameters from the request, build the API URL and call Contentful's API to retrieve data and return data to the client side.
