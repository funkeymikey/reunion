'use strict';

/* Controllers */

var controllers = angular.module('reunion.controllers', []);
  
controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'EmailService', function ($rootScope, $scope, $location, EmailService) {
  $rootScope.authenticated = false;

  $scope.doThing = function () {
    
    EmailService.get({ email: $scope.emailAddress }, function (result) {
      if (result.result)
        $location.path('/home');
      else
        alert('no');
    });
  };


  /*
      if (!$scope.emailAddress)
          $scope.isGood = false;
    else      
      EmailService.get({ email: $scope.emailAddress }, function () {
          alert('good');     }, function () { alert('error'); });
  
  */
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
