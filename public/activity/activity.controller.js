app.controller('activityController', activity);
app.$inject = ['$http', '$location'];

function activity($scope, $http, $location){
  var vm = this;
  var queryString = ($location.search())
  var querySearch = $http({
    method: "GET",
    url: "./activity/" + queryString.q +  "/"
  })

  querySearch.then(function(response){
    var collection = response.data;
    vm.filteredActivities = grabActivity(collection, queryString.type, queryString.n)
  })

  function grabActivity(collection, type, name){
    console.log(name)
    for(var i = 0; i<collection[type].length; i++){
      if(collection[type][i].title == name){
        console.log(collection[type][i])
        return collection[type][i]
      }
    }
  }
}
