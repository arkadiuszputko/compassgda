angular.module('venue', []).
    factory('venueService', function($q, venueApi, photosService, tipsService) {
        var setVenueAppName = function (shortName) {
            return getSlug(shortName);
        };

        return {
            decorateCompactVenue: function (item, cat) {
                venue = {
                    id: item.id,
                    name: item.name,
                    appName: setVenueAppName(item.name),
                    tips: [],
                    template: {
                        url: ''
                    },
                    photos: [],
                    category: item.categories[0],
                    parentCategory: {
                        id: cat.id,
                        iconUrl: cat.icon.prefix + '64' + cat.icon.suffix,
                        name: cat.name,
                        shortName: cat.shortName,
                        appName: cat.appName
                    },
                    styling: {
                        fontStyling: ''
                    },
                    rating: (item.rating) ? item.rating*10 + '%' : null
                };
                return venue;
            },

            decorateCompleteVenue: function (venue, response) {
                venue.photos = photosService.decoratePhotos(response.photos);
                venue.tips = tipsService.decorateTips(response.tips);
                venue.complete = true;
                return venue;
            },

            getCompleteVenue: function (id) {
                var deferred = $q.defer();
                venueApi.getOne({
                    venueId: id,
                    v: moment().format('YYYYMMDD')
                },
                function getSuccess (data) {
                    deferred.resolve(data.response.venue);
                },
                function getError (data) {
                    return data;
                });
                return deferred.promise;
            }
        };
    });
