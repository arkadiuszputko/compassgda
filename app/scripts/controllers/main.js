'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, $rootScope, $location, foursquareService, foursquareCategoriesService, categoriesService, venuesService, geolocationService) {
        var date = moment().format('YYYYMMDD'),
            currentOffset = 0,
            currentLimit = 10,
            currentSectionIndex = 0,
            templates = [
                { name: 'category', url: 'views/category.html'},
                { name: 'bigPhoto', url: 'views/bigPhoto.html'},
                { name: 'smallPhoto', url: 'views/smallPhoto.html'}
            ];
        $scope.isForward = true;
        $scope.isBack = false;
        $scope.isDown = true;
        $scope.isUp = false;
        $scope.template = templates[0];
        $scope.venuesSections = {};
        $scope.currentSection = 'topPicks';
        $scope.nav = {
            shown : false,
            button : false
        };

        $scope.toggleNav = function(){
            $scope.nav.shown = !$scope.nav.shown;
            $scope.nav.button = !$scope.nav.button;
        }

        var getCategories = function () {
            foursquareCategoriesService.query({
                v: date
            },
            function success (res) {
                categoriesService.setCategories(res.response.categories)
                getVenues($scope.currentSection, 0);
            });
        }

        getCategories();

        var getVenues = function (section, offset) {
            var newSection = section;
            foursquareService.query({
                    ll: geolocationService.getPosition().ll || '52.519171,13.406091',
                    v: date,
                    locale: 'en',
                    section: section || $scope.currentSection,
                    limit: currentLimit,
                    offset: offset === 0 ? offset : offset || currentOffset
                },
                function success (res) {
                    if (res.numResults !== '0') {
                        $scope.venuesSections[newSection] =  {
                            venues: venuesService.decorateVenues(res.response.groups[0].items, newSection),
                            current: offset !== 0,
                            name: newSection,
                            currentVenueIndex: 0,
                            offset: offset + 10
                        }
                        if (offset === 0) {
                            $scope.venuesSections[newSection].venues[0].current = true;
                            preloadImage($scope.venuesSections[newSection].venues[1].photo.url);
                        }
                        if (Object.keys($scope.venuesSections).length === 1) {
                            getVenues($scope.venuesSections[newSection].venues[0].category.sectionName, 0);
                            $scope.venuesSections[newSection].current = true;
                        }
                    }
                }
            );
        }

        $scope.getNextVenue = function (sectionName, index) {
            if ($scope.venuesSections[sectionName].venues[index + 1]) {
                $scope.isBack = false;
                $scope.isForward = true;
                $scope.venuesSections[sectionName].venues[index].current = false;

                $scope.venuesSections[sectionName].venues[index + 1].current = true;

                if ($scope.venuesSections[sectionName].venues[index + 2]) {
                    preloadImage($scope.venuesSections[sectionName].venues[index + 2].photo.url);
                } else {
                    getVenues(sectionName, $scope.venuesSections[sectionName].offset);
                }
                $scope.venuesSections[sectionName].currentVenueIndex = index + 1;
            }
        }

        $scope.getPrevVenue = function (sectionName, index) {
            if ($scope.venuesSections[sectionName].venues[index - 1]) {
                $scope.isBack = true;
                $scope.isForward = false;
                $scope.venuesSections[sectionName].venues[index].current = false;

                $scope.venuesSections[sectionName].venues[index - 1].current = true;

                $scope.venuesSections[sectionName].currentVenueIndex = index - 1;
            }
        }

        angular.element(document).bind("keyup", function(event) {
            if (event.which === 37) {
                $scope.$apply(function () {
                    $scope.getPrevVenue($scope.currentSection, $scope.venuesSections[$scope.currentSection].currentVenueIndex);
                });
            } else if (event.which === 39) {
                $scope.$apply(function () {
                    $scope.getNextVenue($scope.currentSection, $scope.venuesSections[$scope.currentSection].currentVenueIndex);
                });
            } else if (event.which === 40) {
                $scope.$apply(function () {
                    $scope.getNextSection(currentSectionIndex);
                });
            } else if (event.which === 38) {
                $scope.$apply(function () {
                    $scope.getPrevSection(currentSectionIndex);
                });
            }
        });

        $scope.getNextSection = function (index) {
            if (Object.keys($scope.venuesSections)[index + 1]) {
                if (!getCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]])) {
                    setCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]].venues, 0);
                }
                if (getCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]]).id === getCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index]]).id) {
                    setCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]].venues, 1);
                }
                $scope.isDown = true;
                $scope.isUp = false;
                $scope.venuesSections[Object.keys($scope.venuesSections)[index]].current = false;
                $scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]].current = true;
                currentSectionIndex = currentSectionIndex + 1;
                $scope.currentSection = Object.keys($scope.venuesSections)[index + 1];
                getNextCategoryVenues();
            }
        }

        $scope.getPrevSection = function (index) {
            if (Object.keys($scope.venuesSections)[index - 1]) {
                if (!getCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index - 1]])) {
                    setCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index - 1]].venues, 0);
                }
                $scope.isDown = false;
                $scope.isUp = true;
                $scope.venuesSections[Object.keys($scope.venuesSections)[index]].current = false;
                $scope.venuesSections[Object.keys($scope.venuesSections)[index - 1]].current = true;
                currentSectionIndex = currentSectionIndex - 1;
                $scope.currentSection = Object.keys($scope.venuesSections)[index - 1];
            }
        }

        function preloadImage (url) {
            var img = new Image();
            img.src = url;
        }

        function getCurrentVenue (venues) {
            var currentVenue = false;
            angular.forEach(venues.venues, function(venue){
                if (venue.current) {
                    currentVenue = venue;
                }
            });

            return currentVenue;
        }

        function setCurrentVenue (venues, index) {
            if (index) {
                venues[index].current = true;
            } else {
                venues[0].current = true;
            }
        }

        function getNextCategoryVenues () {
            if (!$scope.venuesSections[$scope.venuesSections['topPicks'].venues[0].category.sectionName]) {
                getVenues($scope.venuesSections['topPicks'].venues[0].category.sectionName);
            } else if (venuesService.getNextEmptySection()) {
                getVenues(venuesService.getNextEmptySection(), 0);
            }
        }
    });
