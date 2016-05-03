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
      vm.filteredActivities = budgetFilter(queryString.b, response.data.tours)
    })
  }

  var getResults = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './search/' + query
    })
    return querySearch
  }

  var budgetFilter = function(budget, data){
    var budgetData = []
    for(var i = 0; i<data.length; i++){
      if(data[i].price < budget || data[i].price == 'Not Available'){
        budgetData.push(data[i])
      }
    }
    return budgetData;
  }


  vm.hikes = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './hikes/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = budgetFilter(queryString.b, response.data)
    })
  }

  vm.restaurant = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './restaurant/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = budgetFilter(queryString.b, response.data)
    })
  }

  vm.museums = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './museums/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = budgetFilter(queryString.b, response.data)
    })
  }

  vm.nightlife = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './nightlife/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = budgetFilter(queryString.b, response.data)
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
