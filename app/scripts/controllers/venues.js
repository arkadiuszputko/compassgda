'use strict';

angular.module('compassgdaApp')
    .controller('VenuesCtrl', function ($scope, $routeParams, $rootScope, $location, venuesService, venueService, photoService, categoriesService, foursquareVenueGet, foursquareCategoriesService, foursquareVenuesSearch) {
        var date = moment().format('YYYYMMDD'),
            categoriesIds = [];

        $scope.venuesName = $routeParams.venuesName;
        $scope.venuesSections = $rootScope.compactVenues;

        var getCategories = function () {
                foursquareCategoriesService.query({
                    v: date
                },
                function success (res) {
                    categoriesService.setCategories(res.response.categories);
                    categoriesIds = categoriesService.getCategoriesIds();
                    length = categoriesIds.length;
                    angular.forEach(categoriesIds, function(id, index){
                        getVenues(id);
                    });
                },
                function error (res) {
                });
            },

            getVenues = function (categoryId) {
                foursquareVenuesSearch.query({
                    ll: '54.352025,18.646638',
                    v: date,
                    limit: 50,
                    categoryId: categoryId
                },
                function searchSuccess (res) {
                    var thisCategory = categoriesService.getCategoryApiName(categoriesService.getNameById(categoryId));
                    $scope.venuesSections = venuesService.decorateCompactVenues(res.response.venues, categoryId);
                    venuesService.addToTopPicks($scope.venuesSections[thisCategory].venues[0]);
                    setFrists();
                },
                function searchError (res) {
                });
            },

            getVenueDetails = function (venue) {
                foursquareVenueGet.getOne({
                    venue_id: venue.id
                },
                function getVenueSuccess (res) {
                    venuesService.getVenue(venue.category.apiName, venue.id);
                    venueService.addVenuePhotos(venuesService.getVenue(venue.category.apiName, venue.id), res.response.venue.photos);
                    venueService.addVenueTips(venuesService.getVenue(venue.category.apiName, venue.id), res.response.venue.tips);
                    getFirstPhoto(venuesService.getVenue(venue.category.apiName, venue.id));
                    getFirstTip(venuesService.getVenue(venue.category.apiName, venue.id));
                },
                function getVenueError (res) {
                });
            },

            getFirstPhoto = function (venue) {
                if (venue.photos.length) {
                    venue.photo = {
                        url: venue.photos[0].url
                    };
                }
            },

            getFirstTip = function (venue) {
                if (venue.tips.length) {
                    venue.tip = {
                        text: venue.tips[0].text,
                        userId: venue.tips[0].userId
                    };
                }
            },

            setFrists = function () {
                if ($scope.venuesSections[$scope.venuesName].currentVenueIndex) {
                    $scope.venuesSections[$scope.venuesName].venues[$scope.venuesSections[$scope.venuesName].currentVenueIndex].current = true;
                } else {
                    $scope.venuesSections[$scope.venuesName].venues[0].current = true;
                    $scope.venuesSections[$scope.venuesName].currentVenueIndex = 0;
                }

                getVenueDetails($scope.venuesSections[$scope.venuesName].venues[$scope.venuesSections[$scope.venuesName].currentVenueIndex]);
            };

        $scope.getNextCategory = function (venue) {
            $location.url('/venues/' + venue.category.apiName);
        }

        if (venuesService.getVenues()) {
            getCategories();
        } else {
            setFrists();
        }
    });
