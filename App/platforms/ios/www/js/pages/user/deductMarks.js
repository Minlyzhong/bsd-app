define(['app','hbs!js/hbs/deductMarks'],function(app,deductMarksTemplate){
	var $$ = Dom7;
	var firstIn  = 1;
	var pageNo = 1;
	var loading = true;
	var deductMarkId = 0;
	var userId = 0;
	var roleId = 0;
	//判断是否扣10分
	var subkey = 0;
	var score=0;
	//扣分原因
	var koufenyuanyin = "";
	// 根userId分页获取该用户有哪些扣分项列表
    var list = app.basePath + 'deductMarks/showDeductMarksByUserId';
	
	/**
	 * 初始化页面
	 * @param {Object} page
	 */
	function init(page){
		initData(page.query);
		attrDefine(page);
		clickEvent(page);
		app.back2Home();
		loadDeduction(false);
		pushAndPull(page);
		if(app.roleId == 1 || app.roleId == 4 || app.roleId == 5 || app.roleId == 6){
			$$('.saveDeduct').css('display','block');
		}
	}
	function getUser(userIdt,userNamet){
		userId = userIdt;
		userName = userNamet;
		$$("#recordSend").val(userName);
		$$("#hiddenSearch").val(userId);
		
		
	}
	function loadDeduction(isLoadMore){
		app.ajaxLoadPageContent(list,{
			userId:app.userId,
			roleId:app.roleId,
			pageNo:pageNo,
		},function(result){
			var data = result.data;
			handleDeduction(data,isLoadMore);
		});
	}
	
	function handleDeduction(data,isLoadMore){
		console.log(data);
		if(data.length>0){
			if(isLoadMore){
				$(".fsdList ul").append(deductMarksTemplate(data));
			}else{
				$(".fsdList ul").html(deductMarksTemplate(data));
			}
			loading=false;
		}else if(data.length==0 && pageNo==1){
			$(".fsdList ul").html();
			loading=true;
		}else{
			loading=true;
		}
		$$(".fsdList .item-content").on("click",function(){
			deductMarkId = $$(this).data("id");
			app.myApp.getCurrentView().loadPage("deductDetail.html?deductMarkId="+deductMarkId);
		});
	}
	
	/**
	 * 初始化模块变量
	 * @param {Object} pageDate
	 */
	function initData(pageDate){
		score=0;
		firstIn = 0;
		count = 0;
		photoBrowserPhotos = [];
		photoDatas = [];
		photoBrowserPopup = '';
		pageDataStorage = {}; 
	}
	
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {}
	
	/**
	 * 点击事件
	 * @param {Object} page
	 */
	function clickEvent(page){
		//点击改变值
		$$("#recordType").on("change",function(){
			subkey = $$(this).val();
			if(subkey==7){
				score = -10;
			}else{
				score = -5;
			}
		});
		//点击返回icon
		$$('.recordNewBack').on('click',function(){
				app.myApp.getCurrentView().back();
		});
		$$(".addLeader").on("click",leaderPicker);
		//点击保存
		$$(".saveDeduct").on("click",savaDed);
	}	
	function savaDed(){	
		app.myApp.getCurrentView().loadPage("deductions.html");
	}
	//选择人员
	function leaderPicker(){
		var buttons1 = [{
			text: '选择类型',
			label: true
		}, {
			text: '选择人员',
			bold: true,
			onClick: recordAddLeader,
		}];
		var buttons2 = [{
			text: '取消',
			color: 'red'
		}];
		var groups = [buttons1, buttons2];
		app.myApp.actions(groups);
	}
	
	//跳转选择人员
	function recordAddLeader(){
		app.myApp.getCurrentView().loadPage('deductionAddLeader.html');
	}
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新	
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				loadDeduction(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			loadDeduction(true);
		});
	}
	function refresh(){
		pageNo = 1;
		loading = true;
		//这里写请求
		loadDeduction(false);
		app.myApp.pullToRefreshDone();
	}
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		getUser:getUser,
		refresh:refresh,
		resetFirstIn: resetFirstIn,
	}
});
