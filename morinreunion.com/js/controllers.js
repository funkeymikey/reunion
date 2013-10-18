'use strict';

/* Controllers */

var controllers = angular.module('reunion.controllers', []);
  
controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
  $rootScope.authenticated = false;

  $scope.doThing = function () {
    
    $rootScope.EmailService.get({ email: $scope.emailAddress }, function (result) {
      if (result.result)
        $location.path('/home');
      else
        alert('no');
    });
  };
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
