
angular.module('ionicApp', ['ngCordova','ionic','ionicApp.controllers','ionicApp.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.tests', {
    url: '/tests',
    templateUrl: 'templates/tests-list.html',
  })
  .state('tab.test-detail', {
    url: '/tests/{index}',
    templateUrl: 'templates/tests-detail.html',
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})


.directive('jsonDate', function() {
    return  {
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
          //format text to display
          controller.$formatters.push(function(value) {
            if (!value)
              return null;
            var date = new Date(value);
            return date || null;
          });
          //parse input text
          controller.$parsers.push(function(value) {
            if (!value)
              return '';
            var date = new Date(value);
            return date.toJSON();
           });
       }
   };
});