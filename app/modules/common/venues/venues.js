angular.module('venues', []).
    factory('venuesService', function(categoriesService, venueService) {

        var cityVenues = [],

            decorateVenues = function (venues, cat) {
                angular.forEach(venues, function(venue, index){
                    venues[index] = venueService.decorateCompactVenue(venue, cat);
                    if (index === 0) {
                        venueService.getCompleteVenue(venues[index].id).then(function (completeVenue) {
                            venues[index] = venueService.decorateCompleteVenue(venues[index], completeVenue);
                        });
                    }
                });
                return venues;
            }

        return {
            setVenues: function (ven) {
                cityVenues = ven;
            },
            getVenues: function () {
                return cityVenues;
            },
            addVenues: function (ven, catId) {
                var cat = categoriesService.getCategoryById(catId),
                    venuesObject = {
                        category: cat,
                        venues: decorateVenues(ven, cat)
                    };
                cityVenues.push(venuesObject);
            },
            getVenueByAppName: function (appName, categoryName) {
                var ven = {};
                angular.forEach(cityVenues, function(category){
                    if (category.category.appName === categoryName) {
                        angular.forEach(category.venues, function(venue){
                            if (venue.appName === appName) {
                                ven = venue;
                                return ven;
                            }
                        });
                    }
                    if (ven) {
                        return ven;
                    }
                });
                return ven;
            }
        }
    });
