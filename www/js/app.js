// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

  .run(function ($ionicPlatform) {
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
  .controller('MainCtrl', function ($scope, $ionicLoading, PersonService) {
    $scope.person = [];

    $scope.getPerson = function () {

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner> Loading...'
      });

      PersonService.getList()
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


    $scope.doRefresh = function () {
      $scope.getPerson();
    };

    $scope.getPerson();

  })
  .factory('PersonService', function ($q, $http) {

    var url = 'http://172.16.0.218:3000';

    return {
      getList: function () {
        var q = $q.defer();
        var _url = url + '/person';
        $http.get(_url, {})
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
