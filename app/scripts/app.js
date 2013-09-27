'use strict';

angular.module('compassgdaApp', ['ngRoute', 'ngAnimate', 'foursquareAPI', 'photo', 'venues'])
    .config(function ($routeProvider) {
    $routeProvider
        .when('/', {
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
