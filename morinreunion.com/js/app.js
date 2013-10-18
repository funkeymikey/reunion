'use strict';

// Declare app level module which depends on filters, and services
var reunion = angular.module('reunion', ['ngRoute', 'ngResource', 'reunion.controllers', 'reunion.directives', 'reunion.filters', 'reunion.services']);

reunion.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'views/login.html', controller: 'LoginCtrl', title: 'Login', caseInsensitiveMatch: true });
  $routeProvider.when('/home', { templateUrl: 'views/home.html', controller: 'HomeCtrl', title: 'Home', caseInsensitiveMatch: true });
  $routeProvider.when('/gallery', { templateUrl: 'views/gallery.html', controller: 'GalleryCtrl', title: 'Gallery', caseInsensitiveMatch: true });
  $routeProvider.when('/signup', { templateUrl: 'views/activities.html', controller: 'ActivitesCtrl', title: 'Activities', caseInsensitiveMatch: true });
  $routeProvider.when('/help', { templateUrl: 'views/help.html', controller: 'HelpCtrl', title: 'Help Out', caseInsensitiveMatch: true });
  $routeProvider.otherwise({ redirectTo: '/' });
}]);

reunion.run(['$rootScope', '$route', '$resource', function ($rootScope, $route, $resource) {
  //load up the title property from the routes as the page title
  $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {
    $rootScope.pageTitle = $route.current.title;
  });
}]);


reunion.factory('EmailService', ['$resource', function ($resource) {
    return $resource('http://reunionemailservice.azurewebsites.net/Email', {}, { isArray: false });
}]);