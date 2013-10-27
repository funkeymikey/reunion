'use strict';

/* Controllers */

var controllers = angular.module('reunion.controllers', []);
  
controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'EmailService', function ($rootScope, $scope, $location, EmailService) {
  $rootScope.authenticated = false;
  $scope.isValidEmail = true;

  $scope.validateEmail = function () {
    $rootScope.processing = true;
    EmailService.get({ email: $scope.emailAddress }, function (result) {
      if (result.result) {
        $rootScope.authenticated = true;
        $location.path('/home');
        $rootScope.processing = false;
      } else {
        $scope.isValidEmail = false;
        $rootScope.processing = false;
      }});
  };

}]);

controllers.controller('HomeCtrl', ['$rootScope', '$location', '$scope', function ($rootScope, $location, $scope) {
  if (!$rootScope.authenticated)
    $location.path('/');
}]);
controllers.controller('HelpCtrl', ['$rootScope', '$location', function ($rootScope, $location) {
  if (!$rootScope.authenticated)
    $location.path('/');
}]);
controllers.controller('GalleryCtrl', ['$rootScope', '$location', function ($rootScope, $location) {
  if (!$rootScope.authenticated)
    $location.path('/');
}]);
controllers.controller('ActivitesCtrl', ['$rootScope', '$location', function ($rootScope, $location) {
  if (!$rootScope.authenticated)
    $location.path('/');
}]);