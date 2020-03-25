// Initialize your app
var myApp = new Framework7({
	dynamicNavbar: true
});

// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#home');
var view2 = myApp.addView('#services');
var view3 = myApp.addView('#discuss');
var view4 = myApp.addView('#users');
var view5 = myApp.addView('#login');

//$$('.testLink').on('click',function(){
//	view1.router.loadPage('about.html');
//});

