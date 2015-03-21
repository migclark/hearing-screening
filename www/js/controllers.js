angular.module('ionicApp.controllers', [])

.controller('DashCtrl', function($scope,$ionicPopup,$ionicPlatform,$cordovaFile) {

  $scope.files = {messages:['Hello']};
  
  var respAlert = function(resp) {
    $ionicPopup.alert({title:'Message',content: angular.toJson(resp)});
  }
  
  
  $scope.getFreeDiskSpace = function() {    
    $cordovaFile.getFreeDiskSpace()
      .then(respAlert)
      .catch(respAlert);
  }
  
  $scope.checkDir = function() {
    $cordovaFile.checkDir(cordova.file.dataDirectory, '')
      .then(respAlert)
      .catch(respAlert);
  }
  
  $scope.writeFile = function() {
    $cordovaFile.writeFile(cordova.file.dataDirectory, 'file.txt', 'some text', true)
      .then(respAlert)
      .catch(respAlert);
  }
  

})

.controller('TestsListCtrl', function($scope, $ionicPopup, $state, $ionicPlatform, $cordovaFile) {
  $scope.shouldShowDelete = false;
  $scope.listCanSwipe = true;
  var respAlert = function(resp) {
    $ionicPopup.alert({title:'Message',content:angular.toJson(resp)});
  }
  
  $cordovaFile.readAsText(cordova.file.dataDirectory, 'hearingscreening.data')
    .then(function(success){
      var data = angular.fromJson(LZString.decompress(success));
      $scope.tests = data;
      respAlert(data);
    }, respAlert);
  
  $scope.add = function() {
    $ionicPlatform.ready(function() {
      $scope.tests.push({date:new Date().toJSON()});
      // WRITE
      $cordovaFile.writeFile(cordova.file.dataDirectory, 'hearingscreening.data', LZString.compress(angular.toJson($scope.tests)), true)
        .then(respAlert, respAlert);
      
    });
  };
  
  $scope.delete = function($index) {
    $ionicPopup.confirm({
      title: 'Deleting test',
      template: 'Are you really sure?'
    }).then(function(res) {
     if(res) {
       //Tests.delete($index);
     }
   });
  };

})

.controller('TestsDetailCtrl', function($scope,$ionicNavBarDelegate,$ionicHistory,$state,$stateParams,$timeout,$ionicPopup,Tests) {
  if(!$stateParams || !$stateParams.index) {
    $state.go('tab.tests'); 
    return;
  }

  $scope.showSaveNotice = false;
  $scope.frequencyRange = function(){
    var x = [];
    for(var i=125;i<=8000;i=i*2) {
      x.push(i);
    }
    return x;
  };
  $scope.decibelRange = function(){
    var x = [];
    for(var i=5;i<=100;i=i+5) {
      x.push(i);
    }
    return x;
  };
  
  $scope.test = Tests.get($stateParams.index);

  /*
  if(!angular.isDate($scope.test.date)) {
    $scope.test.date = new Date($scope.test.date);
  }
  if(!angular.isDate($scope.test.treatment_start_date)) {
    $scope.test.treatment_start_date = new Date($scope.test.treatment_start_date);
  }
  */
        
  $scope.existing_problems_toggle = function(){
    if(!$scope.test.existing_problems) {
      $scope.test.existing_problems_right = undefined;
      $scope.test.existing_problems_left = undefined;
      $scope.test.existing_problems_ringing = undefined;
      $scope.test.existing_problems_timeline = undefined;      
    }
  }

  $scope.update = function(){
    Tests.update($stateParams.index,$scope.test);
    $scope.showSaveNotice = true;
    $timeout(function() {$scope.showSaveNotice = false}, 1000);
  };
  
  // TODO :: when change Patient Id, look up previous test for demographics

})

