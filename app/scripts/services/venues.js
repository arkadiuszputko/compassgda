angular.module('venues', []).
    factory('venuesService', function(photoService, categoriesService) {

        var venues = {};
            fontStylings = [
                'stylish',
                'common',
                'fancy',
                'fashion',
                'magazine'
            ];

        var getTemplateUrl = function (item) {
            /*if (item.venue.photos.groups.length && item.venue.photos.groups[0].items[0].height > 620) {
                return 'views/bigPhoto.html';
            } else {
                return 'views/smallPhoto.html';
            }*/
            return 'views/category.html';
        }

        var getStaticMap = function(obj){
            var base = 'https://maps.googleapis.com/maps/api/staticmap?';
            if(obj.lat && obj.lng){
                return base + 'center=' + obj.lat + ',' + obj.lng + '&zoom=15&size=400x400&sensor=false';
            }else if(obj.city && obj.address){
                return base + 'center=' + encodeURIComponent(obj.city) + ',' + encodeURIComponent(obj.address) + '&zoom=15&size=400x400&sensor=false'
            }else{
                return null;
            }
        }

        var getFontStyling = function(){
            var stylesLength = fontStylings.length - 1,
                index = parseInt(stylesLength * Math.random(), 10);

            return fontStylings[index];
        }

        return {
            getVenues: function () {
                return venues;
            },
            getNextEmptySection: function () {
                var sections = categoriesService.getSections(),
                    sectionName = false;
                angular.forEach(sections, function(section){
                    if (!venues[section] || !venues[section].length) {
                        sectionName = section;
                        return sectionName;
                    }
                });
                return sectionName;
            },
            decorateVenues: function (items, section) {
                if (!venues[section]) {
                    venues[section] = [];
                }
                angular.forEach(items, function(item, index){
                    var venue = {
                        id: item.venue.id,
                        name: item.venue.name,
                        photo: {
                            url: item.venue.photos.groups.length ? photoService.getImageUrl(item.venue.photos.groups[0].items[0]) : '',
                            width: item.venue.photos.groups.length ? item.venue.photos.groups[0].items[0].width : 0,
                            height: item.venue.photos.groups.length ? item.venue.photos.groups[0].items[0].height : 0
                        },
                        tip: {
                            userId: item.tips ? item.tips[0].user.id : '',
                            text: item.tips ? item.tips[0].text : 'Sorry this venue doesn\'t have any tip but We are sure that this is a great place'
                        },
                        template: {
                            url: getTemplateUrl(item)
                        },
                        category: {
                            id: item.venue.categories[0].id,
                            name: item.venue.categories[0].name,
                            categoryParentId: categoriesService.getSection(item.venue.categories[0].id).id,
                            categoryParentName: categoriesService.getSection(item.venue.categories[0].id).name,
                            sectionName: categoriesService.getSection(item.venue.categories[0].id).sectionName
                        },
                        location: {
                            url: getStaticMap(item.venue.location),
                            address: item.venue.location.address,
                            city: item.venue.location.city,
                            postalCode: item.venue.location.postalCode
                        },
                        styling: {
                            fontStyling: getFontStyling()
                        },
                        rating: {
                            value : item.venue.rating || null,
                            percentage: (item.venue.rating) ? item.venue.rating * 10 + '%' : null
                        }
                    };
                    venues[section].push(venue);
                });

                return venues[section];
            },
        }
    });
