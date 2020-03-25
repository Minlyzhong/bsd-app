define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//校验考试资格
	var checkSubjectPath = app.basePath + '/mobile/education/exam/check/';
	var id = 0;
	var name = '';
	var count = 0;
	var time = 0;
	var point = 0;
	var userName = '';
	
	var subjectTypeName = '';

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('exam/examDetail', [
//			'exam/examAnswer',
//			'exam/examRank',
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		id = parseInt(pageData.id);
		name = pageData.name;
		count = parseInt(pageData.count);
		time = parseInt(pageData.time);
		point = parseInt(pageData.point);
		userName = pageData.userName;
		subjectTypeName = pageData.subjectTypeName;
		ajaxLoadContent();
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		var box = $$('.examDetailBox div');
		$$(box[0]).html('试卷名称：' + name);
		//		$$(box[1]).html('出卷人员：' + userName);
		$$(box[2]).html('考试时长：' + time + '分钟');
		$$(box[3]).html('试题数量：' + count + '道');
		$$(box[4]).html('试卷总分：' + point + '分');
		$$(box[5]).html('试卷分类：' + subjectTypeName);
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.examDetailRank').on('click', function() {
			app.myApp.getCurrentView().loadPage('examRank.html?id=' + id + '&name=' + name + '&time=' + time + '&count=' + count + '&point=' + point);
		});
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent() {
		app.ajaxLoadPageContent(checkSubjectPath+id+'/'+app.userId, {
			// subjectId: id,
			// userId: app.userId
		}, function(data) {
			console.log(data);
			var checkdata=data.data
			//exmTimes 已参加考试的次数
			//remTimes 剩下多少考试次数
			$$('.remTimes').css('color','red');
			$$('.remTimes').html('剩余次数：'+checkdata.remTimes+'次');
			if(checkdata.exmTimes == 0) {
				$$('.examAnswerBtn').css('display', 'block');
				$$('.examDetailAnswer').on('click', function() {
					app.myApp.getCurrentView().loadPage('examAnswer.html?id=' + id + '&name=' + name + '&time=' +
						time + '&count=' + count + '&point=' + point + '&falseExam=0' + '&count1=' + checkdata.exmTimes);
				});
			} else if(checkdata.remTimes > 0 && checkdata.exmTimes != 0){
				$$('.reExamAnswerBtn').css('display', 'block');
				$$('.examAnswerBtn').css('display', 'none');
				$$('.reExamAnswerBtn').on('click', function() {
					app.myApp.getCurrentView().loadPage('examAnswer.html?id=' + id + '&name=' + name + '&time=' +
						time + '&count=' + count + '&point=' + point + '&falseExam=0' + '&count1=' + checkdata.exmTimes);
				});
				$$('.examFalseBtn').css('display', 'block');
				$$('.examDetailFalse').on('click', function() {
					app.myApp.getCurrentView().loadPage('examAnswer.html?id=' + id + '&name=' + name + '&time=' +
						time + '&count=' + count + '&point=' + point + '&falseExam=1' + '&count1=' + checkdata.exmTimes);
				});
			} else if(checkdata.remTimes  <= 0){
				$$('.reExamAnswerBtn').css('display', 'none');
				$$('.examAnswerBtn').css('display', 'none');
				$$('.examFalseBtn').css('display', 'block');
				$$('.examDetailFalse').on('click', function() {
					app.myApp.getCurrentView().loadPage('examAnswer.html?id=' + id + '&name=' + name + '&time=' +
						time + '&count=' + count + '&point=' + point + '&falseExam=1' + '&count1=' + checkdata.exmTimes);
				});
			}
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
		ajaxLoadContent:ajaxLoadContent,
	}
});