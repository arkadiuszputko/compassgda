angular.module('compassgdaApp.categoriesApi', ['ngResource'])
    .factory('categoriesApi', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
    	return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/categories?client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET,
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        v: 'date',
                    },
                    isArray: false,
                    cache: true
                }
            }
        )
    });
