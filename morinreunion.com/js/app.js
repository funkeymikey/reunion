'use strict';

// Declare app level module which depends on filters, and services
var reunion = angular.module('reunion', ['ngRoute', 'ngResource', 'reunion.controllers', 'reunion.directives', 'reunion.filters', 'reunion.services']);

reunion.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', { templateUrl: 'views/login.html', controller: 'LoginCtrl', title: 'Login', caseInsensitiveMatch: true });
  $routeProvider.when('/home', { templateUrl: 'views/home.html', controller: 'HomeCtrl', title: 'Home', caseInsensitiveMatch: true });
  $routeProvider.when('/gallery', { templateUrl: 'views/gallery.html', controller: 'GalleryCtrl', title: 'Gallery', caseInsensitiveMatch: true });
  $routeProvider.when('/activities', { templateUrl: 'views/activities.html', controller: 'ActivitesCtrl', title: 'Activities', caseInsensitiveMatch: true });
  $routeProvider.when('/help', { templateUrl: 'views/help.html', controller: 'HelpCtrl', title: 'Help Out', caseInsensitiveMatch: true });
  $routeProvider.otherwise({ redirectTo: '/' });
}]);

reunion.run(['$rootScope', '$route', '$resource', '$location', function ($rootScope, $route, $resource, $location) {

  //build up our site map based on the routes
  $rootScope.routes = [];
  for (var i in $route.routes) {
    var route = { path: i, route: $route.routes[i] };
    if (!route.route.title || route.path === '/')
      continue;
    $rootScope.routes.push(route);
  }

  //When we change pages, find the route with the matching path, set it to be the current so the title and footer nav will update
  $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {
    for (var r in $rootScope.routes)
      if ($rootScope.routes[r].path === $route.current.originalPath)
        $rootScope.currentRoute = $rootScope.routes[r];
  });
  
  //called by the dropdown footer nav
  $rootScope.redirect = function () {
    $location.path($rootScope.currentRoute.path);
  };

}]);


reunion.factory('EmailService', ['$resource', function ($resource) {
    return $resource('http://reunionemailservice.azurewebsites.net/Email', {}, { isArray: false });
}]);