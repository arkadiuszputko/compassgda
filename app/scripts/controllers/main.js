'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, $location, foursquareService, venuesService) {
        var date = moment().format('YYYYMMDD'),
            currentOffset = 0,
            currentLimit = 10,
            currentVenueIndex = 0,
            templates = [
                { name: 'bigPhoto', url: 'views/bigPhoto.html'},
                { name: 'smallPhoto', url: 'views/smallPhoto.html'}
            ];
        $scope.isForward = true;
        $scope.isBack = false;
        $scope.template = templates[0];

        var getVenues = function (offset) {
            foursquareService.query({
                    ll: '54.3520252,18.6466384',
                    v: date,
                    locale: 'en',
                    section: 'topPicks',
                    limit: currentLimit,
                    offset: offset || currentOffset
                },
                function success (res) {
                    $scope.venues = venuesService.decorateVenues(res.response.groups[0].items);
                    if (currentOffset === 0) {
                        $scope.venues[0].current = true;
                        preloadImage($scope.venues[1].photo.url);
                    }
                    currentOffset = currentOffset + currentLimit;
                }
            );
        }

        getVenues();

        $scope.getNextVenue = function (index) {
            $scope.isBack = false;
            $scope.isForward = true;
            $scope.venues[index].current = false;
            if ($scope.venues[index + 1]) {
                $scope.venues[index + 1].current = true;
            }
            if ($scope.venues[index + 2]) {
                preloadImage($scope.venues[index + 2].photo.url);
            }
            currentVenueIndex = index + 1;
        }

        $scope.getPrevVenue = function (index) {
            $scope.isBack = true;
            $scope.isForward = false;
            $scope.venues[index].current = false;
            if ($scope.venues[index - 1]) {
                $scope.venues[index - 1].current = true;
            }
            currentVenueIndex = index - 1;
        }

        angular.element(document).bind("keyup", function(event) {
            if (event.which === 37) {
                $scope.$apply(function () {
                    $scope.getPrevVenue(currentVenueIndex);
                });
            } else if (event.which === 39) {
                $scope.$apply(function () {
                    $scope.getNextVenue(currentVenueIndex);
                });
            }
        });

        function preloadImage (url) {
            var img = new Image();
            img.src = url;
        }
    });
