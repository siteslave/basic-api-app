angular.module('starter.chart', ["highcharts-ng"])
  .controller('ChartCtrl', function ($scope, $rootScope, ChartService) {

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

      ChartService.getChart(url)
        .then(function (res) {

            /*
            date: "2016-05-26",
            region: "07",
            provcode: "40",
            changwatname: "ขอนแก่น",
            hcode: "11000",
            hname: "โรงพยาบาลน้ำพอง",
            cases: "14",
            opd: "14",
            ipd: "0",
            inprov: "14",
            inregion: "14"
            */
          res.forEach(function (v) {
            $scope.chartConfig.xAxis.categories.push(v.hname);
            $scope.chartConfig.series[0].data.push(parseInt(v.cases));
          });

        }, function (err) {
          alert(err);
        });

  })
  .factory('ChartService', function ($q, $http) {

      return {
          getChart: function (url) {
            var q = $q.defer();
            //var url = 'http://localhost:3000/chart';
            $http.get(url, {})
              .success(function (data) {
                q.resolve(data.data.data);
              })
              .error(function () {
                q.reject('Connection failed')
              });

            return q.promise;
          }
    }
  });