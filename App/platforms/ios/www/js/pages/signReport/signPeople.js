define(['app',
	'hbs!js/hbs/signPeople',
	'hbs!js/hbs/signOutPeople'
], function(app, peopleTemplate, outPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var signType = '';
	var peopleType = 0;
	var clickable;
	var signUserId;
	//根据userId查找该用户所 :0缺勤；1上班打卡;2请假;3出差  的日期
	var getTypePeoplePath = app.basePath + '/mobile/sign/register/person/statistics/';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('signReport/signPeople', [
//			'signReport/signMap',
//		]);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		console.log(page.query);

		$$('.signPeopleTitle').html(page.query.name);
		var personData = JSON.parse(page.query.item);
		console.log(personData)
		clickable = page.query.clickable
		signType = page.query.signType;
		peopleType = page.query.peopleType;
		signUserId =page.query.id;
		getSignTimeDetial();

		// var ResultDate=[];
		// 	var result = [];
		// 	result.push(personData);
		// 	$$.each(result, function(index,item) {
		// 		var ResultDate1={};
		// 		ResultDate1.name = item.userName;
		// 		ResultDate1.ts = item.reportTime;
		// 		ResultDate1.place = item.address
		// 		ResultDate.push(ResultDate1);
		// 	});
		// 	console.log(ResultDate);
		// 	console.log(clickable);
		// if(clickable == 1) {
			
		// 	$$('.signPeopleList ul').html(peopleTemplate(ResultDate));
		// } else {
			
		// 	$$('.signPeopleList ul').html(outPeopleTemplate(ResultDate));
		// }
		
	}

	/*
	 * 根据用户查询考勤详细时间
	 */
	function getSignTimeDetial(){

		app.ajaxLoadPageContent1(getTypePeoplePath+signUserId+'/'+signType,{
			// userId:signUserId,
			// // userName:signUserName,
			// date:signDate,
			// type:signType,
			code:peopleType
			// code统计类型:0缺勤；1上班打卡;2请假;3出差
			// type统计周期类型：day是日统计, week是周统计, month是月统计
			// peopleType:peopleType,
		},function(data){
			console.log(data);
			var result = data.data
			var ResultDate=[];
			$$.each(result, function(index,item) {
				var ResultDate1={};
				ResultDate1.name = item.username;
				ResultDate1.ts = item.reportTime;
				ResultDate1.place = item.address
				ResultDate1.lat = item.lat
				ResultDate1.lng = item.lng
				ResultDate.push(ResultDate1);
			});
			if(clickable == 1) {
			
				$$('.signPeopleList ul').html(peopleTemplate(ResultDate));
			} else {
				
				$$('.signPeopleList ul').html(outPeopleTemplate(ResultDate));
			}

			$$('.signPeopleContent').on('click', function() {
				var index = $$(this).parents().index();
				var data = ResultDate[index];
				console.log(data);
				app.myApp.getCurrentView().loadPage('signMap.html?item=' + JSON.stringify(data));
			});
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