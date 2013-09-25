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
                    ll: '54.3520252,18.6466384',
                    v: date,
                    locale: 'en',
                    limit: currentLimit,
                    section: 'food',
                    offset: offset || currentOffset
                },
                function success (res) {
                    $scope.venues = venuesService.decorateVenues(res.response.groups[0].items);
                    $scope.venues[0].current = true;
                    currentOffset = currentOffset + currentLimit;
                }
            );
        }

        getVenues();

        $scope.getNextVenue = function (index) {
            $scope.venues[index].current = false;
            $scope.venues[index + 1].current = true;
            if (index < currentOffset - 3) {
                getVenues(currentOffset);
            }
        }

    });
