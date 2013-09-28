'use strict';

angular.module('compassgdaApp')
    .controller('MainCtrl', function ($scope, $rootScope, $location, foursquareService, venuesService) {
        var date = moment().format('YYYYMMDD'),
            currentOffset = 0,
            currentLimit = 10,
            currentVenueIndex = 0,
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
                    $scope.venuesSections[newSection] =  {
                        venues: venuesService.decorateVenues(res.response.groups[0].items, newSection),
                        current: false,
                        name: newSection
                    }
                    if (currentOffset === 0) {
                        $scope.venuesSections[newSection].venues[0].current = true;
                        preloadImage($scope.venuesSections[newSection].venues[1].photo.url);
                    }
                    currentOffset = currentOffset + currentLimit;
                    if (Object.keys($scope.venuesSections).length === 1) {
                        getVenues('food', 0);
                        $scope.venuesSections[newSection].current = true;
                    }
                }
            );
        }

        getVenues();

        $scope.getNextVenue = function (venues, index) {
            $scope.isBack = false;
            $scope.isForward = true;
            venues[index].current = false;
            if (venues[index + 1]) {
                venues[index + 1].current = true;
            }
            if (venues[index + 2]) {
                preloadImage(venues[index + 2].photo.url);
            }
            currentVenueIndex = index + 1;
        }

        $scope.getPrevVenue = function (venues, index) {
            $scope.isBack = true;
            $scope.isForward = false;
            venues[index].current = false;
            if (venues[index - 1]) {
                venues[index - 1].current = true;
            }
            currentVenueIndex = index - 1;
        }

        angular.element(document).bind("keyup", function(event) {
            if (event.which === 37) {
                $scope.$apply(function () {
                    $scope.getPrevVenue($scope.venuesSections[$scope.currentSection].venues, currentVenueIndex);
                });
            } else if (event.which === 39) {
                $scope.$apply(function () {
                    $scope.getNextVenue($scope.venuesSections[$scope.currentSection].venues, currentVenueIndex);
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
