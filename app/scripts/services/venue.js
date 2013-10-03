angular.module('venue', [])
    .factory('venueService', function(photoService) {
        return {
            addVenuePhotos: function (venue, photos) {
                angular.forEach(photos.groups, function (group) {
                    if (group.type === 'venue') {
                        angular.forEach(group.items, function(item){
                            venue.photos.push({
                                url: item.url,
                                sizes: item.sizes.items
                            });
                        });
                    }
                    venue.isComplete = true;
                });
            },
            addVenueTips: function (venue, tips) {
                angular.forEach(tips.groups, function (group) {
                    angular.forEach(group.items, function(item) {
                        venue.tips.push({
                            userId: item.user.id,
                            text: item.text
                        });
                    });
                });
                venue.isComplete = true;
            }

        }
    });