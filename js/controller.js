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

        $scope.refreshReadings = () => {
            getAvgReading().then(function(data){
                $timeout(function() {
                    $scope.value = data.avgReading; // load data from server
                    $scope.latestReadings = data.latestReadings;
                }, 1000);
            });
        }

        let readingsData = {'avgReading': 0, 'latestReadings': {}};
        function getAvgReading(){
            var url = 'https://mzs-ble-temp-service.herokuapp.com/soil'
            //let url = 'http://localhost:3075/soil'
            let totalReading = 0;
            let avgReading = 0;

            return $http.get(url).then(function (response) {
                let readings = response.data;

                // average readings in last 24 hours.. 48 readings
                let latest = readings.slice(0, 48);

                readingsData.latestReadings = latest;
                for(let i=0; i<latest.length; i++){
                    totalReading += latest[i].soil_moisture;
                }
                avgReading = totalReading/48;       // assuming a reading every 30 minutes...

                // highest reading recorded 100%
                let avgReadingPercent = 100 - ((avgReading - 2700)/(4000-2700))*100;
                readingsData.avgReading = avgReadingPercent;
                return readingsData;       // get percent
            });
        }
    }])
