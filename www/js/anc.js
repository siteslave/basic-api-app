
angular.module('starter.anc', [])
  .controller('AncCtrl', function ($scope, AncService) {

    $scope.anc = [];
    $scope.query = {};

    $scope.getList = function () {
      AncService.getList()
        .then(function (rows) {
          $scope.anc = rows;
        }, function (err) {
          alert(JSON.stringify(err));
        });
    };

    $scope.search = function () {
      if ($scope.query.name) {
        $scope.anc = [];

        AncService.search($scope.query.name)
          .then(function (rows) {
            $scope.anc = rows;
          }, function (err) {
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