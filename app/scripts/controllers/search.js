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
                    getVenueDetails($scope.venuesSections[thisCategory].venues[0]);
                    venuesService.addToTopPicks($scope.venuesSections[thisCategory].venues[0]);
                    setFirstCurrients();
                },
                function searchError (res) {
                });
            },

            getVenueDetails = function (venue) {
                foursquareVenueGet.getOne({
                    venue_id: venue.id
                },
                function getVenueSuccess (res) {
                    if (venue.topPick) {
                        venuesService.getVenue('topPicks', venue.id);
                        venueService.addVenuePhotos(venuesService.getVenue('topPicks', venue.id), res.response.venue.photos);
                        venueService.addVenueTips(venuesService.getVenue('topPicks', venue.id), res.response.venue.tips);
                        getFirstPhoto(venuesService.getVenue('topPicks', venue.id));
                        getFirstTip(venuesService.getVenue('topPicks', venue.id));
                    } else {
                        venuesService.getVenue(venue.category.apiName, venue.id);
                        venueService.addVenuePhotos(venuesService.getVenue(venue.category.apiName, venue.id), res.response.venue.photos);
                        venueService.addVenueTips(venuesService.getVenue(venue.category.apiName, venue.id), res.response.venue.tips);
                        getFirstPhoto(venuesService.getVenue(venue.category.apiName, venue.id));
                        getFirstTip(venuesService.getVenue(venue.category.apiName, venue.id));
                    }
                },
                function getVenueError (res) {
                });
            },

            setFirstCurrients = function () {
                $scope.currentCategory = 'topPicks';
                $scope.venuesSections[$scope.currentCategory].current = true;
                $scope.currentVenue = $scope.venuesSections[$scope.currentCategory].venues[0];
                if (!$scope.currentVenue.isComplite) {
                    getVenueDetails($scope.currentVenue);
                }
                $scope.venuesSections[$scope.currentCategory].venues[0].current = true;
                $scope.venuesSections[$scope.currentCategory].currentVenue = $scope.venuesSections[$scope.currentCategory].venues[0];
                angular.forEach($scope.venuesSections[$scope.currentCategory].venues, function(venue){
                    if (!venue.isComplete) {
                        getVenueDetails(venue);
                    }
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
                if (venue.topPick) {
                    var index = $scope.venuesSections['topPicks'].venues.indexOf(venue),
                        nextVenue = $scope.venuesSections['topPicks'].venues[index + 1];
                } else {
                    var index = $scope.venuesSections[venue.category.apiName].venues.indexOf(venue),
                        nextVenue = $scope.venuesSections[venue.category.apiName].venues[index + 1];
                }
                return nextVenue;
            },
            getPrevVenue = function (venue) {
                if (venue.topPick) {
                    var index = $scope.venuesSections['topPicks'].venues.indexOf(venue),
                        prevVenue = $scope.venuesSections['topPicks'].venues[index - 1];
                } else {
                    var index = $scope.venuesSections[venue.category.apiName].venues.indexOf(venue),
                        prevVenue = $scope.venuesSections[venue.category.apiName].venues[index - 1];
                }
                return prevVenue;
            },
            getNextCategory = function (venue) {
                if (venue.topPick) {
                    var nextCat = venue.category.apiName;
                    venuesService.changeOrder(nextCat);
                } else {
                    var nextCat = venuesService.getNextByOrder($scope.venuesSections[venue.category.apiName].order);
                }
                return nextCat;
            },
            getPrevCategory = function (venue) {
                return venue.topPick ? false : venuesService.getPrevByOrder($scope.venuesSections[venue.category.apiName].order);
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
                if (venue.topPick) {
                    return $scope.venuesSections['topPicks'].venues.indexOf(venue);
                } else {
                    return $scope.venuesSections[venue.category.apiName].venues.indexOf(venue);
                }
            },
            getVenuesCount = function (venue) {
                if (venue.topPick) {
                    return $scope.venuesSections['topPicks'].venues.length;
                } else {
                    return $scope.venuesSections[venue.category.apiName].venues.length;
                }
            };

        $scope.showNextVenue = function (venue) {
            $scope.isForward = true;
            $scope.isBack = false;
            var nextVenue = getNextVenue(venue);
            venue.current = false;
            if (nextVenue) {
                nextVenue.current = true;
                $scope.venuesSections[$scope.currentCategory].currentVenue = nextVenue;
                $scope.currentVenue = nextVenue;
            }
            if (getNextVenue(nextVenue)) {
                if (!getNextVenue(nextVenue).isComplete) {
                    getVenueDetails(getNextVenue(nextVenue));
                }
            }
        };
        $scope.showPrevVenue = function (venue) {
            $scope.isForward = false;
            $scope.isBack = true;
            var prevVenue = getPrevVenue(venue);
            venue.current = false;
            prevVenue.current = true;
            $scope.venuesSections[$scope.currentCategory].currentVenue = prevVenue;
            $scope.currentVenue = prevVenue;
        };
        $scope.showNextCategory = function (venue) {
            $scope.isDown = true;
            $scope.isUp = false;
            var nextCategory = getNextCategory(venue);
            if (nextCategory) {
                if (!$scope.venuesSections[nextCategory].currentVenue) {
                    var nextVenue = $scope.venuesSections[nextCategory].venues[0];
                } else {
                    var nextVenue = $scope.venuesSections[nextCategory].currentVenue;
                }
                $scope.venuesSections[$scope.currentCategory].current = false;
                $scope.venuesSections[nextCategory].current = true;
            }
            if (nextVenue) {
                nextVenue.current = true;
                $scope.currentVenue = nextVenue;
                if (getNextVenue(nextVenue) && !getNextVenue(nextVenue).isComplete) {
                    getVenueDetails(getNextVenue(nextVenue));
                }
                if (getNextCategory(nextVenue)) {
                    getVenueDetails($scope.venuesSections[getNextCategory(nextVenue)].venues[0]);
                }
                $scope.currentCategory = nextCategory;
            }
        };
        $scope.showPrevCategory = function (venue) {
            $scope.isDown = false;
            $scope.isUp = true;
            var prevCategory = getPrevCategory(venue);
            if (prevCategory) {
                $scope.venuesSections[$scope.currentCategory].current = false;
                $scope.venuesSections[prevCategory].current = true;
                if (!$scope.venuesSections[prevCategory].currentVenue) {
                    var prevVenue = $scope.venuesSections[prevCategory].venues[0];
                } else {
                    var prevVenue = $scope.venuesSections[prevCategory].currentVenue;
                }
                $scope.currentCategory = prevCategory;
                $scope.currentVenue = prevVenue;
            }
        };

        $scope.toggleNav = function(){
            $scope.nav.shown = !$scope.nav.shown;
            $scope.nav.button = !$scope.nav.button;
        };

        $scope.getVenueStart = function (name) {
            if ($scope.venuesSections[name] && $scope.venuesSections[name].currentVenue) {
                var currentVenue = $scope.venuesSections[name].currentVenue,
                    index = getVenueIndex(currentVenue),
                    length = getVenuesCount(currentVenue) - 1;
                if (index === 0 || index === 1) {
                    return 0;
                } else if (index === length) {
                    return length - 1;
                } else {
                    return index - 2;
                }
            } else {
                return 0;
            }
        };

        $scope.getVenueEnd = function (name) {
            if ($scope.venuesSections[name] && $scope.venuesSections[name].currentVenue) {
                var currentVenue = $scope.venuesSections[name].currentVenue,
                    index = getVenueIndex(currentVenue),
                    length = getVenuesCount(currentVenue) - 1;
                if (index === 0) {
                    return 2;
                } else if (index === length) {
                    return length + 1;
                } else if (index === length - 1) {
                    return length + 1;
                } else {
                    return index + 2;
                }
            } else {
                return 2;
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
                    if (getVenueIndex($scope.currentVenue) !== getVenuesCount($scope.currentVenue) - 1) {
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
