angular.module('geoAPI', ['ngResource'])
    .factory('gmapsCityService', function($resource, GMAPS_API_ADDRESS){

        return $resource(
            GMAPS_API_ADDRESS + 'json?address=:address&language=:language&sensor=:sensor',
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        address: 'address',
                        language: 'language',
                        sensor: 'sensor'
                    },
                    isArray: false
                }
            }
        );
    })
    .factory('gmapsLatLngService', function($resource, GMAPS_API_ADDRESS){

        return $resource(
            GMAPS_API_ADDRESS + 'json?latlng=:latlng&language=:language&sensor=:sensor',
            {},
            {
                query: {
                    method: 'GET',
                    params: {
                        latlng: 'latlng',
                        language: 'language',
                        sensor: 'sensor'
                    },
                    isArray: false
                }
            }
        );
    })
    .factory('geolocationService', function(storeData) {
        var latitude = 0,
            longitude = 0,
            stringifiedParams = null,
            address = null;
        return {

            getUserPosition: function(success, error, noGeolocationCallback) {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(success, error);
                }else{
                    noGeolocationCallback();
                }
            },

            setPosition: function(lat, lng) {
                latitude = lat || 0;
                longitude = lng || 0;
                stringifiedParams = lat + ',' + lng;
                storeData.set('lat', latitude);
                storeData.set('lng', longitude);
                storeData.set('ll', stringifiedParams);
            },

            getPosition: function() {
                return {
                    lat: latitude,
                    lng: longitude,
                    ll: stringifiedParams
                };
            },

            setAddress: function(addr) {
                address = addr || '';
                storeData.set('city', address);
            },

            getAddress: function() {
                return address;
            },

            isPositionSet: function(){
                return !!(latitude && longitude && stringifiedParams && address);
            }

        }
    });