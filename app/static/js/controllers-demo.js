myApp = angular.module('myApp', []);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

myApp.controller('HomeController', function($scope, $filter) {
  $scope.items = [];

  $scope.toggleCompleted = function(completed, element) {
    element.item.fields.completed = !completed;
    $scope.items[element.item.pk].fields.completed = !completed;
  };


  $scope.refreshItems = function() {
    $scope.items[0] = {
        "fields": {
            "name": "Hello and welcome!",
            "description": "Each individual task is represented by a 'card'.",
            "completed": false
        },
        "pk": 0
    }

    $scope.items[1] = {
        "fields": {
            "name": "This is just a demo...",
            "description": "Each card shows all the possible details of your Task in a nice format.",
            "completed": false
        },
        "pk": 1
    }


    $scope.items[2] = {
        "fields": {
            "name": "Completed cards...",
            "description": "Completed cards have a separate background from other cards so you can easily distinguish the two!",
            "completed": true
        },
        "pk": 2
    }
  };

  $scope.addItem = function() {
      $scope.items[$scope.items.length - 1] = {
          "fields": {
              "name": $("#name").val(),
              "description": $("#description").val(),
              "completed": false
          },
          "pk": $scope.items.length - 1
      }
      $("#name").val("");
      $("#description").val("");
      debugger;
  };

  $scope.deleteItem = function(pk) {
    $scope.items.remove(pk);
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

