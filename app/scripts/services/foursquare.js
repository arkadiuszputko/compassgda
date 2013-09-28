angular.module('foursquareAPI', ['ngResource']).
    factory('foursquareService', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
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
    });
