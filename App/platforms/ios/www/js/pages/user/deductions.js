define(['app','hbs!js/hbs/deductions'],function(app,deductionsTemplate){
	var $$ = Dom7;
	//var firstIn  = 1;
	var pageNo = 1;
	var loading = true;
	//查询扣分选项
	var deductionPath = app.basePath + 'sysDict/findTypeByCode?code=KFLX';
	//添加扣分项
	var addPath = app.basePath + "deductMarks/saveOne";
	var userId = 0;
	var userName = "";
	//判断是否扣10分
	var subkey = 0;
	var score=0;
	//扣分原因
	var koufenyuanyin = "";
	
	/**
	 * 初始化页面
	 * @param {Object} page
	 */
	function init(page){
		initData(page.query);
		attrDefine(page);
		clickEvent(page);
		loadDeduction();
	}

	
	function getUser(userIdt,userNamet){
		userId = userIdt;
		userName = userNamet;
		$$("#recordSend").val(userName);
		$$("#hiddenSearch").val(userId);	
	}
	function loadDeduction(){
		app.ajaxLoadPageContent(deductionPath,{},function(result){
			var data = result;
			console.log(data);
			handleDeduction(data);
		})
	}
	
	function handleDeduction(data){
		$$.each(data,function(index,item){
			var select = '';
			if(index==0){
				select = 'selected';
			}
			$("#recordType").append("<option value='"+item.subKey+"'"+select+">"+item.subVal+"</option>");
		})
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
	function attrDefine(page) {

	}
	
	/**
	 * 点击事件
	 * @param {Object} page
	 */
	function clickEvent(page){
		//点击改变值
		$$("#recordType").on("change",function(){
			subkey = $$(this).val();
			
		});
		//点击返回icon
		$$('.recordNewBacks').on('click',function(){
			app.myApp.confirm('您的扣分项尚未上传，是否退出？', function() {
				app.myApp.getCurrentView().back();
			});
		});	
		//点击小房子icon
		$$('.recordNewHome').on('click',function(){
			app.myApp.confirm('您的个人荣誉尚未上传，是否返回首页？', function() {
				app.back3Home();
			});
		});
		$$(".addLeader").on("click",leaderPicker);
		//点击保存
		$$(".saveRecord").on("click",savaDed);
		
	}
	
	
	function savaDed(){
		if($$("#hiddenSearch").val() == ''){
			app.myApp.alert("请选择扣分人");
			return false;
		}
		if($$("#recordContent").val() == ''){
			app.myApp.alert("请输入扣分原因");
			return false;
		}
		subkey = $$('#recordType').val();
		if(subkey==7){
			score = -10;
		}else{
			score = -5;
		}
		app.ajaxLoadPageContent(addPath,{
			userId:$$("#hiddenSearch").val(),
			deductReason:$$("#recordContent").val(),
			score:score,
			deductType:subkey,
		},function(result){
			setTimeout(function() {
			//调用
			require(['js/pages/user/deductMarks'], function(deductMarks) {
				deductMarks.refresh();
			});
		}, 1000);
			app.myApp.getCurrentView().back();
		})
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
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}
	return {
		init: init,
		getUser:getUser,
		resetFirstIn: resetFirstIn,
	}
});
