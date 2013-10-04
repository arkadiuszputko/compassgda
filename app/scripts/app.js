'use strict';

angular.module('compassgdaApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'foursquareAPI', 'photo', 'venues', 'venue', 'categories', 'geoAPI', 'storage'])
    .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/intro.html',
            controller: 'IntroCtrl',
            reloadOnSearch:false
        })
        .when('/board', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            reloadOnSearch:false
        })
        .when('/venue/:venueId', {
            templateUrl: 'views/venue.html',
            controller: 'VenueCtrl',
            reloadOnSearch:false
        })
        .when('/search', {
            templateUrl: 'views/main.html',
            controller: 'SearchCtrl',
            reloadOnSearch:false
        })
        .when('/section/:sectionName', {
            templateUrl: 'views/section.html',
            controller: 'SectionCtrl',
            reloadOnSearch:false
        })
        .otherwise({
            redirectTo: '/'
        });
    })
    .filter('slice', function() {
        return function(arr, start, end) {
            return arr.slice(start, end);
        };
    });
