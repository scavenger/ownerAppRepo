angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('FirebaseRef', ['$firebaseObject', function($firebaseObject){
	return {
		get: function(resource){
			var baseAddress = "https://crackling-heat-5382.firebaseio.com";
			if(resource){
				baseAddress = baseAddress + '/' + resource;
			}

			return new Firebase(baseAddress);
		}
	}
}])

.factory('Auth', function($firebaseAuth, FirebaseRef) {
    var usersRef = FirebaseRef.get();
    return $firebaseAuth(usersRef);
  })

.factory('BusinessPlaces', ['ngGPlacesAPI', function(ngGPlacesAPI){
	return {
		getPlaces: function(lat, lon){
			 return ngGPlacesAPI.nearbySearch({latitude: lat, longitude: lon}).then(
    			function(data){

      				return data;
    			});
		},

		getDetails: function(reference){

				var defaults  = {
				    radius: 1000,
				    sensor: false,
				    latitude: null,
				    longitude: null,
				    types: ['food'],
				    map: null,
				    elem: null,
				    nearbySearchKeys: ['name', 'reference', 'vicinity'],
				    placeDetailsKeys: ['geometry', 'reference', 'website'],
				    nearbySearchErr: 'Unable to find nearby places',
				    placeDetailsErr: 'Unable to find place details',
				};

			  return ngGPlacesAPI.placeDetails({reference: reference, placeDetailsKeys: ['geometry', 'reference', 'website']}).then(
			    function (data) {
			      return data;
			    });
		}
	}
}])

.service('BlankService', [function(){

}]);

