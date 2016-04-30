app.controller('searchController', search);
app.$inject = ['$http', '$location'];

function search($scope, $http, $location){
  var vm = this;
  var queryString = ($location.search())
  $scope.query = queryString.q
  vm.filteredActivities;

  var allResults = function(query){
    var allSearch = getResults(query)
    allSearch.then(function(response){
      vm.filteredActivities = response.data.tours
    })
  }

  var getResults = function(query){
    var querySearch = $http({
      method: 'GET',
      url: 'http://localhost:1337/search/' + query
    })
    return querySearch
  }


  vm.hikes = function(query){
    var querySearch = $http({
      method: 'GET',
      url: 'http://localhost:1337/hikes/' + query
    })

    querySearch.then(function(response){
      console.log(response)
      vm.filteredActivities = response.data
    })
  }

  vm.filter = function(query, amt){
    var filtered = getResults(query)
    filtered.then(function(response){
      var filterData = response.data.activities
      var filteredArray = [];
      for(var i = 0; i < filterData.length; i++){
        if(filterData[i].price !== undefined && filterData[i].price < amt){
          filteredArray.push(filterData[i])
        }
      }
      vm.filteredActivities = _.sortBy(filteredArray, 'price')
    })
  }

  allResults(queryString.q)
}
