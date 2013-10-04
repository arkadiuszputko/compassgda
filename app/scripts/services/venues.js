angular.module('venues', []).
    factory('venuesService', function(photoService, categoriesService, geolocationService) {
        var venues = {},
            compactVenues = {};
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
            getVenue: function (category, id) {
                var retVenue = {};
                angular.forEach(compactVenues[category].venues, function(venue) {
                    if (venue.id === id) {
                        retVenue = venue;
                        return true;
                    }
                });
                return retVenue;
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

            /**
             * retrieves the most valuable information
             * from given array
             * @param  {Array} items    [array of objects]
             * @param  {String} section [name of section to save array into]
             * @param  {[Boolean} save  [indicates if array should be saved to venues, default: true]
             * @return {Array}          [array of objects]
             */
            decorateVenues: function (items, section, save) {
                save = (save === undefined) ? true : save;
                var venueCollection = [];
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
                            city: item.venue.location.city || geolocationService.getAddress(),
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
                    venueCollection.push(venue);

                });

                if (!venues[section] && save) {
                    venues[section] = venueCollection;
                }

                return venueCollection;
            },
            decorateCompactVenues: function (items, categoryId) {
                angular.forEach(items, function(item, index){
                    var catParent = categoriesService.getSection(categoryId),
                        catApiName = categoriesService.getCategoryApiName(catParent.name),
                        venue = {
                            id: item.id,
                            name: item.name,
                            tips: [],
                            template: {
                                url: getTemplateUrl(item)
                            },
                            photos: [],
                            category: {
                                id: item.categories[0].id,
                                name: item.categories[0].name,
                                categoryParentId: catParent.id,
                                categoryParentName: catParent.name,
                                apiName: catApiName
                            },
                            styling: {
                                fontStyling: getFontStyling()
                            },
                            rating: (item.rating) ? item.rating*10 + '%' : null
                        };
                    if (!compactVenues[catApiName]) {
                        compactVenues[catApiName] = {
                            venues: [],
                            name: catApiName,
                            id: catParent.id
                        };
                    }
                    compactVenues[catApiName].venues.push(venue);
                });

                return compactVenues;
            }
        }
    });
