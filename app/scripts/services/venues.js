angular.module('venues', []).
    factory('venuesService', function(photoService) {

        var venues = [];

        var getTemplateUrl = function (item) {
            if (item.venue.photos.groups[0].items[0].height > 620) {
                return 'views/bigPhoto.html';
            } else {
                return 'views/smallPhoto.html';
            }
        }

        return {
            decorateVenues: function (items, offset) {
                var maxZIndex = 1000,
                    length = items.length;
                    console.log(offset);
                angular.forEach(items, function(item, index){
                    var venue = {
                        id: item.venue.id,
                        name: item.venue.name,
                        photo: {
                            url: photoService.getImageUrl(item.venue.photos.groups[0].items[0]),
                            width: item.venue.photos.groups[0].items[0].width,
                            height: item.venue.photos.groups[0].items[0].height
                        },
                        tip: {
                            userId: item.tips[0].user.id || '',
                            text: item.tips[0].text || 'Sorry this venue doesn\'t have any tip but We are sure that this is a great place'
                        },
                        rating: item.rating || 0,
                        template: {
                            url: getTemplateUrl(item)
                        },
                        justHide: false,
                        justShow: false,
                        current: false,
                        next: false,
                        zIndex: maxZIndex - offset - index
                    };
                    venues.push(venue);
                });

                return venues;
            },
        }
    });
