app.controller('searchController', search);

app.$inject = ['$http'];

function search($http){
  var vm = this;

  vm.submit = function(query){
    var querySearch = $http({
      method: 'GET',
      url: 'http://localhost:1337/search/' + query
    })
    querySearch.then(function(response){
      console.log(response)
      vm.list = response.data
    })
  }
}
