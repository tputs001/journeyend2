app.controller('searchController', search);

app.$inject = ['$http', '$location'];

function search($scope, $http, $location){
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
       $scope.currentPage = 1;
       $scope.numPerPage = 10;
       $scope.$watch('currentPage', function() {
         var begin = (($scope.currentPage - 1) * $scope.numPerPage)
         , end = begin + $scope.numPerPage;
       vm.filteredActivities = vm.activities.slice(begin, end);
      })
    })
  }
  // results(term.q)
  results(term.q)
}
