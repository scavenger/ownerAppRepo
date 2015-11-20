angular.module('app.controllers', [])
  
.controller('authenticateCtrl', function($scope, $firebaseObject, FirebaseRef, $log) {
	function init(){
		//var ref = new Firebase("https://crackling-heat-5382.firebaseio.com");
		$scope.data = $firebaseObject(FirebaseRef.get());
		$log.info($scope.data);
	}

	init();
})
   
.controller('businessPlacesCtrl', function($scope, FirebaseRef, BusinessPlaces, $log, $ionicPopup, $ionicLoading, $geofire) {
	$scope.places = [];
	function init(){

 		$scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {

          console.log(pos);

          $scope.loading.hide();

		   BusinessPlaces.getPlaces(pos.coords.latitude, pos.coords.longitude).then(function(data){
				data.forEach(function(place){
					BusinessPlaces.getDetails(place.reference).then(function(details){
						$log.info(details);
						$scope.places.push({id: details.id, name: details.name, latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng()});
					});

				});
				$log.info($cope.places);
			});          
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });

		
	}

	$scope.showConfirm = function(place){

	   var confirmPopup = $ionicPopup.confirm({
	     title: 'Choose business',
	     template: 'Do you want to associate with ' + place.name + '?'
	   });
	   confirmPopup.then(function(res) {
	     if(res) {

			var $geo = $geofire(FirebaseRef.get("coordinates"));
		    $geo.$set(place.id, [place.latitude, place.longitude])
		        .catch(function(err) {
		            $log.error(err);
		        });

			var extraDataRef = FirebaseRef.get("owners");
			extraDataRef.child(place.id).set({name: place.name});

	       	console.log('Saved to firebase');
	     } else {
	       console.log('You are not sure');
	     }
	   });
	}

	init();
})
   
.controller('statusCtrl', function($scope) {

})
 