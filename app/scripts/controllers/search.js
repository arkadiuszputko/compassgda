'use strict';

angular.module('compassgdaApp')
    .controller('SearchCtrl', function ($scope, $rootScope, $location, foursquareVenuesSearch, foursquareVenueGet, foursquareCategoriesService, categoriesService, venuesService, venueService, geolocationService, storeData) {
        $scope.venuesSections = [];
        $scope.isForward = true;
        $scope.isBack = false;
        $scope.isUp = true;
        $scope.isDown = false;
        $scope.nav = {
            shown : false,
            button : false
        };

        var date = moment().format('YYYYMMDD'),
            categoriesIds = [],

            getCategories = function () {
                foursquareCategoriesService.query({
                    v: date
                },
                function success (res) {
                    categoriesService.setCategories(res.response.categories);
                    categoriesIds = categoriesService.getCategoriesIds();
                    getVenues();
                });
            },

            getVenues = function () {
                foursquareVenuesSearch.query({
                    ll: geolocationService.getPosition().ll,
                    v: date,
                    limit: 50,
                    categoryId: categoriesIds
                },
                function searchSuccess (res) {
                    $scope.currentCategory = categoriesService.getCategoryApiName(categoriesService.getSection(res.response.venues[0].categories[0].id).sectionName);
                    $scope.venuesSections = venuesService.decorateCompactVenues(res.response.venues);
                    $scope.venuesSections[$scope.currentCategory].current = true;
                    $scope.venuesSections[$scope.currentCategory].venues[0].current = true;
                    $scope.currentVenue = $scope.venuesSections[$scope.currentCategory].venues[0];
                    getVenueDetails($scope.venuesSections[$scope.currentCategory].venues[0]);
                    getVenueDetails(getNextVenue($scope.currentVenue));
                    getVenueDetails(getNextVenue(getNextVenue($scope.currentVenue)));
                    var nextCategoryVenue = $scope.venuesSections[getNextCategory($scope.currentVenue)].venues[0];
                    getVenueDetails(nextCategoryVenue);
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
                venue.photo = {
                    url: venue.photos[0].url
                };
            },

            getFirstTip = function (venue) {
                venue.tip = {
                    text: venue.tips[0].text,
                    userId: venue.tips[0].userId
                };
            },
            getNextVenue = function (venue) {
                var index = $scope.venuesSections[venue.category.apiName].venues.indexOf(venue),
                    nextVenue = $scope.venuesSections[venue.category.apiName].venues[index + 1];
                return nextVenue;
            },
            getPrevVenue = function (venue) {
                var index = $scope.venuesSections[venue.category.apiName].venues.indexOf(venue);
                return $scope.venuesSections[venue.category.apiName].venues[index - 1];
            },
            getNextCategory = function (venue) {
                var index = Object.keys($scope.venuesSections).indexOf(venue.category.apiName),
                    nextCat = Object.keys($scope.venuesSections)[index + 1];
                return nextCat;
            },
            getPrevCategory = function (venue) {
                var index = Object.keys($scope.venuesSections).indexOf(venue.category.apiName),
                    nextCat = Object.keys($scope.venuesSections)[index - 1];
                return nextCat;
            },
            checkIfLocationAvailable = function(){
                if(!geolocationService.isPositionSet()) {
                    if(storeData.exists('lat') && storeData.exists('lng') && storeData.exists('city')) {
                        geolocationService.setPosition(parseInt(storeData.get('lat'), 10), parseInt(storeData.get('lng'), 10));
                        geolocationService.setAddress(storeData.get('city'));
                    }
                }
            };

        $scope.showNextVenue = function (venue) {
            $scope.isForward = true;
            $scope.isBack = false;
            var nextVenue = getNextVenue(venue);
            venue.current = false;
            nextVenue.current = true;
            if (!getNextVenue(nextVenue).isComplete) {
                getVenueDetails(getNextVenue(nextVenue));
            }
            $scope.currentVenue = nextVenue;
        };
        $scope.showPrevVenue = function (venue) {
            $scope.isForward = false;
            $scope.isBack = true;
            var prevVenue = getPrevVenue(venue);
            venue.current = false;
            prevVenue.current = true;
            $scope.currentVenue = prevVenue;
        };
        $scope.showNextCategory = function (venue) {
            $scope.isDown = true;
            $scope.isUp = false;
            var nextCategory = getNextCategory(venue);
            var nextVenue = $scope.venuesSections[nextCategory].venues[0];
            $scope.venuesSections[$scope.currentCategory].current = false;
            $scope.venuesSections[nextCategory].current = true;
            nextVenue.current = true;
            if (!getNextVenue(nextVenue).isComplete) {
                getVenueDetails(getNextVenue(nextVenue));
            }
            getVenueDetails($scope.venuesSections[getNextCategory(nextVenue)].venues[0]);
            $scope.currentCategory = nextCategory;
            $scope.currentVenue = $scope.venuesSections[$scope.currentCategory].venues[0];
        };
        $scope.showPrevCategory = function (venue) {
            $scope.isDown = false;
            $scope.isUp = true;
            var prevCategory = getPrevCategory(venue);
            $scope.venuesSections[$scope.currentCategory].current = false;
            $scope.venuesSections[prevCategory].current = true;
            $scope.venuesSections[prevCategory].venues[0].current = true;
            $scope.currentCategory = prevCategory;
            $scope.currentVenue = $scope.venuesSections[$scope.currentCategory].venues[0];
        };

        $scope.toggleNav = function(){
            $scope.nav.shown = !$scope.nav.shown;
            $scope.nav.button = !$scope.nav.button;
        }

        angular.element(document).bind("keyup", function(event) {
            if (event.which === 37) {
                $scope.$apply(function () {
                    $scope.showPrevVenue($scope.currentVenue);
                });
            } else if (event.which === 39) {
                $scope.$apply(function () {
                    $scope.showNextVenue($scope.currentVenue);
                });
            } else if (event.which === 40) {
                $scope.$apply(function () {
                    $scope.showNextCategory($scope.currentVenue)
                });
            } else if (event.which === 38) {
                $scope.$apply(function () {
                    $scope.showPrevCategory($scope.currentVenue)
                });
            }
        });
        checkIfLocationAvailable();
        getCategories();

    });
