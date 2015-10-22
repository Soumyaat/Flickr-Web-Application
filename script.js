angular.module('myApp', [])
.provider('Flickr', function() {
  var base = 'https://api.flickr.com/services/rest',
      api_key = '';
  
  // Set our API key from the .config section
  // of our app
  this.setApiKey = function(key) {
    api_key = key || api_key;
  };
  // //api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=API_KEY&user_id=USER_ID&format=json&nojsoncallback=1


  // Service interface
  this.$get = function($http, $q) {
    var service = {
      getPublicFeed: function(page) {
        var d = $q.defer();
        $http({
          method: 'JSONP',
          url: base + '/?method=flickr.people.getPublicPhotos&format=json&per_page=10&page='+page,
          params: {
            'api_key': api_key, 
			'user_id': '24662369@N07',
            'jsoncallback': 'JSON_CALLBACK',
			'extras':  'tags,date_taken,url_q,url_n,url_c,url_l,url_o'
          }
        }).success(function(data) {
          d.resolve(data);
		  console.log(data);
        }).error(function(reason) {
          d.reject(reason);
        })
        return d.promise;
      }
	  
    };
  
    return service;
  };
})
.config(function(FlickrProvider) {
 FlickrProvider.setApiKey('6d936210a6747db3e10fd55cd8c1c3c5');
})
.controller('FlickrApiController', function($scope, Flickr) {
	$scope.page=1;
    Flickr.getPublicFeed($scope.page).then(function(data) {
		$scope.layout = 'grid';
		$scope.photos = data.photos;
    }); 

 	$scope.loadNextPage = function() {
		$scope.page = $scope.page+1;
		Flickr.getPublicFeed($scope.page).then(function(data) {
		$scope.photos.photo = data.photos.photo.concat($scope.photos.photo);
        }); 
    } 
  
 });