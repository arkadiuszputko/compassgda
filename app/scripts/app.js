'use strict';

angular.module('compassgdaApp', ['ngRoute', 'ngAnimate', 'ngSanitize', 'foursquareAPI', 'compassgdaApp.categoriesApi', 'compassgdaApp.venuesApi', 'compassgdaApp.venueApi', 'photos', 'tips', 'venues', 'venue', 'categories', 'geoAPI', 'storage'])
    .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/intro.html',
            controller: 'IntroCtrl',
            reloadOnSearch: false
        })
        .when('/board', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl',
            reloadOnSearch: false
        })
        .when('/venue/:venueId', {
            templateUrl: 'views/venue.html',
            controller: 'VenueCtrl',
            reloadOnSearch: false
        })
        .when('/:cityName/', {
            templateUrl: 'modules/city/city.html',
            controller: 'CityCtrl'
        })
        .when('/:cityName/:categoryName', {
            templateUrl: 'modules/category/category.html',
            controller: 'CategoryCtrl',
            reloadOnSearch: false
        })
        .when('/:cityName/:categoryName/:venueName', {
            templateUrl: 'modules/venue/venue.html',
            controller: 'VenueCtrl',
            reloadOnSearch: false
        })
        .when('/search', {
            templateUrl: 'views/main.html',
            controller: 'SearchCtrl',
            reloadOnSearch: false
        })
        .when('/venues/:venuesName', {
            templateUrl: 'views/venues.html',
            controller: 'VenuesCtrl',
            reloadOnSearch: false
        })
        .when('/section/:sectionName', {
            templateUrl: 'views/section.html',
            controller: 'SectionCtrl',
            reloadOnSearch: false
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
