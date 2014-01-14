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
  
    FlickrService.get({ method: 'flickr.photosets.getList', user_id: '107133986@N05' }, function (data) {
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

    $scope.createAlbum = function () {
      FlickrService.save({method:'flickr.photosets.create', title:'test album', primary_photo_id:'11300568805'}, function (stuff) {
        var t = stuff;
      });
    };
}]);

controllers.controller('AlbumCtrl', ['$rootScope', '$scope', '$routeParams', 'FlickrService', function ($rootScope, $scope, $routeParams, FlickrService) {
     $scope.albumId = $routeParams.albumId;

     FlickrService.get({ method: 'flickr.photosets.getPhotos', photoset_id: $scope.albumId }, function (data) {
       $rootScope.album = [];

       $scope.albumHeader = { title: data.photoset.title, count: data.photoset.total };
       $rootScope.currentRoute = { title: $scope.albumHeader.title };

       //add every item (photo) in this set to the album
       for (var i in data.photoset.photo) {
         var item = data.photoset.photo[i];
         $rootScope.album.push({
           id: item.id,
           title: item.title,
           albumId: $scope.albumId,
           itemUrl   : '#/item/' + item.id,
           url75x75  : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_s.jpg',
           url150x150: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_q.jpg',
           url100    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_t.jpg',
           url240    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg',
           url320    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_n.jpg',
           url500    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg',
           url640    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_z.jpg',
           url800    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_c.jpg',
           url1024   : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_b.jpg'
         });
       }
     });

     
}]);



controllers.controller('ItemCtrl', ['$scope', '$routeParams', 'FlickrService', function ($scope, $routeParams, FlickrService) {
  $scope.itemId = $routeParams.itemId;
    
  FlickrService.get({ method: 'flickr.photos.getInfo', photo_id: $scope.itemId}, function (data) {
    var item = data.photo;
    $scope.item = {
      id: item.id,
      title: item.title._content,
      albumId: $scope.albumId,
      itemUrl: '#/item/' + item.id,
      dateUploaded: new Date(item.dateuploaded * 1000),
      datePosted: new Date(item.dates.posted * 1000),
      dateUpdated: new Date(item.dates.lastupdate * 1000),
      dateTaken: new Date(item.dates.taken),
      url1024    : 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_b.jpg',
      urlOriginal: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.originalsecret + '_o.' + item.originalformat
    };  
  });

}]);



controllers.controller('CreateAlbumCtrl', ['$rootScope', '$scope', '$upload', 'FlickrService', 'FlickrUploadService', function ($rootScope, $scope, $upload, FlickrService, FlickrUploadService) {
 
  
  $scope.createAlbum = function () {
    
    console.log('bytes:' + $scope.fileBytes);

    //first upload any photos
    FlickrUploadService.save({photo: $scope.fileBytes.bytes, title: $scope.fileBytes.file.name}, function(uploadDone){
      
    //then create a new photoset
    //  FlickrService.save({});
    });

  };

}]);

controllers.controller('HomeCtrl', function () { });
controllers.controller('HelpCtrl', function () { });
controllers.controller('ActivitesCtrl', function () { });