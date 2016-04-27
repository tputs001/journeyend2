app.controller('searchController', search);

app.$inject = ['$http', '$location'];

function search($http, $location){
  var vm = this;
  var term = ($location.search())
  // console.log($location.search())

  var results = function(query){
    var querySearch = $http({
      method: 'GET',
      url: 'http://localhost:1337/search/' + query
    })
    querySearch.then(function(response){
      // console.log(response)
      vm.list = response.data
    })
  }
  results(term.q)
}
