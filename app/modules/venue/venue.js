'use strict';

angular.module('compassgdaApp')
    .controller('VenueCtrl', function ($scope, $routeParams, $location, categoriesService, categoriesApi, venuesService, venueService, venuesApi) {
        $scope.venue = venuesService.getVenueByAppName(venueAppName, categoryAppName);

        var date = moment().format('YYYYMMDD'),
            categories = categoriesService.getCategories(),
            cityVenues = venuesService.getVenues() || [],
            venueAppName = $routeParams.venueName,
            categoryAppName = $routeParams.categoryName,
            getCategoriesFromApi = function () {
                categoriesApi.query({
                    v: date
                },
                function querySuccess (data) {
                    categories = data.response.categories;
                    categoriesService.setCategories(categories)
                    if (!cityVenues.length) {
                        angular.forEach(categories, function(category){
                            getVenuesFromCategory(category.id);
                        });
                    }
                },
                function queryError (data) {

                });
            },
            getVenuesFromCategory = function (categoryId) {
                venuesApi.query({
                    ll: '54.352025,18.646638',
                    v: date,
                    limit: 50,
                    categoryId: categoryId
                },
                function querySuccess (data) {
                    venuesService.addVenues(data.response.venues, categoryId);
                    if (categoryId === categoriesService.getIdByAppName(categoryAppName)) {
                        var venue = venuesService.getVenueByAppName(venueAppName, categoryAppName);
                        if (venue && !venue.complete) {
                            venueService.getCompleteVenue(venue.id).then(function (completeVenue) {
                                $scope.venue = venueService.decorateCompleteVenue(venue, completeVenue);
                                console.log(venue);
                            });
                        } else if (venue && venue.complete) {
                            $scope.venue = venue;
                        }
                    }
                },
                function querySuccess (data) {

                });
            };

        if (!categories.length) {
            getCategoriesFromApi();
        } else {
            var venue = venuesService.getVenueByAppName(venueAppName, categoryAppName);

            if (venue && !venue.complete) {
                venueService.getCompleteVenue(venue.id).then(function (completeVenue) {
                    $scope.venue = venueService.decorateCompleteVenue(venue, completeVenue);
                    console.log(venue);
                });
            } else if (venue && venue.complete) {
                $scope.venue = venue;
            }
        }
    });
