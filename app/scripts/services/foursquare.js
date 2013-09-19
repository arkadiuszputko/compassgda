angular.module('foursquareAPI', ['ngResource']).
    factory('foursquareService', function($resource){
        return $resource(
            'https://api.foursquare.com/v2/venues/explore?' + 'll=:ll&client_id=:client_id&client_secret=:client_secret&venuePhotos=1&v=:v&locale=:locale',
            {},
            {
                query: {
                    method:'GET',
                    params: {
                        ll: 'll',
                        client_id: 'client_id',
                        client_secret: 'client_secret',
                        v: 'date',
                        locale: 'locale'
                    },
                isArray:false
            }
    });
});