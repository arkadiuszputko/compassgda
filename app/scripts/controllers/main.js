'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, foursquareService) {
        var date = moment().format('YYYYMMDD');

        foursquareService.query({
                ll: '54.3520252,18.6466384',
                client_id: '45Y1ZE0JIEI53PA4ZPSDRDO2FHKHPFIP3KZF0EMA0ZGULPSN',
                client_secret: 'J4N5TP2JGLOVNKUYJW2AKSLSCC1W2CFURVO2YSYCLQHKIKGZ',
                v: date,
                locale: 'en'
            },
            function success (res) {
                $scope.venues = decorateVenues(res.response.groups[0].items);
            }
        );

        function getImageUrl(prefix, suffix, w, h) {
            return prefix + w + 'x' + h + suffix;
        }

        function decorateVenues(items) {
            var venues = [];

            angular.forEach(items, function(item){
                var venue = {
                    id: item.venue.id,
                    name: item.venue.name,
                    photo: {
                        url: getImageUrl(
                            item.venue.photos.groups[0].items[0].prefix,
                            item.venue.photos.groups[0].items[0].suffix,
                            item.venue.photos.groups[0].items[0].width,
                            item.venue.photos.groups[0].items[0].height
                        ),
                        width: item.venue.photos.groups[0].items[0].width,
                        height: item.venue.photos.groups[0].items[0].height
                    },
                    tip: {
                        userId: item.tips[0].user.id,
                        text: item.tips[0].text
                    },
                    rating: item.rating,
                };
                venues.push(venue);
            });

            return venues;
        }
    });
