'use strict';

angular.module('compassgdaApp')
    .controller('CityCtrl', function ($scope, $routeParams, $location, categoriesService, categoriesApi, venuesService, venuesApi) {
        $scope.categoriesCovers = [];

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
                function querySuccess (data) {
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
                        getCategoriesCovers();
                    }
                },
                function querySuccess (data) {

                });
            },
            getCategoriesCovers = function () {
                if (cityVenues.length) {
                    angular.forEach(cityVenues, function(venues){
                        if (venues.venues.length) {
                            $scope.categoriesCovers.push(venues.venues[0]);
                        }
                    });
                }
            };

        $scope.goToCategory = function (categoryName) {
            $location.path($location.path() + categoryName);
        };

        if (!categories.length) {
            getCategoriesFromApi();
        } else {
            getCategoriesCovers();
        }
    });
