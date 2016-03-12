angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services'])
.run(function($ionicPlatform, $cordovaStatusbar) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);
		}
		if (window.StatusBar) {
			StatusBar.styleDefault();
		}

		$cordovaStatusbar.hide();
	});
})
.config(function($stateProvider, $urlRouterProvider) {
	$stateProvider.state('splash', {
		url: '/splash',
		templateUrl: 'templates/splash.html',
		controller: 'SplashCtrl'
	})
	.state('main', {
		url: '/main',
		templateUrl: 'templates/main.html',
		controller: 'MainCtrl'
	});
	$urlRouterProvider.otherwise('/main');
});
