angular.module('starter.controllers', [])

.controller('SplashCtrl', function($scope, $timeout) {
	// $timeout(function() {

	// })
	window.location = '#/main';
})
.controller('MainCtrl', function($window, $rootScope, $scope, $ionicPlatform, $cordovaTouchID, $cordovaNetwork, $timeout, $interval, $cordovaGeolocation) {

	/******************************************************
		Config
	******************************************************/
	var config = {
		cameraPreview: {
			camera: 'front',
			x: 0,
			y: 0,
			// width: 740,
			// height: 1200
			width: 1080,
			height: 768
		},
		deviceUUID: '960C4A97-244C-11E2-B299-00A0C60077AD',
		deviceID: '00A0C60077AD'
	};
	$scope.state = {
		hitchPanel: true,
		distance: 1000,
		devices: {}
	};

	/******************************************************
		GPS
	******************************************************/

	// move this to the mobile app

	// var watchOptions = {
	// 	timeout : 3000,
	// 	enableHighAccuracy: false
	// };

	// var watch = $cordovaGeolocation.watchPosition(watchOptions);
	// watch.then(
	// 	null,
	// 	function(err) {
	// 		// error
	// 	},
	// 	function(position) {
	// 		var lat  = position.coords.latitude;
	// 		var lng = position.coords.longitude;
	// 		window.alert(lat + ', ' + lng);
	// 	});


	/******************************************************
		Scope actions
	******************************************************/
	$scope.checkout = function() {
		$scope.state.hitchPanel = false;

		// fire up the camera
		$('body').css({ opacity: 0.5 });
		startCamera();
		$timeout(function() {
			$('body').css({ opacity: 1 });
		}, 100);
	};


	/******************************************************
		Camera
	******************************************************/
	$scope.takePicture = function() {
		cordova.plugins.camerapreview.takePicture({maxWidth:640, maxHeight:640});
	};

	startCamera = function() {
		$scope.state.hitchPanel = false;
		var tapEnabled = true;
		var dragEnabled = true;
		var toBack = true;
		cordova.plugins.camerapreview.startCamera({
			x: config.cameraPreview.x,
			y: config.cameraPreview.y,
			width: config.cameraPreview.width,
			height: config.cameraPreview.height
		}, config.cameraPreview.camera, tapEnabled, dragEnabled, toBack);
	};

	initialize = function() {
		// setup picture handler callback
		cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
			document.getElementById('originalPicture').src = result[0];
		});
	};

	/******************************************************
		Touch
	******************************************************/
	$scope.authTouch = function() {
		$cordovaTouchID.checkSupport().then(function() {
			window.alert('supported!');
		}, function (error) {});

		$cordovaTouchID.authenticate("text").then(function() {
			window.alert('booya');
			// success
		}, function () {});
	};

	/******************************************************
		Init!
	******************************************************/
	$ionicPlatform.ready(function () {
		initialize();
	});
});
