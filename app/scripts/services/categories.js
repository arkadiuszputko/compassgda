angular.module('categories', []).
    factory('categoriesService', function(photoService) {

        var categories = {};

        return {
            setCategories: function (cat) {
                categories = cat;
            },
            getSectionApiName: function (sectionName) {
                if (sectioName === 'Nightlife Spot' || sectionName = 'Shop & Service') {
                    return sectionName.split(/\s/)[0].toLowerCase();
                }
                return sectionName.replace(/\s&\s+/g, '-').toLowerCase();
            },
            getSection: function (categoryId) {
                var section = false;
                angular.forEach(categories, function(sec){
                    angular.forEach(sec.categories, function(cat){
                        if (categoryId === cat.id) {
                            section = {
                                name: sec.name,
                                id: sec.id
                            }
                            return section;
                        }
                        if (cat.categories.length) {
                            angular.forEach(cat.categories, function(subcat){
                                if (categoryId === subcat.id) {
                                    section = {
                                        name: sec.name,
                                        id: sec.id
                                    }
                                    return section;
                                }    
                            });
                        }
                    });
                });
                return section;
            }
        }
    });
