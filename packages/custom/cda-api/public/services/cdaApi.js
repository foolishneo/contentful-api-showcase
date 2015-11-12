'use strict';

angular.module('mean.cda-api').factory('CdaApi', ['$http',
    function ($http) {
        return {
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
        };
    }
]);