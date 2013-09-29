'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, $rootScope, $location, foursquareService, foursquareCategoriesService, categoriesService, venuesService) {
        var date = moment().format('YYYYMMDD'),
            currentOffset = 0,
            currentLimit = 50,
            currentSectionIndex = 0,
            templates = [
                { name: 'bigPhoto', url: 'views/bigPhoto.html'},
                { name: 'smallPhoto', url: 'views/smallPhoto.html'}
            ];
        $scope.isForward = true;
        $scope.isBack = false;
        $scope.template = templates[0];
        $scope.venuesSections = {};
        $scope.currentSection = 'topPicks';

        var getCategories = function () {
            foursquareCategoriesService.query({
                v: date
            },
            function success (res) {
                categoriesService.setCategories(res.response.categories)
                getVenues();
            });
        }

        getCategories();

        var getVenues = function (section, offset) {
            var newSection = section || $scope.currentSection;
            foursquareService.query({
                    ll: '54.3520252,18.6466384',
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
                            current: false,
                            name: newSection,
                            currentVenueIndex: 0
                        }
                        if (currentOffset === 0) {
                            $scope.venuesSections[newSection].venues[0].current = true;
                            preloadImage($scope.venuesSections[newSection].venues[1].photo.url);
                        }
                        currentOffset = currentOffset + currentLimit;
                        if (Object.keys($scope.venuesSections).length === 1) {
                            getVenues(categoriesService.getSectionApiName($scope.venuesSections[newSection].venues[0].category.sectionName), 0);
                            $scope.venuesSections[newSection].current = true;
                        }
                    }
                }
            );
        }

        $scope.getNextVenue = function (sectionName, index) {
            $scope.isBack = false;
            $scope.isForward = true;
            $scope.venuesSections[sectionName].venues[index].current = false;
            if ($scope.venuesSections[sectionName].venues[index + 1]) {
                $scope.venuesSections[sectionName].venues[index + 1].current = true;
            }
            if ($scope.venuesSections[sectionName].venues[index + 2]) {
                preloadImage($scope.venuesSections[sectionName].venues[index + 2].photo.url);
            }
            $scope.venuesSections[sectionName].currentVenueIndex = index + 1;
        }

        $scope.getPrevVenue = function (sectionName, index) {
            $scope.isBack = true;
            $scope.isForward = false;
            $scope.venuesSections[sectionName].venues[index].current = false;
            if ($scope.venuesSections[sectionName].venues[index - 1]) {
                $scope.venuesSections[sectionName].venues[index - 1].current = true;
            }
            $scope.venuesSections[sectionName].currentVenueIndex = index - 1;
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
            if (!getCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]])) {
                setCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]].venues, 0);
            }
            $scope.venuesSections[Object.keys($scope.venuesSections)[index]].current = false;
            $scope.venuesSections[Object.keys($scope.venuesSections)[index + 1]].current = true;
            currentSectionIndex = currentSectionIndex + 1;
            $scope.currentSection = Object.keys($scope.venuesSections)[index + 1];
        }

        $scope.getPrevSection = function (index) {
            if (!getCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index - 1]])) {
                setCurrentVenue($scope.venuesSections[Object.keys($scope.venuesSections)[index - 1]].venues, 0);
            }
            $scope.venuesSections[Object.keys($scope.venuesSections)[index]].current = false;
            $scope.venuesSections[Object.keys($scope.venuesSections)[index - 1]].current = true;
            currentSectionIndex = currentSectionIndex - 1;
            $scope.currentSection = Object.keys($scope.venuesSections)[index - 1];
        }

        function preloadImage (url) {
            var img = new Image();
            img.src = url;
        }

        function getCurrentVenue (venues) {
            var currentVenue = false;
            angular.forEach(venues, function(venue){
                if (venue.current) {
                    curentVenue = venue;
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
    });
