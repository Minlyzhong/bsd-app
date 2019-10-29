define(['app'],function(app){
	var $$ = Dom7;
	var firstIn  = 1;
	var pageNo = 1;
	var loading = true;
	// 查找单个扣分项详情
	var dedmarkPath = app.basePath + 'deductMarks/showDeductMark';
	var deductId = 0;
	
	/**
	 * 初始化页面
	 * @param {Object} page
	 */
	function init(page){
		initData(page.query);
		attrDefine(page);
		clickEvent(page);
		loadDeduction();
		app.back2Home();
	}
	/**
	 * 初始化模块变量
	 * @param {Object} pageDate
	 */
	function initData(pageDate){
		
		firstIn = 0;
		deductId = pageDate.deductMarkId;
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
	function clickEvent(page){}
	
	function loadDeduction(){
		app.ajaxLoadPageContent(dedmarkPath,{
			deductMarkId:deductId,
		},function(result){
			var data = result;
			handleDeduction(data);
		})
	}
	
	function handleDeduction(data){
		console.log(data);
		$$("#recDetailTitle").val(data.data.userName);
		$$("#recType").val(data.data.deductTypeName);
		$$("#recDetailTs").val(data.data.ts);
		$$("#recDetailContent").val(data.data.deductReason);
	}
	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
	}
	return {
		init: init,
	}
});
