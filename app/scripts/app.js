'use strict';

angular.module('compassgdaApp', ['ngRoute', 'ngAnimate', 'foursquareAPI', 'photo', 'venues', 'categories'])
    .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/intro.html',
            controller: 'IntroCtrl'
        })
        .when('/board', {
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        })
        .when('/venue/:venueId', {
            templateUrl: 'views/venue.html',
            controller: 'VenueCtrl'
        })
        .when('/section/:sectionName', {
            templateUrl: 'views/section.html',
            controller: 'SectionCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});
