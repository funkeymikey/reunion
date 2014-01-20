'use strict';

/* Controllers */
var controllers = angular.module('reunion.controllers', []);

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


controllers.controller('CreateAlbumCtrl', ['$rootScope', '$scope', '$timeout', '$upload', '$location', 'FlickrUploadUrl', 'FlickrService',
function ($rootScope, $scope, $timeout, $upload, $location, FlickrUploadUrl, FlickrService) {

  $rootScope.currentRoute = { title: 'Create Album' };

  //starts the upload, and when done, puts the result in uploadResult
  var previewAndProcess = function (index) {

    var $file = $scope.selectedFiles[index];

    //show the preview
    if (window.FileReader && $file.type.indexOf('image') > -1) {
      var fileReader = new FileReader();
      fileReader.onload = function (e) {
        $timeout(function () {
          $scope.dataUrls[index] = e.target.result;
        });
      };
      fileReader.readAsDataURL($file);
    }

    //process the upload
    $upload.upload({
      url: FlickrUploadUrl,
      method: 'POST',
      file: $file
    }).then(function (response) {
      $scope.uploadResult[index] = response.data[0];
    });
  };

  //initialize the lists
  $scope.dataUrls = [];
  $scope.uploadResult = [];
  $scope.selectedFiles = [];

  //check to see if the form is able to be submitted
  $scope.formReady = function () {
    if (!$scope.albumTitle)
      return false;
    if ($scope.selectedFiles.length === 0)
      return false;

    //count the number of non-removed selected files
    var selectedFilesCount = _.countBy($scope.selectedFiles, function (file) {
      return file === null ? 'empty' : 'full';
    }).full;

    if (selectedFilesCount === 0)
      return false;

    //count the number of non-removed uploaded files
    var uploadedFilesCount = _.countBy($scope.uploadResult, function (file) {
      return file === null ? 'empty' : 'full';
    }).full;

    //all the files are ready if there are the same number of selected & uploaded files
    return selectedFilesCount === uploadedFilesCount;
  };

  //remove an item from being added to the album
  $scope.remove = function (index) {
    //todo: remove the photo from flickr?
    $scope.dataUrls[index] = null;
    $scope.uploadResult[index] = null;
    $scope.selectedFiles[index] = null;
  };

  //upload the selected files
  $scope.onFileSelect = function ($files) {

    var oldLength = $scope.selectedFiles.length;

    //append the $files to the end of the selectedFiles
    [].push.apply($scope.selectedFiles, $files);

    //handle every new file
    for (var i = oldLength; i < $scope.selectedFiles.length; i++) {
      previewAndProcess(i);
    }
  };

  //save the ablum
  $scope.createAlbum = function () {

    //find the first non-empty photo in our list
    var primaryPhoto = _.find($scope.uploadResult, function (result) { return result !== null; });

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
      //now go see the new album
      $location.path('/album/' + photosetId);
    });
  };

}]);



controllers.controller('HomeCtrl', function () { });
controllers.controller('HelpCtrl', function () { });
controllers.controller('ActivitesCtrl', function () { });