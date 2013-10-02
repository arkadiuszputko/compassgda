'use strict';

angular.module('compassgdaApp')
    .controller('IntroCtrl', function ($scope, $location, foursquareService, venuesService, geolocationService, gmapsLatLngService, gmapsCityService) {
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
                    var picked = venuesService.decorateVenues(res.response.groups[0].items, 'topPicks', false);
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
                            geolocationService.setAddress(getCityNameFromResponse(res));
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
            $scope.geo.cityName = cityName;
            $scope.geo.isCity = true;
        }

        $scope.onSubmit = function(e) {
            e.preventDefault();
            var city = this.city.trim();
            if(city != '') {
                gmapsCityService.query({
                        address: city,
                        language: 'pl',
                        sensor: false
                    },
                    function success(response) {
                        geolocationService.setPosition(response.results[0].geometry.location.lat, response.results[0].geometry.location.lng);
                        geolocationService.setAddress(getCityNameFromResponse(response.results));
                        $location.path('board');
                    }
                )
            }
        }

        var getCityNameFromResponse = function(res) {
            var cityName = null;
            for (var i = 0; i < res[0].address_components.length; i++) {
                for (var j = 0; j < res[0].address_components[i].types.length; j++) {
                    if(res[0].address_components[i].types[j] == 'locality') {
                        cityName = res[0].address_components[i].long_name;
                    }
                }
            }
            return cityName;
        }
    });
