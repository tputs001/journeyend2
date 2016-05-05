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
      url: './search/' + query
    })
    return querySearch
  }

  var budgetFilter = function(data){
    vm.filteredActivities = response.data
  }

  vm.hikes = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './hikes/' + query
    })
    querySearch.then(function(response){
    vm.filteredActivities = response.data
    })
  }

  vm.restaurant = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './restaurant/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = response.data
    })
  }

  vm.museums = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './museums/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = response.data
    })
  }

  vm.nightlife = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './nightlife/' + query
    })
    querySearch.then(function(response){
      vm.filteredActivities = response.data
    })
  }

  vm.itinerary = function(query){
    var querySearch = $http({
      method: 'GET',
      url: './itinerary/' + query
    })
    querySearch.then(function(response){
      var random = Math.floor(Math.random() * 15)
      var data = response.data
      var itineraryObject = {
        morningFood: response.data.restaurants[random],
        morningActivity: response.data.hiking[random],
        eveningFood: response.data.restaurants[random + 1],
        eveningActivity: [response.data.tours[random + 1], response.data.tours[random + 2], response.data.tours[random + 3]],
        nightFood: response.data.restaurants[random + 2],
        nightActivity: response.data.nightlife[random + 2],
      }
      vm.itinerary = itineraryObject
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
