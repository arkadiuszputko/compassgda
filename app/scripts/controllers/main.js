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
                    ll: '40.714353,-74.005973',
                    v: date,
                    locale: 'en',
                    limit: currentLimit,
                    section: 'food',
                    offset: offset || currentOffset
                },
                function success (res) {
                    $scope.venues = venuesService.decorateVenues(res.response.groups[0].items, currentOffset);
                    $scope.venues[1].next = true;
                    $scope.venues[2].next = true;
                    currentOffset = currentOffset + currentLimit;
                }
            );
        }

        getVenues();

        $scope.getNextVenue = function (index) {
            var length = $scope.venues.length;
            $scope.venues[index].hideit = true;
            if (length - 2 > index) {
                preloadImage($scope.venues[index + 2].photo.url);
                preloadImage($scope.venues[index + 3].photo.url);
            }

            if (index < currentOffset - 3) {
                getVenues(currentOffset);
            }
        }

        function preloadImage (url) {
            var img = new Image();
            img.src = url;
        }
    });
