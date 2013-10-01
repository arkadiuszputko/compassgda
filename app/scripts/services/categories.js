angular.module('categories', []).
    factory('categoriesService', function() {

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
                }
                if (section.catName && !secName) {
                    secName = getSectionNameByCategory(section.catName);
                }
                if (section.secName && !secName) {
                    secName = getSectionNameByCategory(section.secName);
                }
                return secName || sec;
            };

        return {
            setCategories: function (cat) {
                categories = cat;
            },
            getCategoryApiName: function (sectionName) {
                if (sectionName === 'Nightlife Spot' || sectionName === 'Shop & Service') {
                    return sectionName.split(/\s/)[0].toLowerCase();
                } else if (sectionName === 'Professional & Other Places') {
                    return 'professional';
                }
                return sectionName.replace(/\s&\s+/g, '-').toLowerCase();
            },
            getSections: function () {
                var sectionsToReturn = [];
                for (sectionName in sections) {
                    sectionsToReturn.push(sectionName);
                }
                return sectionsToReturn;
            },
            getCategoriesIds: function () {
                var categoriesIds = [];
                angular.forEach(categories, function(cat){
                    if (cat.id !== '4d4b7105d754a06372d81259' && cat.id !== '4d4b7105d754a06375d81259' && cat.id !== '4e67e38e036454776db1fb3a') {
                        categoriesIds.push(cat.id);
                    }
                });
                return categoriesIds;
            },
            getSection: function (categoryId) {
                var section = false;
                angular.forEach(categories, function(sec){
                    if (categoryId === sec.id) {
                        section = {
                            name: sec.name,
                            id: sec.id,
                            sectionName: sec.name
                        }
                        return section;
                    }
                    angular.forEach(sec.categories, function(cat){
                        if (categoryId === cat.id) {
                            section = {
                                name: sec.name,
                                id: sec.id,
                                sectionName: sec.name
                            }
                            return section;
                        }
                        if (cat.categories.length) {
                            angular.forEach(cat.categories, function(subcat){
                                if (categoryId === subcat.id) {
                                    section = {
                                        name: sec.name,
                                        id: sec.id,
                                        sectionName: sec.name
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
