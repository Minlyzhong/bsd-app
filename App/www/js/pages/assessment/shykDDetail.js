define(['app',
	'hbs!js/hbs/threeMeetingAndOneClassDetail'
], function(app,tMAOCDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	//获取三会一课个人得分明细
	var findDetailByTopicIdPath = app.basePath + '/mobile/partyAm/findByTopicIdAndDeptId';
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	var queryData = '';
	var title = '';
	var topicId = 0;
	var deptId = 0;
	
	var year;
	var month;
	//传进来的时间
	var DDetailStartTime = '';
	var DDetailEndTime = '';
	//搜索时间
	var DDetailSearchStartTime = '';
	var DDetailSearchEndTime = '';
	var query;
	var searchTime;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		pushAndPull(page);
		//点击事件
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
		pageNo1 = 1;
		loading1 = true;
		queryData = '';
		DDetailStartTime=pageData.startDate;
		DDetailEndTime=pageData.endDate;
		deptId = pageData.deptId;
		query="";
		searchTime='';
		topicId = pageData.topicId;
		ajaxLoadContent(false);
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(){
		var result = [];
		var pickerDescribe;
		app.ajaxLoadPageContent1(getYearsPath,{
		},function(data){
			console.log(data);
			result = data.data;
			if(result == null){
				var nowDate = new Date();
				var nowYear = nowDate.getFullYear();
				result =[nowYear+'年']
				console.log(result);
			}
			$$.each(data.data, function(index, item) {
				result[index] = item.toString()+'年';
		});
			console.log(result);
			pickerDescribe = app.myApp.picker({
	    		input: '#threeMeetingsAndOneClassPaperDetailTime',
			    rotateEffect: true,
			    cols: [
			        {
			            textAlign: 'left',
			            values:(result)
			        },
			        {
			            values: ('01月 02月 03月 04月 05月 06月 07月 08月 09月 10月 11月 12月').split(' ')
			        },
			    ]
			});
		});
		
		//var myDate = new Date();
		//year = myDate.getFullYear();
		//month = myDate.getMonth()+1;
		//$("#threeMeetingsAndOneClassPaperDetailTime").val(year+'年 '+ month+'月');
		$$(".threeMeetingsAndOneClassPaperDetailTime").on('click',function(){
			pickerDescribe.open();
			year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
			month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
			//$("#picker-describe").val(year+'年 '+ month+'月');
			$$('.picker-3d .close-picker').text('完成');
			//设置一开始被选中的年月份
//			pickerDescribe.displayValue[0] = year+'年';
//			pickerDescribe.displayValue[1] = month+'月';
//			pickerDescribe.value[0] = year+'年';
//			pickerDescribe.value[1] = month+'月';
//			pickerDescribe.params.cols[0].setValue(year+'年');
//			pickerDescribe.params.cols[1].setValue(month+'月');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				DDetailSearchStartTime=year+'-'+month+'-1';
				DDetailSearchEndTime=year+'-'+month+'-31';
				$("#threeMeetingsAndOneClassPaperDetailTime").val(year+'年 '+ month+'月');
			});
		});
		
		
		//点击查询框
		$$('#threeMeetingsAndOneClassPaperDetailSearchD').on('focus', function() {
			$$(this).css('text-align', 'center');
			$$('.threeMeetingsAndOneClassPaperDetailSearchBox').css('display','block');
			$$('.threeMeetingsAndOneClassPaperDetailCancelBtnD').css('display','none');
			$$('.shykDDetailPage').css('display','none');
			$$('.shykDDetailPageSearchD').css('display','block');
			$$('.shykDDetailPageSearchD ul').html('');

		});
		
		$$('.threeMeetingsAndOneClassPaperDetailSearchDClose').click(function(){
			$$('.threeMeetingsAndOneClassPaperDetailSearchBox').css('display','none');
		});		
		$$('.threeMeetingsAndOneClassPaperDetailCancelBtnD').click(function(){
			$$("#threeMeetingsAndOneClassPaperDetailSearchD").css('text-align', 'center');
			$$('.threeMeetingsAndOneClassPaperDetailCancelBtnD').css('display','none');
			$$('.shykDDetailPage').css('display','block');
			$$('.shykDDetailPageSearchD').css('display','none');
		});
		$$('.threeMeetingsAndOneClassPaperDetailCancelBtnD').click(function(){
			$$("#threeMeetingsAndOneClassPaperDetailSearchD").css('text-align', 'center');
			$$('.threeMeetingsAndOneClassPaperDetailCancelBtnD').css('display','none');
			$$('.shykDDetailPage').css('display','block');
			$$('.shykDDetailPageSearchD').css('display','none');
		});
		$$('.threeMeetingsAndOneClassPaperDetailSearchBox .resetBtn').click(function(){
			$$('#threeMeetingsAndOneClassPaperDetailName1').val('');
			$$('#threeMeetingsAndOneClassPaperDetailTime').val('');
			query='';
			year='';
			month='';
			DDetailSearchStartTime="";
			DDetailSearchEndTime = "";
		})
		$$('.threeMeetingsAndOneClassPaperDetailSearchBox .searchBtn').on('click',function(){
			pageNo1=1;
			loading1=true;
			query = $$('#threeMeetingsAndOneClassPaperDetailName1').val();
			if(year == '' && month == ''){
				var myDate = new Date();
				year = myDate.getFullYear();
				month = myDate.getMonth()+1;
				//searchTime = year+'-'+month;
				DDetailSearchStartTime=year+'-'+month+'-1';
				DDetailSearchEndTime=year+'-'+month+'-31';
			}
			$$('.threeMeetingsAndOneClassPaperDetailSearchBox').css('display','none');
			console.log(query);
			ajaxLoadContent1(false);
		});
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		console.log(DDetailStartTime);
		console.log(DDetailEndTime);
		console.log(deptId)
		app.ajaxLoadPageContent(findDetailByTopicIdPath, {
			deptId:deptId,
			topicId:topicId, 
			current:pageNo,
			startDate:DDetailStartTime,
			endDate:DDetailEndTime,
		}, function(data) {
			console.log(data);
			var result = data.data.records;
			queryData = result;
			handleData(result, isLoadMore);
		});
	}
	
	/**
	 * 查询三会一课
	 */
	function ajaxLoadContent1(isLoadMore) {
		console.log(DDetailSearchStartTime);
		console.log(DDetailSearchEndTime);
		app.ajaxLoadPageContent(findDetailByTopicIdPath, {
			deptId:deptId,
			topicId:topicId, 
			page:pageNo,
			startDate:DDetailSearchStartTime,
			endDate:DDetailSearchEndTime,
			query:query,
		}, function(data) {
			console.log(data);
			var result = data.data.records;
			queryData = result;
			handleData1(result, isLoadMore);
		});
	}

	/**
	 * 加载数据 
	 */
	function handleData(data, isLoadMore) {
		var List = [];
		if(data) {
			$$.each(data, function(index, item) {
				var shyk = {
					id:0,
					memo: "",
					reduceScore: 0,
					reportContext: '',
					reportState: 0,
					reportTime: "",
					reportTs: '',
					reportUserId: 0,
					reportTitle: "",
					score: 0,
					topicId: 0,
					topicTitle: '',
					totalScore: 0,
					userName: '',
					userScore: 0,
					TsMonth: "",
				};
				shyk.id = item.id;
				// shyk.memo = item.memo
				// shyk.reduceScore = item.reduceScore;
				shyk.reportContext = item.reportContext;
				// shyk.reportState = item.reportState;
				shyk.reportTime = item.reportTime;
				shyk.reportTs = item.reportTs;
				shyk.reportUserId = item.reportUserId;
				// shyk.score = item.score;
				shyk.topicId = item.topicId;
				shyk.topicTitle = item.topicTitle;
				shyk.totalScore = item.totalScore;
				shyk.userName = item.name;
				// shyk.userScore = item.userScore;
				shyk.reportTitle = item.object;
				shyk.TsMonth = item.reportTime.substring(5,7);
				List.push(shyk);
			});
			console.log('1111111111');
			console.log(List);
			if(isLoadMore) {
				$$('.shykDDetailDetailList ul').append(tMAOCDetailTemplate(List));
				// if(pageNo == 1 && data.length < 10)
			}else if(pageNo == 1 && data.length < 10){
				$$('.shykDDetailDetailList ul').html(tMAOCDetailTemplate(List));
				$$('.infinite-scroll-preloader').remove();
			} else {
				console.log('2222');
				$$('.shykDDetailDetailList ul').html(tMAOCDetailTemplate(List));
			}
			$$('.shykDDetailDetailList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var userName = $$(this).data('userName');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				var memo = $$(this).data('memo') || "";
				var reportState = $$(this).data('reportState') || 1;
				//app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState + '&userName=' + userName);
				app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassDetail.html?assessId=' + id + '&userName=' + userName);
			});
			if(data.length == 10) {
				loading = false;
			}
		}
	}

	/**
	 * 加载数据 
	 */
	function handleData1(data, isLoadMore) {
		var List1 = [];
		if(data != "") {
			$$('.threeMeetingsAndOneClassPaperDetailNotFound').css('display','none');
			$$.each(data, function(index, item) {
				var shyk = {
					id:0,
					memo: "",
					reduceScore: 0,
					reportContext: '',
					reportState: 0,
					reportTime: "",
					reportTs: '',
					reportUserId: 0,
					reportTitle: "",
					score: 0,
					topicId: 0,
					topicTitle: '',
					totalScore: 0,
					userName: '',
					userScore: 0,
					TsMonth: "",
				};
				shyk.id = item.id;
				shyk.memo = item.memo
				shyk.reduceScore = item.reduceScore;
				shyk.reportContext = item.reportContext;
				shyk.reportState = item.reportState;
				shyk.reportTime = item.reportTime;
				shyk.reportTs = item.reportTs;
				shyk.reportUserId = item.reportUserId;
				shyk.score = item.score;
				shyk.topicId = item.topicId;
				shyk.topicTitle = item.topicTitle;
				shyk.totalScore = item.totalScore;
				shyk.userName = item.userName;
				shyk.userScore = item.userScore;
				shyk.reportTitle = item.reportTitle;
				shyk.TsMonth = item.reportTime.substring(5,7);
				List1.push(shyk);
			});
			if(isLoadMore) {
				$$('.shykDDetailPageSearchD ul').append(tMAOCDetailTemplate(List1));
			} else {
				$$('.shykDDetailPageSearchD ul').html(tMAOCDetailTemplate(List1));
			}
			$$('.shykDDetailPageSearchD .item-content').on('click', function() {
				var id = $$(this).data('id');
				var userName = $$(this).data('userName');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				var memo = $$(this).data('memo') || "";
				var reportState = $$(this).data('reportState') || 1;
				//app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState + '&userName=' + userName);
				app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassDetail.html?assessId=' + id);
			});
			if(data.length == 10) {
				loading1 = false;
			}
		}else if(data == ""){
			console.log('1');
			$$('.threeMeetingsAndOneClassPaperDetailNotFound').css('display','block');
		}
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.shykDDetailPage');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				ajaxLoadContent(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		
		//下拉刷新
		var ptrContent1 = $$(page.container).find('.shykDDetailPageSearchD');
		ptrContent1.on('refresh', function(e) {
			setTimeout(function() {
				pageNo1 = 1;
				loading1 = true;
				//这里写请求
				ajaxLoadContent1(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.shykDDetailPage');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			ajaxLoadContent(true);
		});
		//加载更多
		var loadMoreContent1 = $$(page.container).find('.shykDDetailPageSearchD');
		loadMoreContent1.on('infinite', function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			//这里写请求
			ajaxLoadContent1(true);
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