'use strict';

var cdaApi = require('../controllers/cdaApi');

/* jshint -W098 */
// The Package is past automatically as first parameter
module.exports = function(CdaApi, app, auth, database) {

    app.route('/api/assets').get(cdaApi.getAssets);

    app.route('/api/resize').get(cdaApi.resizeImage);

  //app.get('/api/cdaApi/example/anyone', function(req, res, next) {
  //  //res.send('Anyone can access this');
  //  res.send(cdaApi.getSearchResults);
  //
  //});
  //app.get('/api/cdaApi/example/auth', auth.requiresLogin, function(req, res, next) {
  //  res.send('Only authenticated users can access this');
  //});
  //
  //app.get('/api/cdaApi/example/admin', auth.requiresAdmin, function(req, res, next) {
  //  res.send('Only users with Admin role can access this');
  //});
  //
  //app.get('/api/cdaApi/example/render', function(req, res, next) {
  //  CdaApi.render('index', {
  //    package: 'cda-api'
  //  }, function(err, html) {
  //    //Rendering a view from the Package server/views
  //    res.send(html);
  //  });
  //});
};
