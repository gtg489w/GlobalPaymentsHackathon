angular.module('starter.controllers', [])

.controller('SplashCtrl', function($scope) {
	
})
.controller('MainCtrl', function($scope, $cordovaTouchID) {


	










	$cordovaTouchID.checkSupport().then(function() {
		window.alert('supported!');
	}, function (error) {});

	$cordovaTouchID.authenticate("text").then(function() {
		window.alert('booya');
		// success

	}, function () {});
	
});
