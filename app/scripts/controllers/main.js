'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, foursquareService, venuesService) {
        var date = moment().format('YYYYMMDD'),
            currentOffset = 0,
            currentLimit = 10,
            templates = [
                { name: 'bigPhoto', url: 'views/bigPhoto.html'},
                { name: 'smallPhoto', url: 'views/smallPhoto.html'}
            ];
        $scope.template = templates[0];

        var getVenues = function (offset) {
            foursquareService.query({
                    ll: '52.229676,21.012229',
                    v: date,
                    locale: 'en',
                    limit: currentLimit,
                    //section: 'food',
                    offset: offset || currentOffset
                },
                function success (res) {
                    $scope.venues = venuesService.decorateVenues(res.response.groups[0].items);
                    $scope.venues[0].current = true;
                    $scope.venues[1].next = true;
                    $scope.venues[2].next = true;
                    currentOffset = currentOffset + currentLimit;
                }
            );
        }

        getVenues();

        $scope.getNextVenue = function (index) {
            $scope.venues[index].current = false;
            $scope.venues[index].justHide = true;
            $scope.venues[index + 1].justShow = true;
            $scope.venues[index + 1].current = true;
            $scope.venues[index + 2].next = true;
            preloadImage($scope.venues[index + 2].photo.url);
            $scope.venues[index + 3].next = true;
            preloadImage($scope.venues[index + 3].photo.url);
            if (index < currentOffset - 3) {
                getVenues(currentOffset);
                currentOffset = currentOffset + currentLimit;
            }
        }

        function preloadImage (url) {
            var img = new Image();
            img.src = url;
        }
    });
