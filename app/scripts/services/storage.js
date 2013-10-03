angular.module('storage', [])
    .factory('storeData', function() {
        var localStorageAvailable;

        function supportsLocalStorage(){
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        }

        localStorageAvailable = supportsLocalStorage();

        return {

            set: function(key, value){
                if(localStorageAvailable)
                    localStorage.setItem(key, value);
            },

            get: function(key){
                if(localStorageAvailable)
                    return localStorage.getItem(key);
            },

            remove: function(val){
                if(localStorageAvailable){
                    if(val instanceof Array) {
                        val.forEach(function(el){
                            localStorage.removeItem(el);
                        });
                    }else{
                        localStorage.removeItem(val);
                    }
                }
            },

            clear: function(){
                if(localStorageAvailable) localStorage.clear();
            },

            exists: function(key) {
                if(localStorageAvailable)
                    return !!localStorage.getItem(key);
            }

        }
    });
