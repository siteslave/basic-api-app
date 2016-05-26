
angular.module('starter.anc', [])
  .controller('AncCtrl', function ($scope, $ionicLoading, AncService) {

    $scope.anc = [];
    $scope.query = {};

    $scope.getList = function () {
      $scope.anc = [];

      $ionicLoading.show({
        template: '<ion-spinner icon="android"></ion-spinner> Loading...'
      });

      AncService.getList()
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

        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner> Loading...'
        });

        AncService.search($scope.query.name)
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

    var url = 'http://192.168.43.76:3000';

    return {
      getList: function () {
        var q = $q.defer();
        var _url = url + '/anc/list';

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
      },

      search: function (_name) {
        var q = $q.defer();
        var _url = url + '/anc/search';

        $http.post(_url, {name: _name})
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