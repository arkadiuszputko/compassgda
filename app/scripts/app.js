'use strict';

angular.module('compassgdaApp', ['ngRoute', 'foursquareAPI', 'venues'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
