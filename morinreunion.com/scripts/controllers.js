'use strict';

/* Controllers */
var controllers = angular.module('reunion.controllers', ['reunion.services']);

controllers.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'EmailService',
function ($rootScope, $scope, $location, EmailService) {
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
      }
    });
  };

  //the show/hide representative table functionality
  $scope.showRepresentatives = false;
  $scope.toggleShowRepresentatives = function () {
    $scope.showRepresentatives = !$scope.showRepresentatives;
  };

}]);


controllers.controller('GalleryCtrl', ['$scope', 'FlickrService',
function ($scope, FlickrService) {

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

}]);


controllers.controller('AlbumCtrl', ['$rootScope', '$scope', '$routeParams', 'FlickrService',
function ($rootScope, $scope, $routeParams, FlickrService) {
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
        itemUrl: '#/item/' + item.id,
        url75x75: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_s.jpg',
        url150x150: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_q.jpg',
        url100: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_t.jpg',
        url240: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg',
        url320: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_n.jpg',
        url500: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '.jpg',
        url640: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_z.jpg',
        url800: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_c.jpg',
        url1024: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_b.jpg'
      });
    }
  });

}]);


controllers.controller('ItemCtrl', ['$rootScope', '$scope', '$routeParams', 'FlickrService',
function ($rootScope, $scope, $routeParams, FlickrService) {
  $scope.itemId = $routeParams.itemId;

  FlickrService.get({ method: 'flickr.photos.getInfo', photo_id: $scope.itemId }, function (data) {
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
      url1024: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_b.jpg',
      urlOriginal: 'http://farm' + item.farm + '.staticflickr.com/' + item.server + '/' + item.id + '_' + item.originalsecret + '_o.' + item.originalformat
    };
    $rootScope.currentRoute = { title: $scope.item.title };
  });

}]);


controllers.controller('CreateAlbumCtrl', ['$rootScope', '$scope', '$timeout', 'FlickrThing', '$location', 'FlickrService',
function ($rootScope, $scope, $timeout, FlickrThing, $location, FlickrService) {

  $rootScope.currentRoute = { title: 'Create Album' };

  //initialize the lists
  FlickrThing.init();
  $scope.dataUrls = FlickrThing.dataUrls;
  $scope.uploadResult = FlickrThing.uploadResult;
  $scope.selectedFiles = FlickrThing.selectedFiles;

  //check to see if the form is able to be submitted
  $scope.formReady = function () {
    if (!$scope.albumTitle)
      return false;
   
    return FlickrThing.hasFilesUploaded();
  };

  //remove an item from being added to the album
  $scope.remove = function (index) {
    FlickrThing.remove(index);
  };

  //upload the selected files
  $scope.onFileSelect = function (files) {
    FlickrThing.addFiles(files);
  };

  //save the ablum
  $scope.createAlbum = function () {
    $rootScope.processing = true;
    
    var primaryPhoto = FlickrThing.getPrimaryPhoto();

    FlickrService.save({
      method: 'flickr.photosets.create',
      title: $scope.albumTitle,
      description: $scope.albumDescription,
      primary_photo_id: primaryPhoto.id
    }, function (data) {
      //now add all the photos to this set
      var i = 0;
      var length = $scope.uploadResult.length;
      var photosetId = data.photoset.id;
      for (i = 0; i < length; i++) {
        //skip any empty ones
        if ($scope.uploadResult[i] === null)
          continue;

        //skip the primary photo
        if ($scope.uploadResult[i].id == primaryPhoto.id)
          continue;

        FlickrService.save({ method: 'flickr.photosets.addPhoto', photoset_id: photosetId, photo_id: $scope.uploadResult[i].id });
      }
      //go see the new album after a moment to allow for flickr processing
      $timeout(function () { $rootScope.processing = false; $location.path('/album/' + photosetId); }, 1000);
    });
  };

}]);

controllers.controller('EditAlbumCtrl', ['$rootScope', '$scope', '$timeout', '$routeParams', '$location', 'FlickrThing', 'FlickrService',
function ($rootScope, $scope, $timeout, $routeParams, $location, FlickrThing, FlickrService) {
  $scope.albumId = $routeParams.albumId;

  //get the album name
  FlickrService.get({ method: 'flickr.photosets.getPhotos', photoset_id: $scope.albumId }, function (data) {
    $scope.albumHeader = { title: data.photoset.title, count: data.photoset.total };
  });


  //initialize the lists
  FlickrThing.init();
  $scope.dataUrls = FlickrThing.dataUrls;
  $scope.uploadResult = FlickrThing.uploadResult;
  $scope.selectedFiles = FlickrThing.selectedFiles;

  //check to see if the form is able to be submitted
  $scope.formReady = function () {
    return FlickrThing.hasFilesUploaded();
  };

  //remove an item from being added to the album
  $scope.remove = function (index) {
    FlickrThing.remove(index);
  };

  //upload the selected files
  $scope.onFileSelect = function (files) {
    FlickrThing.addFiles(files);
  };

  //save the ablum
  $scope.updateAlbum = function () {
    $rootScope.processing = true;
    //now add all the photos to this set
    var i = 0;
    var length = $scope.uploadResult.length;
    var photosetId = $scope.albumId;
    for (i = 0; i < length; i++) {
      //skip any empty ones
      if ($scope.uploadResult[i] === null)
        continue;

      FlickrService.save({ method: 'flickr.photosets.addPhoto', photoset_id: photosetId, photo_id: $scope.uploadResult[i].id });
    }

    //go see the new album after a moment to allow for flickr processing
    $timeout(function () { $rootScope.processing = false; $location.path('/album/' + photosetId); }, 1000);
  };

}]);

controllers.controller('HomeCtrl', function () { });
controllers.controller('HelpCtrl', function () { });
controllers.controller('ActivitesCtrl', function () { });