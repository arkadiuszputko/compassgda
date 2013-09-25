angular.module('venues', []).
    factory('venuesService', function(photoService) {

        return {
            decorateVenues: function (items) {
                var venues = [];

                angular.forEach(items, function(item){
                    var venue = {
                        id: item.venue.id,
                        name: item.venue.name,
                        photo: {
                            url: photoService.getImageUrl(item.venue.photos.groups[0].items[0]),
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
            },
        }
    });
