var app = angular.module('soilMoistureApp', ['ui.knob', 'angularUtils.directives.dirPagination']);

app.controller('DashboardCtrl', ['$scope', '$timeout', '$http', '$q', '$filter',
    function($scope, $timeout, $http, $q, $filter) {

        $scope.value = 0;
        $scope.options = {
            unit: "%",
            readOnly: true,
            subText: {
                enabled: true,
                text: 'Soil Moisture',
                color: 'gray',
                font: 'auto'
            },
            enabled: true, duration: 1000, ease: 'bounce',
            trackWidth: 40,
            barWidth: 25,
            trackColor: '#656D7F',
            barColor: '#2CC185'
        };

        getAvgReading().then(function(data){
            $timeout(function() {
                $scope.value = data.avgReading; // load data from server
                $scope.latestReadings = data.latestReadings;
            }, 1000);
        });

        let readingsData = {'avgReading': 0, 'latestReadings': {}};
        function getAvgReading(){
            var url = 'https://mzs-ble-temp-service.herokuapp.com/soil'
            //let url = 'http://localhost:3075/soil'
            let avgReading = 0;
            return $http.get(url).then(function (response) {
                let readings = response.data;
                let last10 = readings.slice(Math.max(readings.length - 10, 0));
                readingsData.latestReadings = last10;
                for(let i=0; i<last10.length-1; i++){
                    avgReading += last10[i].soil_moisture;
                }
                avgReading = avgReading/10;
                let avgReadingPercent = ((3940-avgReading)/3940)*100;
                readingsData.avgReading = avgReadingPercent;
                return readingsData;       // get percent
            });
        }
    }])
