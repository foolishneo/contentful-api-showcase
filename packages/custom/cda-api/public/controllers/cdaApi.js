'use strict';

/* jshint -W098 */
angular.module('mean.cda-api').controller('DefaultController', ['$scope', 'Global', 'CdaApi',
    function($scope, Global, CdaApi) {
        $scope.global = Global;
        $scope.package = {
            name: 'cda-api'
        };

        $scope.assetList = {};
        CdaApi.getAssets().then(function (results) {
            $scope.assetList = results.data.items;
        });

    }
]);

angular.module('mean.cda-api').controller('ResizeImage', ['$scope', 'Global', 'CdaApi',
    function($scope, Global, CdaApi) {
        $scope.global = Global;
        $scope.package = {
            name: 'cda-api'
        };

        $scope.width = 100;
        $scope.height = 100;
        $scope.r = 10;
        CdaApi.resizeImage(100, 100, '', 0).then(function (results) {
            $scope.newImage = results.data;
            $scope.caption = 'Width: 100px - Height: 100px';
        });
        $scope.submit = function() {
            $scope.caption = 'Width: ' + this.width + 'px - Height: ' + this.height + 'px';
            CdaApi.resizeImage(this.width, this.height, this.fit, this.r).then(function (results) {
                $scope.newImage = results.data;
            });
        };

    }]);