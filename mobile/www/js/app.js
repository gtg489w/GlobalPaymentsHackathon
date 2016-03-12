// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'ngCordova'])

.run(function($ionicPlatform, $cordovaGeolocation, $http, $interval) {
	$ionicPlatform.ready(function() {
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if(window.StatusBar) {
			StatusBar.styleDefault();
		}
		var updateLocation = function() {
			$http({
				method: 'POST',
				url: 'https://fg8ekf1vhl.execute-api.us-east-1.amazonaws.com/prod/facialRecognition',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'x-api-key': 'KCyM96hBCC9vQGpQESk7o1I8HmWoYc6f7Qrhn9SL'
				},
				data: {
					"toggleLocation": "location"
				}
			}).then(function(result) {}, function(err) {});
		};

		$interval(function() {
			$http({
				method: 'HEAD',
				url: 'https://s3.amazonaws.com/2015gphackathon/uploads/receipt',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then(function(result) {
				$('#receipt').fadeIn();
			}, function(err) {});
		}, 5000);

		var watchOptions = {
			timeout : 8000,
			enableHighAccuracy: false
		};

		var watch = $cordovaGeolocation.watchPosition(watchOptions);
		watch.then(null, function(err) {
			// error
			//window.alert(JSON.stringify(err));
		}, function(position) {
			var lat  = position.coords.latitude;
			var lng = position.coords.longitude;
			// window.alert(lat + ', ' + lng);

			$http({
				method: 'HEAD',
				url: 'https://s3.amazonaws.com/2015gphackathon/uploads/location',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then(function(result) {
				// window.alert(JSON.stringify(result));
			}, function(err) {
				updateLocation();
			});
		});
	});
});