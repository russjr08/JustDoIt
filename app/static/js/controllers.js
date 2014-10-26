var myApp = angular.module('myApp', []);

myApp.controller('HomeController', function($scope) {
  $scope.items = [];

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
      }
    });

  };


  $scope.refreshItems = function() {
    AuthLib.checkTokens();
    $.ajax({
      url: "/api/items/",
      data: {
        username: $.cookie('auth-username'),
        token: $.cookie('auth-token')
      },
      type: "POST",
      success: function(data) {
        $scope.$apply(function() {
          $scope.items = data;
        });
        window.items = data;
      },
      error: function(data) {
        if(data.responseJSON.message === "No Items found.") {
          console.log("API claims no items were found.");
        } else {
          console.error("Could not successfully query the API!");
        }
      }
    });
  };

  $scope.addItem = function() {
    AuthLib.checkTokens();

    $.ajax({
      url: "/api/items/add/",
      data: {
        username: $.cookie('auth-username'),
        token: $.cookie('auth-token'),
        name: $("#name").val(),
        description: $("#description").val()
      },
      type: "POST",
      success: function(data) {
        console.log("API returned success on adding Task.");
        $scope.refreshItems();
      },
      error: function(data) {
        if(data.responseJSON.message === "No Items found.") {
          console.log("API claims no Tasks were found.");
        } else {
          console.error("Could not successfully query the API!");
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
