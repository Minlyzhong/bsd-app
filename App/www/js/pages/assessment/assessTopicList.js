define(['app',
	'hbs!js/hbs/assessmentList'
], function(app, assessmentListTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//部门考核项
	var loadDepartmentAssessPath = app.basePath + '/mobile/partyAm/loadDepartmentAssess';
	var deptId = 0;
	var deptName = '';
	var startDate = '';
	var endDate = '';
	var type=0;
	var khpl=0;	

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('assessment/assessTopicList', [
//			'assessment/assessTopicDetail',
//		]);
//		if(firstIn) {
	console.log(page)
		initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		startDate = pageData.startDate;
		endDate = pageData.endDate;
		
		type=pageData.type;
		khpl=pageData.khpl;
		if($$('body').find('.assessListPage')[0]) {
			deptName = pageData.name;
			deptId = pageData.deptId;
			console.log(JSON.parse(pageData.item));
			pageDataStorage['departmentEmployee'] = JSON.parse(pageData.item);
			pageDataStorage['isIndex'] = false;
			handleDepartmentEmployee(pageDataStorage['departmentEmployee'], false);
		} else {
			deptName = app.user.deptName;
			deptId = app.user.deptId;
			pageDataStorage['isIndex'] = true;
			loadDepartmentEmployee();
		}
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {
		var isIndex = pageDataStorage['isIndex'];
		handleDepartmentEmployee(pageDataStorage['departmentEmployee'], isIndex);
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		console.log(page.query)
		console.log($$('body').find('.assessListPage')[0])
		if($$('body').find('.assessListPage')[0]) {

			$$('.topicTitle').html(page.query.name + '详情');
		} else {
			if(page.query.appName){
				$$('.topicTitle').html(page.query.appName);
			}else{
				$$('.topicTitle').html(app.user.deptName + '详情');
			}
			
		}
	}
	
	/**
	 * 读取部门考核项 
	 */
	function loadDepartmentEmployee() {
		console.log(startDate)
		console.log(endDate)
		app.ajaxLoadPageContent(loadDepartmentAssessPath, {
			deptId: app.user.deptId,
			startDate:startDate,
			endDate:endDate,
			// yearly:startDate,
			type:type,
			khpl:khpl,
		}, function(result) {
			if(result.data == null){
				$$('.assessTopicList').html('<div class="noresult" style="text-align: center;">考核详情内容为空</div>')
			}else{
				var data = result.data;
				console.log(data);
				$$.each(data, function(index,item){
					if(item.point == null){
						item.point = 0; 
					}
					if(item.count == null){
						item.count = 0; 
					}
				})
				pageDataStorage['departmentEmployee'] = data;
				
				handleDepartmentEmployee(data, true);
			}
			
		});
	}
	
	/**
	 *  加载部门考核项 
	 * @param {Object} data
	 * @param {Object} isIndex 是否应用模块
	 */
	function handleDepartmentEmployee(data, isIndex) {
		$$('.assessTopicList ul').html(assessmentListTemplate(data));
		$$('.assessListContent').on('click', function() {
			var point = parseInt($$(this).data('point'));
			if(!point) {
				app.myApp.alert('此考核项已被退回,请到专项考核历史记录重新填写提交');
				return;
			}
			var topicId = $$(this).data('id');
			var name = $$(this).data('name');
			app.myApp.getCurrentView().loadPage('assessTopicDetail.html?deptName='+ deptName + '&topicId=' + topicId + '&name=' + name + '&deptId=' + deptId+'&startDate='+startDate+'&endDate='+endDate);
		});
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