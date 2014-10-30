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
            "name": "Test Item #0",
            "description": "I am a test card!",
            "completed": false
        },
        "pk": 0
    }

    $scope.items[1] = {
        "fields": {
            "name": "Test Item #1",
            "description": "I am a test card!",
            "completed": false
        },
        "pk": 1
    }


    $scope.items[2] = {
        "fields": {
            "name": "Test Item #2",
            "description": "I am a test card!",
            "completed": false
        },
        "pk": 2
    }

    $scope.items[3] = {
        "fields": {
            "name": "Test Item #3",
            "description": "I am a test card!",
            "completed": false
        },
        "pk": 3
    }

    $scope.items[4] = {
        "fields": {
            "name": "Test Item #4",
            "description": "I am a test card!",
            "completed": false
        },
        "pk": 4
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

