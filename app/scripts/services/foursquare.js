angular.module('foursquareAPI', ['ngResource'])
    .factory('foursquareService', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
        return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/explore?' + 'll=:ll&client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&venuePhotos=1&v=:v&locale=:locale&limit=:limit&section=:section&offset=:offset',
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        ll: 'll',
                        v: 'date',
                        locale: 'locale',
                        limit: 'limit',
                        section: 'section',
                        offset: 'offset'
                    },
                    isArray: false
                }
            }
        );
    })
    .factory('foursquareServiceVenuePhotos', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
        return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/:venue_id/photos?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&venuePhotos=1&v=:v&limit=:limit&offset=:offset',
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        venue_id: '@venue_id',
                        v: 'date',
                        limit: 'limit',
                        offset: 'offset'
                    },
                    isArray: false
                }
            }
        )
    })
    .factory('foursquareCategoriesService', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
        return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/categories?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&v=:v',
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        v: 'date',
                    },
                    isArray: false
                }
            }
        )
    })
    .factory('foursquareVenuesSearch', function ($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
        return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/search?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&v=:v&categoryId=:categoryId&ll=:ll&limit=:limit',
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        v: 'date',
                        categoryId: 'categoryId',
                        ll: 'll',
                        limit: 'limit'
                    },
                    isArray: false
                }
            }
        )
    })
    .factory('foursquareVenueGet', function ($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
        return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/:venue_id?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET,
            {},
            {
                getOne: {
                    method: 'GET',
                    params: {
                        venue_id: '@venue_id'
                    },
                    isArray: false
                }
            }
        )
    });
