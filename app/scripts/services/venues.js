angular.module('venues', []).
    factory('venuesService', function(photoService, categoriesService) {

        var venues = {};

        var getTemplateUrl = function (item) {
            if (item.venue.photos.groups[0].items[0].height > 620) {
                return 'views/bigPhoto.html';
            } else {
                return 'views/smallPhoto.html';
            }
        }

        return {
            decorateVenues: function (items, section) {
                if (!venues[section]) {
                    venues[section] = [];
                }
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
                        category: {
                            id: item.venue.categories[0].id,
                            name: item.venue.categories[0].name,
                            sectionId: categoriesService.getSection(item.venue.categories[0].id).id,
                            sectionName: categoriesService.getSection(item.venue.categories[0].id).name
                        }
                    };
                    venues[section].push(venue);
                });

                return venues[section];
            },
        }
    });
