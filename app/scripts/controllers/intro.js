'use strict';

angular.module('compassgdaApp')
    .controller('IntroCtrl', function ($scope, foursquareService, venuesService) {
        var date = moment().format('YYYYMMDD');
        var getVenues = function () {
            foursquareService.query({
                    ll: '52.229676,21.012229',
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

        getVenues();
    });
