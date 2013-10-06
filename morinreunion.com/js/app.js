'use strict';

// Declare app level module which depends on filters, and services
var reunion = angular.module('reunion', ['ngRoute', 'reunion.controllers', 'reunion.directives', 'reunion.filters', 'reunion.services']);

reunion.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'views/login.html', controller: 'LoginCtrl', title: 'Login', caseInsensitiveMatch: true });
  $routeProvider.when('/home', { templateUrl: 'views/home.html', controller: 'HomeCtrl', title: 'Home', caseInsensitiveMatch: true });
  $routeProvider.when('/gallery', { templateUrl: 'views/gallery.html', controller: 'GalleryCtrl', title: 'Gallery', caseInsensitiveMatch: true });
  $routeProvider.when('/signup', { templateUrl: 'views/signup.html', controller: 'SignupCtrl', title: 'Sign Up', caseInsensitiveMatch: true });
  $routeProvider.otherwise({ redirectTo: '/' });
}]);

reunion.run(['$rootScope', '$route', function ($rootScope, $route) {
  //load up the title property from the routes as the page title
  $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {
    $rootScope.pageTitle = $route.current.title;
  });
}]);