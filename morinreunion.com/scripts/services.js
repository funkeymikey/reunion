'use strict';

var reunionServices = angular.module('reunion.services', ['angularFileUpload']);



reunionServices.factory('EmailService', ['$resource', function ($resource) {
  return $resource('http://reunionservice.azurewebsites.net/Email', {}, { isArray: false });
}]);
reunionServices.factory('FlickrService', ['$resource', function ($resource) {
  return $resource('http://reunionservice.azurewebsites.net/Flickr', {}, { isArray: false });
}]);
reunionServices.constant('FlickrUploadUrl', 'http://reunionservice.azurewebsites.net/FlickrUpload');

reunionServices.factory('FlickrThing', ['$upload', '$timeout', 'FlickrUploadUrl',
function ($upload, $timeout, FlickrUploadUrl) {

  //define what this object looks like
  function FlickrThing() {

    this.dataUrls = [];
    this.uploadResult = [];
    this.selectedFiles = [];

    this.sayHello = function () {
      alert(this.dataUrls[0]);
    };

    //starts the upload, and when done, puts the result in uploadResult
    this.previewAndProcess = function (index) {
      var self = this;
      var file = this.selectedFiles[index];

      //show the preview
      if (window.FileReader && file.type.indexOf('image') > -1) {

        var fileReader = new FileReader();
        fileReader.onload = function (e) {
          $timeout(function () {
            self.dataUrls[index] = e.target.result;
          });
        };
        fileReader.readAsDataURL(file);
      }

      //process the upload
      $upload.upload({
        url: FlickrUploadUrl,
        method: 'POST',
        file: file
      }).then(function (response) {
        self.uploadResult[index] = response.data[0];
      });
    };

    this.init = function () {
      this.dataUrls = [];
      this.uploadResult = [];
      this.selectedFiles = [];
    };

    this.selectedFilesCount = function () {
      return _.countBy(this.selectedFiles, function (file) {
        return file === null ? 'empty' : 'full';
      }).full;
    };

    this.uploadedFilesCount = function () {
      return _.countBy(this.uploadResult, function (file) {
        return file === null ? 'empty' : 'full';
      }).full;
    };

    this.hasFilesUploaded = function () {

      if (!this.selectedFiles.length)
        return false;

      var selectedFilesCount = this.selectedFilesCount();

      if (!selectedFilesCount)
        return false;

      var uploadedFilesCount = this.uploadedFilesCount();

      //all the files are ready if there are the same number of selected & uploaded files
      return selectedFilesCount === uploadedFilesCount;

    };
    
    this.remove = function (index) {
      //todo: remove the photo from flickr?
      this.dataUrls[index] = null;
      this.uploadResult[index] = null;
      this.selectedFiles[index] = null;
    };

    this.addFiles = function (files) {
      var oldLength = this.selectedFiles.length;

      //append the files to the end of the selectedFiles
      [].push.apply(this.selectedFiles, files);

      //handle every new file
      for (var i = oldLength; i < this.selectedFiles.length; i++) {
        this.previewAndProcess(i);
      }
    };
    
    this.getPrimaryPhoto = function () {
      //find the first non-empty photo in our list
      return _.find(this.uploadResult, function (result) { return result !== null; });
    };
  };

  //make and return a new one
  return new FlickrThing();

}]);