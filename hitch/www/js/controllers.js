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
		Bluetooth
	******************************************************/
	$ionicPlatform.ready(function () {

		var type = $cordovaNetwork.getNetwork();
	    var isOnline = $cordovaNetwork.isOnline();
	    var isOffline = $cordovaNetwork.isOffline();

	    window.alert(type);
	    window.alert(isOffline);
	    window.alert(isOnline);


		//window.alert($window.ble.scan);
		
		// $window.ble.startScan([], function(device) {
		// 	$scope.$apply(function () {
		// 		$scope.state.devices[device.id] = device;
		// 	});
		// 	if(device && device.advertising && device.advertising.kCBAdvDataServiceUUIDs) {
		// 		device.advertising.kCBAdvDataServiceUUIDs.forEach(function(uuid) {
		// 			//window.alert(uuid + ' != ' + config.deviceUUID);

		// 			// window.alert(uuid.substring(uuid.length-config.deviceID.length) + "\n" + config.deviceID);

		// 			if(uuid.substring(uuid.length-config.deviceID.length) == config.deviceID) {
		// 				// window.alert(device.rssi);
		// 				$scope.$apply(function () {
		// 					$scope.state.distance = device.rssi;
		// 				});
		// 			}
		// 		});
		// 	}
		// }, function() {
		// 	window.alert('fail!');
		// });
	});


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

	$scope.initialize = function() {
		// setup picture handler callback
		cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
			document.getElementById('originalPicture').src = result[0];
		});

		$('body').css({ opacity: 0.5 });
		startCamera();
		$timeout(function() {
			$('body').css({ opacity: 1 });
		}, 100);
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
	
});
