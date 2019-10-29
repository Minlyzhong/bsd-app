define(['app',
	'hbs!js/hbs/dedPeople',
], function(app, dedPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	var content = "";
	var userId = 0;
	var userName = "";
	//加载人员
	var peoperPath = app.basePath + "deductMarks/getUserList";

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		clickEvent(page);
		loadPeople(false);
		pushAndPull(page);
	}
	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
	}
	function loadPeople(isLoadMore){
		app.ajaxLoadPageContent(peoperPath,{
			pageNo:pageNo,
			userId:app.userId,
			roleId:app.roleId,
			deptId:app.user.deptId,
		},function(result){
			console.log(result);
			var data = result.rows;
			if(data.length > 0){
				if(isLoadMore){
					$$(".deductionsList").find("ul").append(dedPeopleTemplate(data));
				}else{
					$$(".deductionsList").find("ul").html(dedPeopleTemplate(data));
				}
				loading=false;
			}else if(data.length == 0 && pageNo==1){
				$$(".deductionsList").find("ul").html("");
				loading=true;
			}else{
				loading=true;
			}
			$$(".deductionsList .item-content").on("click",detailQuery);
		});
	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {	
		$$('#payPeopleSearch').on('focus', showSearchList);
		$$(".paySearch").css("display","block");	
		$$(".searchCancelBtn").on('click',function(){
			$$(this).css('text-align', 'center');
			$$(".searchCancelBtn").css('display','none');
			$$(".deductions").css('display','block');
			$$(".deductionsSearch").css('display','none');
		});
	}
	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$(this).css('text-align', 'left');
		$$(".searchCancelBtn").css('display','block');
		$$(".deductions").css('display','none');
		$$(".deductionsSearch").css('display','block');
		$$("#payPeopleSearch").on("keyup",function(){
			keyupContent(false);
		});
	}
	function keyupContent(isLoadMore){
		app.ajaxLoadPageContent(peoperPath,{
			pageNo:pageNo1,
			query:$$("#payPeopleSearch").val(),
			userId:app.userId,
			roleId:app.roleId,
			deptId:app.user.deptId,
		},function(result){
			var data = result.rows;
			if(data.length > 0){
				if(isLoadMore){
					$$(".deductionsSearchList").find("ul").append(dedPeopleTemplate(data));
				}else{
					$$(".deductionsSearchList").find("ul").html(dedPeopleTemplate(data));
				}
				loading1=false;
			}else if(data.length == 0 && pageNo1==1){
				$$(".deductionsSearchList").find("ul").html("");
				loading1=true;
			}else{
				loading1=true;
			}
			$$(".deductionsSearchList .item-content").on("click",detailQuery);
		});
	}
	function detailQuery(){
		userId = parseInt($$(this).data("userId"));
		userName = $$(this).data("userName");
		setTimeout(function() {
			//调用
			require(['js/pages/user/deductions'], function(deduction) {
				deduction.getUser(userId,userName);
			});
		}, 1000);
		app.myApp.getCurrentView().back();
	}
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
		var ptrContent = $$(page.container).find('.pull-to-refresh-content.deductions');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				loadPeople(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//下拉刷新(刷新)
		var ptrContent1 = $$(page.container).find('.pull-to-refresh-content.deductionsSearch');
		ptrContent1.on('refresh', function(e) {
			setTimeout(function() {
				pageNo1 = 1;
				loading1 = true;
				//这里写请求
				keyupContent(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll.deductions');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			loadPeople(true);
		});
		//滚动加载(刷新)
		var loadMoreContent1 = $$(page.container).find('.infinite-scroll.deductionsSearch');
		loadMoreContent1.on('infinite', function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			keyupContent(true);
		});
		console.log(ptrContent);
		console.log(ptrContent1);
		console.log(loadMoreContent);
		console.log(loadMoreContent1);
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