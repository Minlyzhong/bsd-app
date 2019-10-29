define(['app',
	'hbs!js/hbs/signPeople',
	'hbs!js/hbs/signOutPeople'
], function(app, peopleTemplate, outPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	//根据userId查找该用户所缺勤的日期
	// var getAbsentPath = app.basePath + '/mobile/sign/person/statistics/';
	//根据userId查找该用户所 :0缺勤；1上班打卡;2请假;3出差  的日期
	var getTypePeoplePath = app.basePath + '/mobile/sign/person/statistics/';
	
	var signUserName;
	var signType;
	var signUserId;
	var peopleType;
	var signDate;
	var signPeopleSpecialPath;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		getSignTimeDetial();
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.signPeopleTitle').html(page.query.userName);
		signUserName = page.query.userName;
		signType = page.query.signType;
		signUserId = page.query.userId;
		peopleType = page.query.peopleType;
		console.log('peopleType')
		console.log(peopleType)
		signDate = page.query.signDate;
		// if(peopleType == 4){
		// 	signPeopleSpecialPath = getAbsentPath;
		// }else{
		// 	signPeopleSpecialPath = getTypePeoplePath;
		// }
	}
	
	/*
	 * 根据用户查询考勤详细时间
	 */
	function getSignTimeDetial(){
		app.ajaxLoadPageContent1(getTypePeoplePath+signUserId+'/'+signType,{
			// userId:signUserId,
			// // userName:signUserName,
			date:signDate,
			// type:signType,
			code:peopleType
			// code统计类型:0缺勤；1上班打卡;2请假;3出差
			// type统计周期类型：day是日统计, week是周统计, month是月统计
			// peopleType:peopleType,
		},function(data){
			console.log(data);
			var result = data.data;
			var ResultDate=[]
			$.each(result, function(index,item) {
				var ResultDate1={};
				ResultDate1.name = item.userName;
				ResultDate1.ts = item.reportTime;
				ResultDate1.place = item.address
				ResultDate.push(ResultDate1);
			});
			console.log(peopleType);
			if(peopleType != 0) {
				$$('.signPeopleList ul').html(peopleTemplate(ResultDate));
			} else {
				$$('.signPeopleList ul').html(outPeopleTemplate(ResultDate));
			}
		});
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.signPeopleContent').on('click', function() {
			var index = $$(this).parents().index();
			var data = JSON.parse(page.query.item)[index];
			console.log(data);
			app.myApp.getCurrentView().loadPage('signMap.html?item=' + JSON.stringify(data));
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