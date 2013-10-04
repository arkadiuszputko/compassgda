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
                    getVenues(categoriesIds[0]);
                    getVenues(categoriesIds[1]);
                    getVenues(categoriesIds[2]);
                    getVenues(categoriesIds[3]);
                    getVenues(categoriesIds[4]);
                    getVenues(categoriesIds[5]);
                    getVenues(categoriesIds[6]);
                    getVenues(categoriesIds[7]);
                    getVenues(categoriesIds[8]);
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
                    if (!$scope.currentCategory) {
                        $scope.currentCategory = thisCategory;
                        $scope.venuesSections[thisCategory].current = true;
                    }

                    if (!$scope.currentVenue) {
                        $scope.currentVenue = $scope.venuesSections[$scope.currentCategory].venues[0];
                        $scope.venuesSections[thisCategory].venues[0].current = true;
                        getVenueDetails($scope.venuesSections[thisCategory].venues[0]);
                        getVenueDetails(getNextVenue($scope.currentVenue));
                        getVenueDetails(getNextVenue(getNextVenue($scope.currentVenue)));
                    } else {
                        getVenueDetails($scope.venuesSections[thisCategory].venues[0]);
                    }
                },
                function searchError (res) {

                });
            },

            getNextVenuesFromApi = function (venue) {
                foursquareVenuesSearch.query({
                    ll: '54.352025, 18.646638',
                    v: date,
                    limit: 50,
                    categoryId: venue.category.categoryParentId
                },
                function searchSuccess (res) {
                    $scope.venuesSections = venuesService.decorateCompactVenues(res.response.venues, venue.category.categoryParentId);
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
            },
            getVenueIndex = function (venue) {
                return $scope.venuesSections[venue.category.apiName].venues.indexOf(venue);
            },
            getVenuesCount = function (venue) {
                return $scope.venuesSections[venue.category.apiName].venues.length;
            };

        $scope.showNextVenue = function (venue) {
            $scope.isForward = true;
            $scope.isBack = false;
            var nextVenue = getNextVenue(venue);
            venue.current = false;
            if (nextVenue) { nextVenue.current = true; }
            if (getNextVenue(nextVenue)) {
                if (!getNextVenue(nextVenue).isComplete) {
                    getVenueDetails(getNextVenue(nextVenue));
                }
            } else {
                //getNextVenuesFromApi(venue);
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
            if (nextCategory) {
                var nextVenue = $scope.venuesSections[nextCategory].venues[0];
                $scope.venuesSections[$scope.currentCategory].current = false;
                $scope.venuesSections[nextCategory].current = true;
            }
            if (nextVenue) {
                nextVenue.current = true;
                if (getNextVenue(nextVenue) && !getNextVenue(nextVenue).isComplete) {
                    getVenueDetails(getNextVenue(nextVenue));
                }
                if (getNextCategory(nextVenue)) {
                    getVenueDetails($scope.venuesSections[getNextCategory(nextVenue)].venues[0]);
                }
                $scope.currentCategory = nextCategory;
            }
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
        };

        $scope.getVenueStart = function () {
            var index = getVenueIndex($scope.currentVenue),
                length = getVenuesCount($scope.currentVenue) - 1;
            if (index === 0 || index === 1) {
                return 0;
            } else if (index === length) {
                return length - 1;
            } else {
                return index - 2;
            }
        };

        $scope.getVenueEnd = function () {
            var index = getVenueIndex($scope.currentVenue),
                length = getVenuesCount($scope.currentVenue) - 1;
            if (index === 0) {
                return 2;
            } else if (index === length || index === length - 1) {
                return length;
            } else {
                return index + 2;
            }
        };

        angular.element(document).bind("keyup", function(event) {
            if (event.which === 37) {
                $scope.$apply(function () {
                    if (getVenueIndex($scope.currentVenue) !== 0) {
                        $scope.showPrevVenue($scope.currentVenue);
                    }
                });
            } else if (event.which === 39) {
                $scope.$apply(function () {
                    if (getVenueIndex($scope.currentVenue) !== getVenuesCount($scope.currentVenue)) {
                        $scope.showNextVenue($scope.currentVenue);
                    }
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
