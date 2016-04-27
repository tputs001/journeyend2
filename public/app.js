var app = angular.module('journeysend', ['ngRoute']);

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
}]);


app.controller('navigationController', navigation);

function navigation(){
  var vm = this;
}
