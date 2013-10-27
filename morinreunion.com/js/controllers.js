'use strict';

/* Controllers */
var controllers = angular.module('reunion.controllers', []);
  
controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'EmailService', function ($rootScope, $scope, $location, EmailService) {
  //if we're hitting this logic, which is only on the login page, assume we're not autheticated
  $rootScope.authenticated = false;

  //validating email
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

  //the show/hide representative table functionality
  $scope.showRepresentatives = false;
  $scope.toggleShowRepresentatives = function () {
    $scope.showRepresentatives = !$scope.showRepresentatives;
  };

}]);

controllers.controller('HomeCtrl', ['$rootScope', '$location', '$scope', function ($rootScope, $location, $scope) {
  $rootScope.checkAuthentication();
}]);
controllers.controller('HelpCtrl', ['$rootScope', '$location', function ($rootScope, $location) {
  $rootScope.checkAuthentication();
}]);
controllers.controller('GalleryCtrl', ['$rootScope', '$location', function ($rootScope, $location) {
  $rootScope.checkAuthentication();
}]);
controllers.controller('ActivitesCtrl', ['$rootScope', '$location', function ($rootScope, $location) {
  $rootScope.checkAuthentication();
}]);