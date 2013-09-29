angular.module('categories', []).
    factory('categoriesService', function(photoService) {

        var categories = {},
            sections = {
                'food' : ['Food'],
                'drinks': ['Nightlife Spot', 'Gastropub'],
                'coffee': ['Café', 'Restaurant'],
                'shops': ['Shop & Service'],
                'arts': ['Arts & Entertainment'],
                'outdoors': ['Outdoors & Recreation', 'Park', 'Neighborhood', 'Beach', 'Athletics & Sports', 'Harbor'],
                'sights': ['Outdoors & Recreation', 'Historic Site']
            },

            getSectionNameByCategory = function(cat) {
                var sec = false;
                for (sectionName in sections) {
                    sections[sectionName].some(function (el) {
                        if (cat === el) {
                            sec = sectionName;
                            return;
                        }
                    });
                }
                return sec;
            },

            getSectionName = function (section) {
                var sec = 'topPicks',
                    secName = false;
                if (section.subCatName) {
                    secName = getSectionNameByCategory(section.subCatName);
                } else if (section.catName) {
                    secName = getSectionNameByCategory(section.catName);
                } else if (section.secName) {
                    secName = getSectionNameByCategory(section.secName);
                }
                return secName || sec;
            };

        return {
            setCategories: function (cat) {
                categories = cat;
            },
            getSectionApiName: function (sectionName) {
                if (sectionName === 'Nightlife Spot' || sectionName === 'Shop & Service') {
                    return sectionName.split(/\s/)[0].toLowerCase();
                }
                return sectionName.replace(/\s&\s+/g, '-').toLowerCase();
            },
            getSection: function (categoryId) {
                var section = false;
                angular.forEach(categories, function(sec){
                    if (categoryId === sec.id) {
                        section = {
                            name: sec.name,
                            id: sec.id,
                            sectionName: getSectionName({secName: sec.name, catName: '', subcatName: ''})
                        }
                        return section;
                    }
                    angular.forEach(sec.categories, function(cat){
                        if (categoryId === cat.id) {
                            section = {
                                name: sec.name,
                                id: sec.id,
                                sectionName: getSectionName({secName: sec.name, catName: cat.name, subcatName: ''})
                            }
                            return section;
                        }
                        if (cat.categories.length) {
                            angular.forEach(cat.categories, function(subcat){
                                if (categoryId === subcat.id) {
                                    section = {
                                        name: sec.name,
                                        id: sec.id,
                                        sectionName: getSectionName({secName: sec.name, catName: cat.name, subcatName: subcat.name})
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
