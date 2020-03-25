define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var $sigdiv;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("doubleSign/doubleHandSign", function(page){
			page.view.params.swipeBackPage = true;
		});
		
		initData(page.query);
		attrDefine(page);
		//点击事件
		clickEvent();
	
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};

		var dWidth = document.getElementById('signature').style.width;
		// var dHeight = document.getElementById('signature').style.height;
		
        $sigdiv = $("#signature");
		// $sigdiv.jSignature();
		$sigdiv.jSignature({height:400,width:dWidth,lineWidth:"2",signatureLine:false});
		
		
	}
	
	/**
 	 * 读取缓存信息 
	 */
	function loadStorage() {
		
	}
	
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {

		
	}
	
	

	/**
	 * 点击事件
	 */
	function clickEvent(){
		
		
		$("#yes").on('click',returnSign);
		
        $("#reset").click(function(){
            $sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
           
        });
    
	}

	    
	function returnSign(){
		//将画布内容转换为图片
		var datapair = $sigdiv.jSignature("getData", "image");
		// var i = new Image();
		// i.src = "data:" + datapair[0] + "," + datapair[1];
		// $(i).appendTo($("#someelement")); // append the image (SVG) to DOM.
		$sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
		require(['js/pages/doubleSign/doubleSignDetail'],function(doubleSignDetail){
			doubleSignDetail.addSignBack(datapair);
		});
		app.myApp.getCurrentView().back();
	}
	

	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
		
	}
});