'use strict';

// Declare app level module which depends on filters, and services
var reunion = angular.module('reunion', ['ngRoute', 'ngResource', 'reunion.controllers', 'ngResponsiveImages', 'ngSanitize']);
//'reunion.directives', 'reunion.filters', 'reunion.services',

reunion.config(['$routeProvider', function ($routeProvider) {

  //these are the items that show up in the navigation - in this order
  $routeProvider.when('/home', { templateUrl: 'views/home.html', controller: 'HomeCtrl', title: 'Home', caseInsensitiveMatch: true, navigation:true });
  $routeProvider.when('/activities', { templateUrl: 'views/activities.html', controller: 'ActivitesCtrl', title: 'Activities', caseInsensitiveMatch: true, navigation: true });
  $routeProvider.when('/help', { templateUrl: 'views/help.html', controller: 'HelpCtrl', title: 'Help Out', caseInsensitiveMatch: true, navigation: true });
  $routeProvider.when('/gallery', { templateUrl: 'views/gallery.html', controller: 'GalleryCtrl', title: 'Gallery', caseInsensitiveMatch: true, navigation: true });
  
  //other routes
  $routeProvider.when('/', { templateUrl: 'views/login.html', controller: 'LoginCtrl', title: 'Login', caseInsensitiveMatch: true });
  $routeProvider.when('/album/:albumId', { templateUrl: 'views/album.html', controller: 'AlbumCtrl', title: 'View Album', caseInsensitiveMatch: true });
  $routeProvider.when('/item/:itemId', { templateUrl: 'views/item.html', controller: 'ItemCtrl', title: 'View Item', caseInsensitiveMatch: true });
  $routeProvider.otherwise({ redirectTo: '/' });
}]);

reunion.run(['$rootScope', '$route', '$resource', '$location', function ($rootScope, $route, $resource, $location) {
  //ensure the title is right on first hit to the login page
  $rootScope.currentRoute = { path: '/', title: 'Login' };

  //build up our site map based on the routes
  $rootScope.routes = [];
  for (var i in $route.routes) {
    var route = { path: i, route: $route.routes[i] };
    if (!route.route.navigation)
      continue;
    route.route.path = route.path;
    $rootScope.routes.push(route.route);
  }

  //When we change pages
  // 1) check to see if we're not authenticated
  // 2) find the route with the matching path, set it to be the current so the title and footer nav will update
  $rootScope.$on("$routeChangeSuccess", function (currentRoute, previousRoute) {
    if (!$rootScope.authenticated && $location.host() !== 'localhost') {
      //if somebody hit refresh or tries to access a bookmark - send them to login, ensure that the title is right
      $rootScope.currentRoute = { path: '/', title: 'Login' };
      $location.path('/');
    }

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
    return $resource('http://reunionservice.azurewebsites.net/Email', {}, { isArray: false });
}]);
reunion.factory('FlickrService', ['$resource', function ($resource) {
  return $resource('http://api.flickr.com/services/rest/', {}, { isArray: false });
}]);