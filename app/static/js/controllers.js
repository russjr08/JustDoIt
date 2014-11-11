var myApp = angular.module('myApp', []);

myApp.controller('HomeController', function($scope, $filter) {
    $scope.items = [];

    $scope.categories = [];
    
    $scope.modifying = {};

    $scope.getColorFromItem = function(item) {
        if(item.fields.completed) {
            return 'completedcard task-' + item.fields.color;
        }
        return 'task-' + item.fields.color;

    };

    $scope.showItem = function(item) {
        document.querySelector('#modify-dialog').toggle();
        $("#modify-name").val(item.fields.name);
        $("#modify-description").val(item.fields.description);
        $("#modify-category").val(item.fields.category);
        $scope.modifying = item;
    };
    
    $scope.modifyItem = function() {
       AuthLib.checkTokens();

        $.ajax({
            url: 'api/items/modify/',
            type: 'POST',
            data: {
                username: $.cookie('auth-username'),
            token: $.cookie('auth-token'),
            pk: $scope.modifying.pk,
            name: $("#modify-name").val(),
            description: $("#modify-description").val(),
            category: $("#modify-category").val(),
            color: document.getElementById('modify-colorchoice').selected,
            },
            success: function(data) {
                console.log("Item updated successfully!");
                document.querySelector('#update-toast').show();
                $scope.refreshItems();
            }
        });
    
    };

    $scope.toggleCompleted = function(completed, element) {
        AuthLib.checkTokens();
        element.item.fields.completed = !completed;
        $.ajax({
            url: 'api/items/modify/',
            type: 'POST',
            data: {
                username: $.cookie('auth-username'),
            token: $.cookie('auth-token'),
            pk: element.item.pk,
            completed: element.item.fields.completed,
            },
            success: function(data) {
                console.log("Item updated successfully!");
                document.querySelector('#update-toast').show();
                $scope.refreshItems();
            }
        });

    };

    $scope.sort = function(category) {
        $scope.items.forEach(function(item) {
            if(category) {
                if(item.fields.category === category) {
                    item.hidden = false;
                }else {
                    item.hidden = true;
                }
            } else {
                item.hidden = false;
            }
            
        });
    };

    $scope.refreshItems = function() {
        AuthLib.checkTokens();
        $scope.categories = [];
        $.ajax({
            url: "/api/items/",
            data: {
                username: $.cookie('auth-username'),
            token: $.cookie('auth-token')
            },
            type: "POST",
            success: function(data) {
                $scope.$apply(function() {
                    var orderBy = $filter('orderBy');
                    $scope.items = data;
                    $scope.items.forEach(function(item){
                        if(item.fields.category){
                            if($scope.categories.indexOf(item.fields.category) == -1 ){
                                $scope.categories.push(item.fields.category);
                                console.log("Added category: " + item.fields.category);
                            }
                        }
                    });
                });
                window.items = data;
            },
            error: function(data) {
                if(data.responseJSON.message === "No Items found.") {
                    console.log("API claims no items were found.");
                    $scope.$apply(function() {
                        $scope.items = [];
                    });
                } else {
                    console.error("Could not successfully query the API!");
                }
            }
        });
    };

    $scope.addItem = function() {
        AuthLib.checkTokens();
        console.log("Adding item with color: " + document.getElementById('colorchoice').selected);

        $.ajax({
            url: "/api/items/add/",
            data: {
                username: $.cookie('auth-username'),
            token: $.cookie('auth-token'),
            name: $("#name").val(),
            description: $("#description").val(),
            color: document.getElementById('colorchoice').selected,
            category: $("#category").val()
            },
            type: "POST",
            success: function(data) {
                console.log("API returned success on adding Task.");
                $("#name").val("");
                $("#description").val("");
                $("#category").val("");
                $scope.refreshItems();
            },
            error: function(data) {
                if(data.responseJSON.message === "No Items found.") {
                    console.log("API claims no Tasks were found.");
                } else {
                    console.error("Could not successfully query the API!");
                    document.querySelector('#failure-toast').show();
                }
            }
        });
    };

    $scope.deleteItem = function(pk) {
        AuthLib.checkTokens();

        $.ajax({
            url: "/api/items/delete/",
            data: {
                username: $.cookie('auth-username'),
            token: $.cookie('auth-token'),
            pk: pk
            },
            type: "POST",
            success: function(data) {
                if(data.message === "Item deleted.") {
                    console.log("API claims Task deleted successfully.");
                    $scope.refreshItems();
                    document.querySelector('#removal-toast').show();
                } else {
                    alert("Error deleting Task!");
                }
            }

        });

    };

    $scope.refreshItems();

    window.$scope = $scope;

});

myApp.directive('completeCheck', function(){
    return function(scope, element, attrs){
        if(scope.item.fields.completed) {
            element.attr("checked", "true");
        }
    }
});
