define(function() {
	var $ = Dom7;

	/**
	 * Init router, that handle page events
	 */
    function init() {
		$(document).on('pageBeforeInit', function (e) {
			var page = e.detail.page;
			var data_page = $(page.container).data('page');
			//判断是否配置的data-page 属性
			if(data_page){
				load(page.name, page);
			}
		});
    }

	/**
	 * Load (or reload) 
	 * from js code (another controller) - call it's init function
	 * @param controllerName
	 * @param query
	 */
	function load(controllerName, page) {
		require(['js/pages/' + controllerName], function(controller) {
			controller.init(page);
		});
	}

	return {
        init: init,
		load: load
    };
});