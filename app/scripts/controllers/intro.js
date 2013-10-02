'use strict';

angular.module('compassgdaApp')
    .controller('IntroCtrl', function ($scope, foursquareService, venuesService, geolocationService, gmapsLatLngService) {
        var date = moment().format('YYYYMMDD');
        $scope.geo = {
            isCity : false,
            cityName : ''
        };

        var getVenues = function (ll) {
            foursquareService.query({
                    ll: ll,
                    v: date,
                    locale: 'en',
                    section: 'topPicks',
                    limit: 9,
                    offset: 0
                },
                function success (res) {
                    var picked = venuesService.decorateVenues(res.response.groups[0].items, 'topPicks');
                    $scope.topPickPhoto = [];
                    angular.forEach(picked, function(item, index){
                        $scope.topPickPhoto.push({
                            index : index,
                            url: item.photo.url
                        });
                    })
                }
            );
        }

        geolocationService.getUserPosition(
            function success(position) {
                geolocationService.setPosition(position.coords.latitude, position.coords.longitude);
                gmapsLatLngService.query({
                        latlng: position.coords.latitude + ',' + position.coords.longitude,
                        language: 'pl',
                        sensor: false
                    },
                    function(response){
                        var res = response.results;
                        if(res.length) {
                            geolocationService.setAddress(res[0].formatted_address)
                            getVenues(geolocationService.getPosition().ll);
                            displayCity(geolocationService.getAddress());
                        }
                    }
                );
            },
            function error(err) {
                // what to do on error response, Arku? TODO
                // that mainly happens when user click 'Deny'
                // when asked by browser for sharing geo info
            },
            function noGeolocation() {
                // what to do if there is no geolocation feature, Arku? TODO
            }
        );

        var displayCity = function(cityName) {
            //res = res.results;
            //if(res.length) {
                $scope.geo.cityName = cityName;
                $scope.geo.isCity = true;
            //}
        }
    });
