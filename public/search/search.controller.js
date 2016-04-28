app.controller('searchController', search);

app.$inject = ['$http', '$location'];

function search($http, $location){
  var vm = this;
  var term = ($location.search())
  var results = function(query){
    var querySearch = $http({
      method: 'GET',
      url: 'http://localhost:1337/search/' + query
    })
    querySearch.then(function(response){
      // console.log(response)
      // vm.list = response.data.activities.length
      vm.activities = response.data.activities
    })
  }
  // results(term.q)
  results(term.q)
}
