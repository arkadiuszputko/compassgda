angular.module('categories', []).
    factory('categoriesService', function() {

        var categories = [],

            setCategoryAppName = function (shortName) {
                return getSlug(shortName);
            };

        return {
            setCategories: function (cat) {
                angular.forEach(cat, function(category){
                    category.appName = setCategoryAppName(category.shortName);
                    if (category.categories.length) {
                        angular.forEach(category.categories, function(subCategory){
                            subCategory.appName = setCategoryAppName(subCategory.shortName);
                            if (subCategory.categories.length) {
                                angular.forEach(subCategory.categories, function(subSubCategory){
                                    subSubCategory.appName = setCategoryAppName(subSubCategory.shortName);
                                });
                            }
                        });
                    }
                });
                categories = cat;
            },
            getCategories: function () {
                return categories;
            },
            getCategoryById: function (id) {
                var cat = {};
                angular.forEach(categories, function(category){
                    if (category.id === id) {
                        cat = category;
                        return;
                    }
                });
                return cat;
            },
            getIdByAppName: function (appName) {
                var cat = {};
                angular.forEach(categories, function(category){
                    if (category.appName === appName) {
                        cat = category;
                        return;
                    }
                });
                return cat.id;
            },
            getAppNameByName: function (shortName) {
                return setCategoryAppName(shortName);
            }
        }
    });
