angular.module('ionicApp.services', [])


.factory('Tests', function($ionicPopup,$cordovaFile) {
  // Local Storage
  var LOCAL_STORAGE_KEY = 'com.hearingscreening.tests';
  var saveToLocalStorage = function(){
    localStorage.setItem(LOCAL_STORAGE_KEY,LZString.compress(angular.toJson(tests)));
  };
  var getFromLocalStorage = function() {
    var data = localStorage.getItem(LOCAL_STORAGE_KEY) || '';
    return angular.fromJson(LZString.decompress(data)) || [];
  };
  
  // File System
  var FILE_NAME = 'com.hearingscreening.tests';  
  var tests = [];          
  var saveToFileSystem = function(){
    var data = LZString.compress(angular.toJson(tests));
    
    $cordovaFile.writeFile(cordova.file.dataDirectory, FILE_NAME, data, {'append':false}).then(function(success) {
        // success
        $ionicPopup.alert({title:'saveToFileSystem - success',content:angular.toJson(success)});      
      }, function (error) {
        // error
        $ionicPopup.alert({title:'saveToFileSystem - errror',content:angular.toJson(error)});      
      });
    
  };
  var getFromFileSystem = function() {
    
    $cordovaFile.readAsText(cordova.file.dataDirectory, FILE_NAME)
      .then(function(success){
        tests = angular.fromJson(LZString.decompress(success)) || [];
        
        $ionicPopup.alert({title:'getFromFileSystem - success',content:angular.toJson(tests)}); 
        
        return tests;
      });
  };
  
  return {
    getAll: function() {
      // read from file and put into the Service items array
      // return promise that returns the service items      
      return getFromFileSystem();
    },
    get: function(index) {      
      return tests[index];
    },
    
    add: function(test) {
      test._modfied = new Date().toJSON();
      tests.splice(0,0,test);
      return saveToFileSystem();
    },
    update: function(index,test) {
      test._modfied = new Date().toJSON();
      tests[index] = test;
      return saveToFileSystem();
    },
    
    delete: function(i) {
      tests.splice(i, 1);
      return saveToFileSystem();
    }
  };
})