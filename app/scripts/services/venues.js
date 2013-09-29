angular.module('venues', []).
    factory('venuesService', function(photoService, categoriesService) {

        var venues = {};

        var getTemplateUrl = function (item) {
            if (item.venue.photos.groups.length && item.venue.photos.groups[0].items[0].height > 620) {
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
                            url: item.venue.photos.groups.length ? photoService.getImageUrl(item.venue.photos.groups[0].items[0]) : '',
                            width: item.venue.photos.groups.length ? item.venue.photos.groups[0].items[0].width : 0,
                            height: item.venue.photos.groups.length ? item.venue.photos.groups[0].items[0].height : 0
                        },
                        tip: {
                            userId: item.tips ? item.tips[0].user.id : '',
                            text: item.tips ? item.tips[0].text : 'Sorry this venue doesn\'t have any tip but We are sure that this is a great place'
                        },
                        rating: item.rating || 0,
                        template: {
                            url: getTemplateUrl(item)
                        },
                        category: {
                            id: item.venue.categories[0].id,
                            name: item.venue.categories[0].name,
                            categoryParentId: categoriesService.getSection(item.venue.categories[0].id).id,
                            categoryParentName: categoriesService.getSection(item.venue.categories[0].id).name,
                            sectionName: categoriesService.getSection(item.venue.categories[0].id).sectionName
                        }
                    };
                    venues[section].push(venue);
                });

                return venues[section];
            },
        }
    });
