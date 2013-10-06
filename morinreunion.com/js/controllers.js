'use strict';

/* Controllers */

var controllers = angular.module('reunion.controllers', []);
  
controllers.controller('LoginCtrl', ['$rootScope', function ($rootScope) {
  $rootScope.authenticated = false;
}]);

controllers.controller('HomeCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
  $rootScope.authenticated = true;
  $scope.message = "hey there";
}]);
controllers.controller('SignupCtrl', ['$rootScope', function ($rootScope) {
  $rootScope.authenticated = true;
}]);
controllers.controller('GalleryCtrl', ['$rootScope', function ($rootScope) {
  $rootScope.authenticated = true;
}]);
