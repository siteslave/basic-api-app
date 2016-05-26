angular.module('starter.chart', ["highcharts-ng"])
  .controller('ChartCtrl', function ($scope, $rootScope, $ionicLoading, ChartService) {

    $scope.query = {};

    var url = $rootScope.serverUrl + '/chart';

      $scope.chartConfig = {

          options: {
              chart: {
                  type: 'column'
              },
              tooltip: {
                  style: {
                      padding: 10,
                      fontWeight: 'bold'
                  }
              }
          },
          series: [{
              data: []
          }],
          title: {
              text: 'Hello'
          },
          loading: false,
          xAxis: {
              categories: [],
              title: { text: 'values' }
          },
          useHighStocks: false
    };

      var currentDate = moment().format('YYYY-MM-DD');

      $scope.getChartData = function (date) {
        $ionicLoading.show({
          template: '<ion-spinner icon="android"></ion-spinner> Loading...'
        });


        ChartService.getChart(date)
          .then(function (res) {
            res.forEach(function (v) {
              $scope.chartConfig.xAxis.categories.push(v.hname);
              $scope.chartConfig.series[0].data.push(parseInt(v.cases));
            });
            $ionicLoading.hide();
          }, function (err) {
            $ionicLoading.hide();
            alert(err);
          });
      };

      // initial chart
    $scope.getChartData(currentDate);

    $scope.getChart = function () {

      var date = moment($scope.query.date).format('YYYY-MM-DD');
      console.log(date);

      $scope.getChartData(date);

    };

  })
  .factory('ChartService', function ($q, $http) {

      return {
          getChart: function (date) {
            var q = $q.defer();
            var _url = 'http://nrefer.healtharea.net/refer/report/sum_hcode?date='+date+'&ws=true';
            $http.get(_url, {})
              .success(function (data) {
                q.resolve(data.data);
              })
              .error(function () {
                q.reject('Connection failed')
              });

            return q.promise;
          }
    }
  });