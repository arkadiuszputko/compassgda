'use strict';

angular.module('compassgdaApp')
    .controller('CategoryCtrl', function ($scope, $routeParams, $location, categoriesService, categoriesApi, venuesService, venueService, venuesApi) {
        $scope.categoriesCovers = [];
        $scope.categoryName = $routeParams.categoryName;
        var date = moment().format('YYYYMMDD'),
            categories = categoriesService.getCategories(),
            cityVenues = venuesService.getVenues() || [],
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
                    if (cityVenues && cityVenues.length === 10) {
                        getVenues();
                    }
                },
                function querySuccess (data) {

                });
            },
            getVenues = function () {
                if (cityVenues.length) {
                    var venues = [];
                    angular.forEach(cityVenues, function(ven){
                        if (ven.category.appName === $scope.categoryName) {
                            venues = ven.venues;
                        }
                    });
                    $scope.categoryVenues = decorateVenues(venues);
                }
            },
            decorateVenues = function (venues) {
                angular.forEach(venues, function(venue){
                    venueService.getCompleteVenue(venue.id).then(function (completeVenue) {
                        venue = venueService.decorateCompleteVenue(venue, completeVenue);
                    });
                });
                return venues;
            };

        $scope.goToVenue = function (venueName) {
            console.log($location);
            $location.path($location.path() + '/' + venueName);
        };

        if (!categories.length) {
            getCategoriesFromApi();
        } else {
            getVenues();
        }
    });
