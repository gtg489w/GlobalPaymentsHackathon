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
		updateLocation();

		var hitLocation = function() {
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
		};

		$interval(hitLocation, 5000);
	});
});