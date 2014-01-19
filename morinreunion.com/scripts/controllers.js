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
      }
    });
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
      FlickrService.save({ method: 'flickr.photosets.create', title: 'test album', primary_photo_id: '11300568805' }, function (stuff) {
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



controllers.controller('ItemCtrl', ['$scope', '$routeParams', 'FlickrService', function ($scope, $routeParams, FlickrService) {
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
  });

}]);



controllers.controller('CreateAlbumCtrl', ['$scope', '$http', '$timeout', '$upload', 'FlickrUploadUrl', function ($scope, $http, $timeout, $upload, FlickrUploadUrl) {

  

  //initialize the lists
  $scope.dataUrls = [];
  $scope.upload = [];
  $scope.uploadResult = [];
  $scope.selectedFiles = [];
  $scope.progress = [];

  $scope.formReady = function () {

    if (!$scope.albumTitle)
      return false;
    if ($scope.selectedFiles.length === 0)
      return false;

    //count the number of non-removed selected files
    var selectedFilesSize = 0;
    for (var i = 0; i < $scope.selectedFiles.length; i++)
      if ($scope.selectedFiles !== null)
        selectedFilesSize++;

    if (selectedFilesSize === 0)
      return false;

    //count the number of non-removed uploaded files
    var uploadResultSize = 0;
    for (var i = 0; i < $scope.uploadResult.length; i++)
      if ($scope.uploadResult !== null)
        uploadResultSize++;

    //all the files are ready if there are the same number as selected & uploaded files
    return selectedFilesSize === uploadResultSize;
  };

  //this shows the preview while uploading
  var setPreview = function setPreview(fileReader, index) {
    fileReader.onload = function (e) {
      $timeout(function () {
        $scope.dataUrls[index] = e.target.result;
      });
    }
  };

  //begins the upload
  var startUpload = function (index) {
    $scope.progress[index] = 0;

    $scope.upload[index] = $upload.upload({
      url: FlickrUploadUrl,
      method: 'POST',
      file: $scope.selectedFiles[index]
    }).then(function (response) {
      $scope.uploadResult[index] = response.data[0];
    }, null, function (evt) {
      $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
    });
  };

  $scope.hasUploader = function (index) {
    return $scope.upload[index] != null;
  };
  $scope.abort = function (index) {
    $scope.upload[index].abort();
    $scope.upload[index] = null;
    $scope.dataUrls[index] = null;
    $scope.uploadResult[index] = null;
    $scope.selectedFiles[index] = null;
    $scope.progress[index] = null;
  };

  $scope.onFileSelect = function ($files) {
   
    var oldLength = $scope.selectedFiles.length;

    //append the $files to the end of the selectedFiles
    [].push.apply($scope.selectedFiles, $files);

    //loop through each one, showing the preview and starting the upload
    for (var i = 0; i < $files.length; i++) {
      var totalIndex = oldLength + i;
      var $file = $files[i];
      if (window.FileReader && $file.type.indexOf('image') > -1) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL($files[i]);
        setPreview(fileReader, totalIndex);
      }
      
      startUpload(totalIndex);
    }
  };

  $scope.createAlbum = function () {
    
  };
}]);



controllers.controller('HomeCtrl', function () { });
controllers.controller('HelpCtrl', function () { });
controllers.controller('ActivitesCtrl', function () { });