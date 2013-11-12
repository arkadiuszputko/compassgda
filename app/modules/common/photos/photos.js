angular.module('photos', []).
    factory('photosService', function() {
        var getImageUrl = function (photo, scaled) {
            var size = scaled ? photo.width + 'x' + photo.height : 'original';
            return photo.prefix + size + photo.suffix;
        };
        return {
            decoratePhotos: function (data) {
                var photos = {
                        count: 0,
                        list: []
                    };
                angular.forEach(data.groups, function(group){
                    angular.forEach(group.items, function(item){
                        var photo = {
                            id: item.id,
                            url: getImageUrl(item),
                            width: item.width,
                            height: item.height
                        }
                        photos.list.push(photo);
                        photos.count++;
                    });
                });
                return photos;
            }
        }
    });
