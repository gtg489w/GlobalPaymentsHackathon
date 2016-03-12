angular.module('starter.controllers', [])

.controller('SplashCtrl', function($scope, $timeout) {
	// $timeout(function() {

	// })
	window.location = '#/main';
})
.controller('MainCtrl', function($window, $rootScope, $scope, $http, $ionicPlatform, $cordovaTouchID, $cordovaNetwork, $cordovaFileTransfer, $timeout, $interval, $cordovaGeolocation) {

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
		thumbPanel: true,
		authorizingPanel: false,
		successPanel: false,
		distance: 1000,
		devices: {},
		location: false,
		order: false,
		facialError: false
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
		$timeout(function() {
			$scope.authTouch();
		}, 2000);
	};

	$scope.facialRecognition = function() {
		$scope.state.thumbPanel = false;
		$scope.state.facialError = false;
		$scope.state.authorizingPanel = false;
		$scope.state.successPanel = false;

		// fire up the camera
		$('body').css({ opacity: 0.5 });
		$timeout(function() {
			$('body').css({ opacity: 1 });
		}, 100);
	};


	/******************************************************
		Camera
	******************************************************/
	$scope.takePicture = function() {
		cordova.plugins.camerapreview.takePicture({ maxWidth:640, maxHeight:640 });
	};

	startCamera = function() {
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

	facialError = function() {
		$scope.state.facialError = true;
		$timeout(function() {
			$scope.facialRecognition();
			$scope.state.authorizingPanel = false;
		}, 5000);
	};

	initialize = function() {
		cordova.plugins.camerapreview.setOnPictureTakenHandler(function(result){
			$scope.state.authorizingPanel = true;

			var bucket = '2015gphackathon';
			var options = {
				params: {
					'key': 'uploads/test.jpg',
					"Content-Type": "image/jpeg"
				}
            };

			$cordovaFileTransfer.upload("https://" + bucket + ".s3.amazonaws.com/", result[0], options).then(function(result) {
				$http({
					method: 'POST',
					url: 'https://fg8ekf1vhl.execute-api.us-east-1.amazonaws.com/prod/facialRecognition',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						'x-api-key': 'KCyM96hBCC9vQGpQESk7o1I8HmWoYc6f7Qrhn9SL'
					},
					data: {
						"authorize": {
							"key": "https://2015gphackathon.s3.amazonaws.com/uploads/test.jpg",
							"identity": "BRIAN"
						}
					}
				}).then(function(result) {
					if(result.statusText == 'OK') {
						$scope.state.successPanel = true;
						$http({
							method: 'POST',
							url: 'https://fg8ekf1vhl.execute-api.us-east-1.amazonaws.com/prod/facialRecognition',
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json',
								'x-api-key': 'KCyM96hBCC9vQGpQESk7o1I8HmWoYc6f7Qrhn9SL'
							},
							data: {
								"toggleLocation": "receipt"
							}
						}).then(function(result) {
							$scope.state.location = true;
						}, function(err) {});
					} else {
						facialError();
					}
					// window.alert(JSON.stringify(result));
				}, function(err) {
					facialError();
					// window.alert('fail' + JSON.stringify(err));
				});
			}, function(err) {
				//$ionicLoading.show({template : 'Upload Failed', duration: 3000});
				//window.alert('upload to s3 fail ' + JSON.stringify(err));
				facialError();
			}, function(progress) {});
		});
	};


	/******************************************************
		Location & Order Polling
	******************************************************/
	$interval(function() {
		// location poll
		$http({
			method: 'HEAD',
			url: 'https://s3.amazonaws.com/2015gphackathon/uploads/location',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(function(result) {
			$scope.state.location = true;
		}, function(err) {});

		// order poll
		$http({
			method: 'HEAD',
			url: 'https://s3.amazonaws.com/2015gphackathon/uploads/order',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(function(result) {
			$scope.state.order = true;
		}, function(err) {});
	}, 5000);


	reset = function() {
		$http({
			method: 'DELETE',
			url: 'https://s3.amazonaws.com/2015gphackathon/uploads/location',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(function(result) {
			$http({
				method: 'DELETE',
				url: 'https://s3.amazonaws.com/2015gphackathon/uploads/order',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				}
			}).then(function(result) {
				$http({
					method: 'DELETE',
					url: 'https://s3.amazonaws.com/2015gphackathon/uploads/receipt',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					}
				}).then(function(result) {
					$scope.state.hitchPanel = true;
					$scope.state.thumbPanel = true;
					$scope.state.authorizingPanel = false;
					$scope.state.location = false;
					$scope.state.order = false;
					$scope.state.facialError = false;
				}, function(err) {});
			}, function(err) {});
		}, function(err) {});
	};

	$scope.completeApp = function() {
		reset();
		$scope.state.successPanel = false;
	};

	/******************************************************
		Touch
	******************************************************/
	$scope.authTouch = function() {
		$cordovaTouchID.authenticate("Please authorize your payment with your fingerprint").then(function() {
			$scope.state.thumbPanel = false;
		}, $scope.authTouch);
	};

	/******************************************************
		Init!
	******************************************************/
	$ionicPlatform.ready(function () {
		initialize();
		startCamera();
	});
});
