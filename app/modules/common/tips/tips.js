angular.module('tips', []).
    factory('tipsService', function() {
        return {
        	decorateTips: function (data) {
        		var tips = {
                        count: 0,
                        list: []
                    };
                angular.forEach(data.groups, function(group){
                    angular.forEach(group.items, function(item){
                        var tip = {
                            id: item.id,
                            likes: item.likes.count,
                            photoUrl: item.photoUrl,
                            text: item.text,
                            userId: item.user.id
                        }
                        tips.list.push(tip);
                        tips.count++;
                    });
                });
                return tips;
        	}
        }
    });
