angular.module('compassgdaApp.venuesApi', ['ngResource'])
    .factory('venuesApi', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
    	return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/search?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET,
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        v: 'date',
                        ll: 'll',
                        limit: 'limit',
                        categoryId: 'categoryId'
                    },
                    isArray: false,
                    cache: true
                }
            }
        )
    });
