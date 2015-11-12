'use strict';

angular.module('mean.cda-api').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('cdaApi example page', {
      url: '/contentful-api',
      templateUrl: 'cda-api/views/index.html'
    });
  }
]);
