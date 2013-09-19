angular.module('foursquareAPI', ['ngResource']).
    factory('foursquareService', function($resource, FOURSQUARE_API_ADDRESS, FOURSQUARE_CLIENT_ID, FOURSQUARE_CLIENT_SECRET){
        return $resource(
            FOURSQUARE_API_ADDRESS + 'venues/explore?' + 'll=:ll&client_id=' + FOURSQUARE_CLIENT_ID + '&client_secret=' + FOURSQUARE_CLIENT_SECRET + '&venuePhotos=1&v=:v&locale=:locale',
            {},
            {
                query: {
                    method:'GET',
                    params: {
                        ll: 'll',
                        v: 'date',
                        locale: 'locale'
                    },
                isArray:false
            }
    });
});