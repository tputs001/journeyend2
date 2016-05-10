var app = angular.module('suggest', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when("/", {
    templateUrl: "home/home.view.html"
  })
  .when("/search", {
    templateUrl: "search/search.view.html",
    controller: "searchController",
    controllerAs: "search"
  })
  .when("/activity/", {
    templateUrl: "activity/activity.view.html",
    controller: "activityController",
    controllerAs: "activity"
  })
}]);

app.controller('navigationController', navigation);

function navigation(){
  var vm = this;
}
