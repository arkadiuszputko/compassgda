'use strict';

angular.module('compassgdaApp', ['ngRoute', 'foursquareAPI', 'photo', 'venues'])
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
      .otherwise({
        redirectTo: '/'
      });
  });
