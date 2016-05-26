// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'starter.anc', 'starter.chart'])

  .run(function ($ionicPlatform, $rootScope) {

    $rootScope.serverUrl = 'http://192.168.43.76:3000';

    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })
  .controller('MainCtrl', function ($scope, $rootScope, $ionicLoading, HomeService, PersonService) {
    $scope.person = [];
    $scope.home = [];

    $scope.getPerson = function () {

      var url = $rootScope.serverUrl + '/person';

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner> Loading...'
      });

      PersonService.getList(url)
        .then(function (rows) {

          rows.forEach(function (v) {
            var obj = {};
            obj.HOSPCODE = v.HOSPCODE;
            obj.PID = v.PID;
            obj.NAME = v.NAME;
            obj.LNAME = v.LNAME;

            $scope.person.push(obj);
          });

          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');

        }, function (err) {
          $ionicLoading.hide();
          alert('Error: ' + JSON.stringify(err));
        });
    };

    $scope.getHome = function () {

      var url = $rootScope.serverUrl + '/home';

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner> Loading...'
      });

      HomeService.getList(url)
        .then(function (rows) {

          rows.forEach(function (v) {
            var obj = {};
            obj.HOSPCODE = v.HOSPCODE;
            obj.HOUSE = v.HOUSE;
            obj.VILLAGE = v.VILLAGE;

            $scope.home.push(obj);
          });

          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');

        }, function (err) {
          $ionicLoading.hide();
          alert('Error: ' + JSON.stringify(err));
        });
    };


    $scope.doRefresh = function () {
      //$scope.getPerson();
      $scope.getHome();
    };

    //$scope.getPerson();
    $scope.getHome();

  })
  .factory('PersonService', function ($q, $http) {

    // var url = 'http://192.168.43.76:3000';

    return {
      getList: function (url) {
        var q = $q.defer();
        // var _url = url + '/person';
        $http.get(url, {})
          .success(function (data) {
            if (data.ok) { // true
              q.resolve(data.rows);
            } else { // false
              q.reject(data.msg);
            }
          })
          .error(function () {
            q.reject('Connection failed')
          });

        return q.promise;
      }
    }

  })
  .factory('HomeService', function ($q, $http) {

    // var url = 'http://192.168.43.76:3000';

    return {
      getList: function (url) {
        var q = $q.defer();
        // var _url = url + '/home';
        $http.get(url, {})
          .success(function (data) {
            if (data.ok) { // true
              q.resolve(data.rows);
            } else { // false
              q.reject(data.msg);
            }
          })
          .error(function () {
            q.reject('Connection failed')
          });

        return q.promise;
      }
    }

  });
