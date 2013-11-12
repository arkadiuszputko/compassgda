angular.module('compassgdaApp.venueApi', ['ngResource'])
    .factory('venueApi', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
    	return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/:venueId/?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET,
            {},
            {
                getOne: {
                    method: 'GET',
                    params: {
                        venueId: '@venueId',
                        v: 'date'
                    },
                    isArray: false
                }
            }
        )
    });