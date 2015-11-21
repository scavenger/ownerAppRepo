// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'firebase', 'ui.router', 'ngGPlaces' /*, 'angularGeoFire' */])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function(ngGPlacesAPIProvider){
  ngGPlacesAPIProvider.setDefaults({
    placeDetailsKeys: [ 'id', 'geometry', 'reference', 'website', 'name'],
    types: ['accounting', 'bakery', 'bank', 'bar', 'cafe', 'gas_station', 'home_goods_store', 'insurance_agency', 'library', 'liquor_store', 'restaurant', 'shopping_mall']
  });
});