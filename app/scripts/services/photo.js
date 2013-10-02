angular.module('photo', []).
    factory('photoService', function() {
        return {
            getImageUrl: function (photo, scaled) {
                var size = scaled ? photo.width + 'x' + photo.height : 'original';
                return photo.prefix + size + photo.suffix;
            }
        }
    });
