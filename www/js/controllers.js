angular.module('app.controllers', [])
  
.controller('authenticateCtrl', function($scope, $firebaseObject, FirebaseRef, $log, $timeout, Auth, $state, $ionicLoading) {

	$scope.login = function(authMethod) {

		$ionicLoading.show({
          content: 'Authenticating...',
          showBackdrop: true
        });

	    Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
	    	console.log('got here...');
	    }).catch(function(error) {
	      if (error.code === 'TRANSPORT_UNAVAILABLE') {
	        Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
	        });
	      } else {
	        console.log(error);
	      }

	     $ionicLoading.hide();
	    });
	 };

	function checkIfUserExists(userId, userExistsCallback) {
	  	var usersRef = new FirebaseRef.get("enrolled_owners");
		usersRef.once('value', function(snapshot) {
		  if (snapshot.hasChild(userId)) {
		    userExistsCallback(userId, true);
		  }
		  else{
		    userExistsCallback(userId, false);		  	
		  }
		});
	}	 

	$timeout(function(){
		Auth.$onAuth(function(authData) {
		$ionicLoading.hide();

		    if (authData === null) {
		      console.log('Not logged in yet');
		    } else {
		      console.log('Logged in as', authData.uid);
		      console.log(authData);

		      // search if is already enrolled user or not65
				checkIfUserExists(authData.uid, function(uid, exists){
					var usersRef = new FirebaseRef.get("enrolled_owners/" + uid);					
					if(exists){
						console.log('EXISTS!');

						usersRef.once("value", function(snapshot) {
						  	var data = snapshot.val();
						  	console.log(data); 

							var extraDataRef = FirebaseRef.get("owners/" + data.placeId);
							extraDataRef.once("value", function(snap){
								var d = snap.val();
								$state.go('status', {id: data.placeId, active: d.active, maxamount: d.maxAmount});
							}); 
						});

					}else{
						console.log('NOT');

						$state.go('businessPlaces', {id: authData.uid, name: authData.google.displayName});	 				
					}
				});

     
		    }
		    // This will display the user's name in our view
		    $scope.authData = authData;
		  });	 
	}, 100);

	function init(){
		//var ref = new Firebase("https://crackling-heat-5382.firebaseio.com");
		var ref = FirebaseRef.get();

		// ref.authWithOAuthRedirect("google", function(error, authData) {
		// 		  if (error) {
		// 		    console.log("Login Failed!", error);
		// 		  } else {
		// 		    console.log("Authenticated successfully with payload:", authData);
		// 		  }
		// 	});

		// $scope.data = $firebaseObject(ref);
		// $log.info($scope.data);

	}

	init();
})
   
.controller('businessPlacesCtrl', function($scope, FirebaseRef, BusinessPlaces, $log, $ionicPopup, $ionicLoading, $geofire, $stateParams) {
	$scope.places = [];
	function init(){

 		$ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {

          console.log(pos);

          $ionicLoading.hide();

		   BusinessPlaces.getPlaces(pos.coords.latitude, pos.coords.longitude).then(function(data){
				data.forEach(function(place){
					BusinessPlaces.getDetails(place.reference).then(function(details){
						$log.info(details);


						$scope.places.push({id: details.id, name: details.name, latitude: details.geometry.location.lat(), longitude: details.geometry.location.lng()});
					});

				});
				$log.info($scope.places);
			});          
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });

		/// 
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
			extraDataRef.child(place.id).set({name: place.name, active: true, maxamount: 200});

			var usersRef = new FirebaseRef.get("enrolled_owners");	

			var userId = $stateParams.id;
			var userName = $stateParams.name
			usersRef.child(userId).set({placeId: place.id});	
	       	console.log('Saved to firebase');

	       	$state.go('status', {id: place.id, active: true, maxamount: 200});

	     } else {
	       console.log('You are not sure');
	     }
	   });
	}

	init();
})
   
.controller('statusCtrl', function($scope, $stateParams, FirebaseRef, $ionicPopup) {
	$scope.maxAmount = $stateParams.maxamount;
	$scope.active = JSON.parse($stateParams.active);

	$scope.onSave = function(){
		var placeId = $stateParams.id;

		var existingRef = FirebaseRef.get("owners/" + placeId);
		existingRef.once("value", function(snap){
			var d = snap.val();

			var extraDataRef = FirebaseRef.get("owners");
			extraDataRef.child(placeId).set({name: d.name, active: $scope.active, maxAmount: $scope.maxAmount});

			var alertPopup = $ionicPopup.alert({
			     title: 'Save',
			     template: 'Options saved!'
			   });
			   alertPopup.then(function(res) {
			     console.log('Options saved...');
			   });

		}); 
		
	};
})
 