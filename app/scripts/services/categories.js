angular.module('categories', []).
    factory('categoriesService', function() {

        var categories = {};

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

            setCategoryApiName = function (sectionName) {
                if (sectionName === 'Nightlife Spot' || sectionName === 'Shop & Service') {
                    return sectionName.split(/\s/)[0].toLowerCase();
                } else if (sectionName === 'Professional & Other Places') {
                    return 'professional';
                }
                return sectionName.replace(/\s&\s+/g, '-').toLowerCase();
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
                angular.forEach(categories, function(category){
                    category.apiName = setCategoryApiName(category.name);
                });
            },
            getCategoryApiName: function (name) {
                var returnName = '';
                angular.forEach(categories, function(category){
                    if (name === category.name || name === category.id) {
                        returnName = category.apiName;
                        return true;
                    }
                });
                return returnName;
            },
            getNameById: function (id) {
                var catName = false;
                angular.forEach(categories, function(category){
                    if (category.id === id) {
                        catName = category.name;
                        return true;
                    }
                });
                return catName;
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
                    categoriesIds.push(cat.id);
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
