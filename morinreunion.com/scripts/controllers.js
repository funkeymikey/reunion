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

controllers.controller('GalleryCtrl', ['$rootScope', '$location', '$scope', '$resource', 'FlickrService',
  function ($rootScope, $location, $scope, $resource, FlickrService) {
  //  $rootScope.checkAuthentication();

    var getAllSetsParams = {
      method: 'flickr.photosets.getList',
      api_key: '3ed6bbf8fa206252c06d3710a96dac86',
      user_id: '106785133@N05',
      format: 'json',
      nojsoncallback: '1'
    };

    FlickrService.get(getAllSetsParams, function (data) {
      $scope.gallery = [];

      //add every set (album) returned to our gallery
      for (var i in data.photosets.photoset) {
        var set = data.photosets.photoset[i];
        $scope.gallery.push({
          description: set.description._content,
          url: 'http://www.flickr.com/photos/106785133@N05/sets/' + set.id,
          id: set.id,
          title: set.title._content,
          imageUrl: 'http://farm' + set.farm + '.staticflickr.com/' + set.server + '/' + set.primary + '_' + set.secret + '_m.jpg'
        });
      }
  });  
}]);

controllers.controller('AlbumCtrl', ['$rootScope', '$location', '$scope', '$resource', '$routeParams', 'FlickrService',
   function ($rootScope, $location, $scope, $resource, $routeParams, FlickrService) {
  //   $rootScope.checkAuthentication();
     $scope.albumId = $routeParams.albumId;

     var getSetParams = {
       method: 'flickr.photosets.getPhotos',
       api_key: '3ed6bbf8fa206252c06d3710a96dac86',
       photoset_id: $scope.albumId,
       format: 'json',
       nojsoncallback: '1'
     };

     FlickrService.get(getSetParams, function (data) {
       $scope.album = [];

       $scope.albumHeader = { title: data.photoset.title, count: data.photoset.total };

       //add every item (photo) in this set to the album
       for (var i in data.photoset.photo) {
         var item = data.photoset.photo[i];
         $scope.album.push({
           title: item.title,
           url75x75  : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_s.jpg',
           url150x150: 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_q.jpg',
           url100    : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_t.jpg',
           url240    : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_m.jpg',
           url320    : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_n.jpg',
           url500    : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'.jpg',
           url640    : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_z.jpg',
           url800    : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_c.jpg',
           url1024   : 'http://farm'+item.farm+'.staticflickr.com/'+item.server+'/'+item.id+'_'+item.secret+'_b.jpg',
         });
       }
     });
}]);

controllers.controller('HomeCtrl', function () { });
controllers.controller('HelpCtrl', function () { });
controllers.controller('ActivitesCtrl', function () { });