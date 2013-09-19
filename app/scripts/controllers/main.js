'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, foursquareService, venuesService) {
        var date = moment().format('YYYYMMDD');

        foursquareService.query({
                ll: '54.3520252,18.6466384',
                v: date,
                locale: 'en'
            },
            function success (res) {
                $scope.venues = venuesService.decorateVenues(res.response.groups[0].items);
            }
        );
    });
