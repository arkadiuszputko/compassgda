angular.module('venues', []).
    factory('venuesService', function() {

        function getImageUrl(prefix, suffix, w, h) {
            return prefix + w + 'x' + h + suffix;
        }

        return {
            decorateVenues: function (items) {
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
        }
    });
