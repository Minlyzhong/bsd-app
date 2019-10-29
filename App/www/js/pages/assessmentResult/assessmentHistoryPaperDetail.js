define(['app',
	'hbs!js/hbs/assessmentResultPCDetail2'
], function(app,tMAOCDetailTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	//获取专项考核得分明细(历史记录)
	var searchResultDetailPath = app.basePath + '/mobile/partyAm/partySpecialResultByMonthAndUserId';
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	var queryData = '';
	var title = '';
	var year;
	var month;
	var query;
	//初始化网页传来的参数
	var topicId = '';
 	var deptId = '';
	var startDate = '';
	var endDate = '';
	

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData();
		app.back2Home();
		pushAndPull(page);
		//点击事件
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		//接收网页传来的参数
		// console.log(pageData);
		// topicId = pageData.topicId;
	 	// deptId = pageData.deptId;
		// startDate = pageData.startDate;
		// endDate = pageData.endDate;
		
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		queryData = '';
		year="";
		month="";
		query="";
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
				
			}
			$$.each(data.data, function(index, item) {
					result[index] = item.toString()+'年';
			});
			console.log(result);
			pickerDescribe = app.myApp.picker({
	    		input: '#picker-describe1',
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
		//获取日期
		var myDate = new Date();
		year = myDate.getFullYear();
		month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;
		$("#picker-describe1").val(year+'年 '+ month+'月');
		$$(".threeMeetingsAndOneClassPaperDetailTime").on('click',function(){
			pickerDescribe.open();
			$("#picker-describe").val(year+'年 '+ month+'月');
			$$('.picker-3d .close-picker').text('完成');
			//设置一开始被选中的年月份
			pickerDescribe.displayValue[0] = year+'年';
			pickerDescribe.displayValue[1] = month+'月';
			pickerDescribe.value[0] = year+'年';
			pickerDescribe.value[1] = month+'月';
			pickerDescribe.params.cols[0].setValue(year+'年');
			pickerDescribe.params.cols[1].setValue(month+'月');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				$("#picker-describe1").val(year+'年 '+ month+'月');
			});
		});
		
		
		//点击查询框
		$$('#assessmentResultDetailSearch').on('focus', function() {
			$$(this).css('text-align', 'left');
			$$('#threeMeetingsAndOneClassPaperDetailName').val("");
			$$('#assessmentResultDetailSearch').val("");
			$$('.assessmentResultPaperDetailSearchBar .assessmentResultPaperDetailCancelBtn').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailPage').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailSearch').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearchList').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearchBox').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').html("");
		});
		
		$$('.assessmentResultPaperDetailCancelBtn').click(function(){
			$$('#threeMeetingsAndOneClassPaperDetailName').val("");
			$$('#assessmentResultDetailSearch').val("");
			$$('#assessmentResultDetailSearch').css('text-align', 'center');
			$$('.assessmentResultPaperDetailSearchBar .assessmentResultPaperDetailCancelBtn').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailPage').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearch').css('display', 'none');
		});
		
		$$('.threeMeetingsAndOneClassPaperDetailSearchClose').click(function(){
			query="";
			$$('#threeMeetingsAndOneClassPaperDetailName').val("");
			$$('#assessmentResultDetailSearch').val("");
			$$('#assessmentResultDetailSearch').css('text-align', 'center');
			$$('.assessmentResultPaperDetailSearchBar .assessmentResultPaperDetailCancelBtn').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailPage').css('display', 'block');
			$$('.threeMeetingsAndOneClassPaperDetailSearch').css('display', 'none');
			$$('.threeMeetingsAndOneClassPaperDetailSearchBox').css('display', 'none');
			
		});
		
		$$('.threeMeetingsAndOneClassPaperDetailSearchBox .searchBtn').click(function(){
			pageNo1=1;
			loading1=true;
			$$('.threeMeetingsAndOneClassPaperDetailSearchBox').css('display','none');
			query = $$('#threeMeetingsAndOneClassPaperDetailName').val();
			ajaxLoadContent1(false);
		});
		
		$$('.threeMeetingsAndOneClassPaperDetailSearchBox .resetBtn').on('click',function(){
			$$('#threeMeetingsAndOneClassPaperDetailName').val('');
			$$('#picker-describe1').val('');
			year='';
			month='';
			query='';
		})
	}

	/**
	 * 异步请求页面数据 
	 */
	function ajaxLoadContent(isLoadMore) {
		app.ajaxLoadPageContent(searchResultDetailPath, {
			// topicId:topicId,
			// deptId:deptId,
			// startDate:startDate,
			// endDate:endDate
		}, function(data) {
			if(data.data == null){
			$$('.shykDetailNotFound').css('display','block');
			}else{
				var data = data.data.records;
				console.log(data);
				var data = data;
				queryData = data;
				handleData(data, isLoadMore);
			}
			
		});
	}
	
	/**
	 * 查询专项考核
	 */
	function ajaxLoadContent1(isLoadMore) {
		console.log(year);
		console.log(month);
		console.log(query);
		app.ajaxLoadPageContent(searchResultDetailPath, {
			// userId: app.userId,
			current: pageNo1,
			// deptId: app.user.deptId,
			query:query,
			// sortType:sortType,
		}, function(data) {
			if(data.data == null){
				$$('.threeMeetingsAndOneClassPaperDetailNotFound').css('display','block');
			}else{
				var data = data.data.records;
				console.log(data);
				queryData = data;
				handleData1(data, isLoadMore);
			}
			
		});
	}

	/**
	 * 加载数据 
	 */
	function handleData(data, isLoadMore) {
		if(data == ''){
			$$('.shykDetailNotFound').css('display','block');
		}
		if(data) {
			if(isLoadMore) {
				$$('.threeMeetingsAndOneClassPaperDetailList ul').append(tMAOCDetailTemplate(data));
			} else {
				$$('.threeMeetingsAndOneClassPaperDetailList ul').html(tMAOCDetailTemplate(data));
			}
			$$('.threeMeetingsAndOneClassPaperDetailList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var userName = $$(this).data('userName');
				var memo = $$(this).data('memo');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				// var memo = $$(this).data('memo') || "";
				var reportState = $$(this).data('reportState') || 0;
				// reportState 0是没回退 回退是1
				console.log(title)
				console.log(score)
				// app.myApp.getCurrentView().loadPage('firstHandAssessDetail .html')
				app.myApp.getCurrentView().loadPage('assessmentDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&reportState=' + reportState + '&userName=' + userName+'&memo=' + memo);
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
				$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').append(tMAOCDetailTemplate(List1));
			} else {
				$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').html(tMAOCDetailTemplate(List1));
			}
			$$('.threeMeetingsAndOneClassPaperDetailSearchList .item-content').on('click', function() {
				var id = $$(this).data('id');
				var userName = $$(this).data('userName');
				var score = $$(this).find('.rankDetailScore').html();
				var title = $$(this).find('.rankDetailTitle').html().split("：")[1];
				var name = $$(this).find('.rankDetailName').html().split("：")[1];
				var memo = $$(this).data('memo') || "";
				var reportState = $$(this).data('reportState') || 1;
				app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAssessDetail.html?assessId=' + id + '&title=' + title + '&score=' + score + '&name=' + name + '&memo=' + memo + '&reportState=' + reportState + '&userName=' + userName);
			});
			if(data.length == 10) {
				loading1 = false;
			}
		}else if(data == ""){
			$$('.threeMeetingsAndOneClassPaperDetailNotFound').css('display','block');
		}
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailPage');
		
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
		var ptrContent1 = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailSearch');
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
		var loadMoreContent = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailPage');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			ajaxLoadContent(true);
		});
		//加载更多
		var loadMoreContent1 = $$(page.container).find('.threeMeetingsAndOneClassPaperDetailSearch');
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
		ajaxLoadContent:ajaxLoadContent
	}
});