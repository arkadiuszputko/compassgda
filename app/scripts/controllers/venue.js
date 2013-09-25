'use strict';

angular.module('compassgdaApp')
    .controller('VenueCtrl', function ($scope, $routeParams, foursquareServiceVenuePhotos, photoService) {
        var date = moment().format('YYYYMMDD'),
            offset = 0;

        foursquareServiceVenuePhotos.query({
                venue_id: $routeParams.venueId,
                v: date,
                locale: 'en',
                limit: 10,
                offset: offset
            },
            function success (res) {
                $scope.photos = decoratePhotos(res.response.photos.items);
            }
        );

        function decoratePhotos (photos) {
            var decoratedPhotos = [];
            angular.forEach(photos, function(photo){
                decoratedPhotos.push({
                    id: photo.id,
                    url: photoService.getImageUrl(photo)
                });
            });

            return decoratedPhotos;
        }
    });
