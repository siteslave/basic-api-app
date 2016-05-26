
angular.module('starter.anc', [])
  .controller('AncCtrl', function ($scope, $rootScope, $ionicModal,
    $ionicLoading, $ionicPopup, AncService) {

    $scope.anc = [];
    $scope.query = {};


    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
      });

    $scope.showHistory = function (cid) {

      var url = $rootScope.serverUrl + '/anc/history';

      AncService.history(url, cid)
        .then(function (rows) {
          $scope.history = rows;
          $scope.modal.show();
        }, function (err) {
          $ionicPopup.alert({
            title: 'ไม่พบข้อมูล',
            template: 'ไม่พบประวัติการฝากครรภ์ในฐานข้อมูล'
          });
        });


    };


    $scope.getList = function () {
      $scope.anc = [];

      var url = $rootScope.serverUrl + '/anc/list';

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner> Loading...'
      });

      AncService.getList(url)
        .then(function (rows) {
          $scope.anc = rows;
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        }, function (err) {
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          alert(JSON.stringify(err));
        });
    };

    $scope.doRefresh = function () {
      if ($scope.query.name) {
        $scope.search();
      } else {
        $scope.getList();
      }
     };

    $scope.search = function () {
      if ($scope.query.name) {
        $scope.anc = [];

        var url = $rootScope.serverUrl + '/anc/search';

        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner> Loading...'
        });

        AncService.search(url, $scope.query.name)
          .then(function (rows) {
            $scope.anc = rows;
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
          }, function (err) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            alert(JSON.stringify(err));
          });
      }
    };

    $scope.getList();

  })
  .factory('AncService', function ($q, $http) {

    // var url = 'http://192.168.43.76:3000';

    return {
      history: function (url, cid) {
        var q = $q.defer();
        // var _url = url + '/anc/search';

        $http.post(url, {cid: cid})
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
      },
      getList: function (url) {
        var q = $q.defer();
        // var _url = url + '/anc/list';

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
      },

      search: function (url, _name) {
        var q = $q.defer();
        // var _url = url + '/anc/search';

        $http.post(url, {name: _name})
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