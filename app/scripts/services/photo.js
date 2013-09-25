angular.module('photo', []).
    factory('photoService', function() {
        return {
            getImageUrl: function (photo) {
                return photo.prefix + photo.width + 'x' + photo.height + photo.suffix;
            }
        }
    });
