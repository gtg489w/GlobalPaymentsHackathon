angular.module('starter.controllers', [])
.controller('MainCtrl', function($scope, $cordovaTouchID) {




	$cordovaTouchID.checkSupport().then(function() {
		window.alert('supported!');
		// success, TouchID supported
	}, function (error) {
		window.alert(error); // TouchID not supported
	});

	$cordovaTouchID.authenticate("text").then(function() {
		window.alert('booya');
		// success
	}, function () {
		// error
		window.alert('error');
	});
	
});
