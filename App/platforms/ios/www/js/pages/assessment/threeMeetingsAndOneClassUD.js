define(['app',
		'hbs!js/hbs/threeMeetingsAndOneClassPaperUD',
	],
	function(app,paperTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		//获取党支部未完成的三会一课
		var getTopicCompletedOrNotPath = app.basePath + 'statHelper/getTopicCompletedOrNot';
		//获取年份
		var getYearsPath = app.basePath + 'knowledgeTopic/getYears';
		var oldContent = '';
		var pageNo = 1;
		var loading = true;
		var type = 0;
		var startDate ='';
		var endDate = '';
		var searchStartDate = '';
		var searchEndDate = '';
		var pageNo1 = 1;
		var loading1 = true;
		var year = '';
		var month = '';
		var year1 = '';
		var month1 = '';
		var topicId = 0;
		var searchContent = '';
		var thisAppName = ''
		var deptId = 0;
		var branchName = '';
		/**
		 * 页面初始化 
		 * @param {Object} page 页面内容
		 */
		function init(page) {
			//初始化模块变量
			initData(page.query);
			//返回首页
			app.back2Home();
			loadKnowledgeTopic(false);
			//刷新和滚动加载
			pushAndPull(page);
			//点击事件
			clickEvent();
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
			year = '';
			month = '';
			year1 = '';
			month1 = '';
			oldContent = '';
			searchContent = '';
			searchStartDate = '';
			searchEndDate = '';
			deptId = app.user.deptId;
			topicId = pageData.topicId;
			type = pageData.type;
			branchName = pageData.branchName;
			$$('.shykUDcenter').html('('+branchName+')3+X未参与清单');
			if(pageData.deptId != undefined){
				deptId = pageData.deptId;
			}
			if(pageData.startTime != undefined){
				startDate = pageData.startTime;
			}
			if(pageData.startTime != undefined){
				endDate = pageData.endTime;
			}
			console.log(type);
			thisAppName = pageData.appName;
		}

		/**
		 * 点击事件
		 */
		function clickEvent() {
			//点击查询框
			$$('#threeMeetingsAndOneClassSearch').on('focus', function() {
				$$(this).css('text-align', 'left');
				$$('#threeMeetingsAndOneClassPaperDetailName').val("");
				$$('#threeMeetingsAndOneClassPaperDetailSearch').val("");
				$$('#threeMeetingsAndOneClassPaperDetailStartTime').val('');
				$$('#threeMeetingsAndOneClassPaperDetailEndTime').val('');
				$$('.threeMeetingsAndOneClassCancelBtn').css('display', 'block');
				$$('.threeMeetingsAndOneClassPaperDetailSearchBar .threeMeetingsAndOneClassPaperDetailCancelBtn').css('display', 'block');
				$$('.threeMeetingsAndOneClassList').css('display', 'none');
				$$('.threeMeetingsAndOneClassSearch').css('display', 'block');
				$$('.threeMeetingsAndOneClassPaperDetailSearchList').css('display', 'block');
				$$('.threeMeetingsAndOneClassPaperDetailDSearchBox').css('display', 'block');
				$$('.threeMeetingsAndOneClassPaperDetailSearchList ul').html("");
			});
			
			$$('.threeMeetingsAndOneClassCancelBtn').click(function(){
				searchStartDate = '';
				searchEndDate = '';
				$$('#threeMeetingsAndOneClassPaperDetailName').val("");
				$$('#threeMeetingsAndOneClassPaperDetailSearch').val("");
				$$('#threeMeetingsAndOneClassPaperDetailSearch').css('text-align', 'center');
				$$('.threeMeetingsAndOneClassCancelBtn').css('display', 'none');
				$$('.threeMeetingsAndOneClassList').css('display', 'block');
				$$('.threeMeetingsAndOneClassSearch').css('display', 'none');
				$$('.threeMeetingsAndOneClassList1').css('display', 'block');
			});
			
			$$('.threeMeetingsAndOneClassPaperDetailSearchClose').click(function(){
				$$('.threeMeetingsAndOneClassPaperDetailDSearchBox').css('display', 'none');		
			});
			
			$$('.threeMeetingsAndOneClassPaperDetailDSearchBox .resetBtn').on('click',function(){
				searchStartDate = '';
				searchEndDate = '';
				pageNo1=1;
				$$('#threeMeetingsAndOneClassPaperDetailStartTime').val('');
				$$('#threeMeetingsAndOneClassPaperDetailEndTime').val('');
				$$('#threeMeetingsAndOneClassPaperDetailName').val('');
				loading1=true;
				
			});
			$$('.threeMeetingsAndOneClassPaperDetailDSearchBox .searchBtn').on('click',function(){
				if($$("#threeMeetingsAndOneClassPaperDetailStartTime").val() == '' && $$("#threeMeetingsAndOneClassPaperDetailEndTime").val() != ''){
					app.myApp.alert('请选择开始时间！');
					return;
				}
				if($$("#threeMeetingsAndOneClassPaperDetailEndTime").val() == '' && $$("#threeMeetingsAndOneClassPaperDetailStartTime").val() != ''){
					app.myApp.alert('请选择结束时间！');
					return;
				}
				if(year > year1){
					app.myApp.alert('开始年份必须小于结束年份！');
					return;
				}else if(year == year1 && month>month1){
					app.myApp.alert('开始月份必须小于结束月份！');
					return;
				}else if(year != year1){
					app.myApp.alert('月份跨度不能大于12个月！');
					return;
				}
				$$('.threeMeetingsAndOneClassPaperDetailSearch ul').html('');
				pageNo1=1;
				loading1=true;
				$$('.threeMeetingsAndOneClassPaperDetailDSearchBox').css('display','none');
				searchContent = $$('#threeMeetingsAndOneClassPaperDetailName').val();
				console.log(searchContent);
				console.log(searchStartDate);
				console.log(searchEndDate);
				searchPaper(false);
			});
			
			var pickerDescribe;
			var pickerDescribe1;
			app.ajaxLoadPageContent1(getYearsPath,{
			},function(data){
				console.log(data);
				result = data;
				$$.each(data, function(index, item) {
						result[index] = item.text.toString()+'年';
				});
				console.log(result);
				pickerDescribe = app.myApp.picker({
		    		input: '#threeMeetingsAndOneClassPaperDetailStartTime',
				    rotateEffect: true,
				    cols: [
				        {
				            textAlign: 'left',
				            values:(result)
				        },
				        {
				            values: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')
				        },
				    ]
				});
				pickerDescribe1 = app.myApp.picker({
		    		input: '#threeMeetingsAndOneClassPaperDetailEndTime',
				    rotateEffect: true,
				    cols: [
				        {
				            textAlign: 'left',
				            values:(result)
				        },
				        {
				            values: ('1月 2月 3月 4月 5月 6月 7月 8月 9月 10月 11月 12月').split(' ')
				        },
				    ]
				});
			});
			
			$$(".threeMeetingsAndOneClassPaperDetailStartTime").on('click',function(){
				pickerDescribe.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.picker-3d .close-picker').css('margin-right','20px');
				year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
				month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
				searchStartDate = year+'-'+month+'-1';
				$$('.picker-3d .close-picker').on('click',function(){
					year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
					month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
					$("#threeMeetingsAndOneClassPaperDetailStartTime").val(year+'年 '+ month+'月');
					searchStartDate = year+'-'+month+'-1';
				});
			});
			$$(".threeMeetingsAndOneClassPaperDetailEndTime").on('click',function(){
				pickerDescribe1.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.picker-3d .close-picker').css('margin-right','20px');
				year1 = pickerDescribe1.value[0].substring(0,pickerDescribe1.value[0].length-1);
				month1 = pickerDescribe1.value[1].substring(0,pickerDescribe1.value[1].length-1);
				searchEndDate = year1+'-'+month1+'-31';
				$$('.picker-3d .close-picker').on('click',function(){
					year1 = pickerDescribe1.value[0].substring(0,pickerDescribe1.value[0].length-1);
					month1 = pickerDescribe1.value[1].substring(0,pickerDescribe1.value[1].length-1);
					$("#threeMeetingsAndOneClassPaperDetailEndTime").val(year1+'年 '+ month1+'月');
					searchEndDate = year1+'-'+month1+'-31';
				});
			});
		}
				
		/*
		 * 根据年度月份去查询
		 */
		function loadKnowledgeTopic(isLoadMore){
			console.log(startDate);
			console.log(endDate);
			console.log(type);
			app.ajaxLoadPageContent1(getTopicCompletedOrNotPath,{
				userId:app.userId,
				topicId:topicId,
				deptId:app.user.deptId,
				pageNo:pageNo,
				type:type,
				startDate:startDate,
				endDate:endDate,
			},function(data){
				console.log(data);
				if(data == "" && pageNo == 1){
					loading = true;
					$$('.infinite-scroll-preloader').remove();	
					$$('.threeMeetingsAndOneClassRightList ul').html("");
				}
				if(data.data.length>0){
					
					if(isLoadMore == true) {
						$$('.infinite-scroll-preloader').remove();
						$$('.threeMeetingsAndOneClassRightList ul').append(paperTemplate(data.data));
					} else{
						$$('.threeMeetingsAndOneClassRightList ul').html(paperTemplate(data.data));
					}
					if(pageNo == 1 && data.data.length<10){
						$$('.infinite-scroll-preloader').remove();
					}
//					$$('.threeMeetingsAndOneClassRightList .item-content').on('click', function() {
//						var id = $$(this).data('id');
//						var title = $$(this).find('.kpi-title').html() || '无标题';
//						var score = $$(this).data("score") || 0;
//						var target = $$(this).data('target') || '无';
//						var minus = $$(this).data('minus') || 0;
//						var memo = $$(this).data('memo') || '无';
//						app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=UD');
//					});
//					loading = false;
					$$('.infinite-scroll-preloader').remove();
				}
			});
		}	
		function cancelAssessmentSearch(){
			oldContent = '';
			$$('#threeMeetingsAndOneClassSearch').val("");
			$$('.assessTime').css('display', 'block');
			$$('.threeMeetingsAndOneClassList').css('display', 'block');
			$$('.threeMeetingsAndOneClassSearchBar #threeMeetingsAndOneClassSearch').css('text-align', 'center');
			$$('.threeMeetingsAndOneClassSearchBar .threeMeetingsAndOneClassCancelBtn').css('display','none');
			$$('.threeMeetingsAndOneClassSearchList1 ul').html("");
			$$('.threeMeetingsAndOneClassSearchList1').css('display', 'none');
			$$('.threeMeetingsAndOneClassSearch').css('display', 'none');
			$$('.threeMeetingsAndOneClassNotFound').css('display', 'none');
		}
		//查找考核清单
		function searchPaper(isLoadMore) {
			if(searchStartDate == "" &&  searchEndDate == ''){
				var myDate = new Date();
				year = myDate.getFullYear();
				month = myDate.getMonth()+1;
				searchStartDate = year+'-'+month+'-1';
				searchEndDate = year+'-'+month+'-31';
			}
			console.log(searchStartDate);
			console.log(searchEndDate);
			console.log(searchContent);
			searchContent = searchContent.trim();
			$$('.threeMeetingsAndOneClassNotFound').css('display', 'none');
			app.ajaxLoadPageContent(getTopicCompletedOrNotPath, {
				userId:app.userId,
				topicId:topicId,
				deptId:app.user.deptId,
				pageNo:pageNo,
				type:type,
				startDate:searchStartDate,
				endDate:searchEndDate,
				query:searchContent,
			}, function(data) {
				console.log(data);
				data = data.data;
				if(data.length>0){
					console.log('11');
					console.log(data);
					if(isLoadMore == true) {
						$$('.infinite-scroll-preloader').remove();
						$$('.threeMeetingsAndOneClassSearchList1 ul').append(paperTemplate(data));
					} else{
						console.log('11');
						$$('.threeMeetingsAndOneClassSearchList1 ul').html(paperTemplate(data));
					}
					if(pageNo1 == 1 && data.length<10){
						$$('.infinite-scroll-preloader').remove();
					}
//					$$('.threeMeetingsAndOneClassSearchList1 .item-content').on('click', function() {
//						var id = $$(this).data('id');
//						var title = $$(this).find('.kpi-title').html() || '无标题';
//						var score = $$(this).data("score") || 0;
//						var target = $$(this).data('target') || '无';
//						var minus = $$(this).data('minus') || 0;
//						var memo = $$(this).data('memo') || '无';
//						app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=UD');
//					});
					loading1 = false;
				}else if(data.length<0 && pageNo1 == 1){
					$$('.threeMeetingsAndOneClassNotFound').css('display', 'block');
				}else{
					loading1 = true;
					$$('.infinite-scroll-preloader').remove();
					$$('.threeMeetingsAndOneClassSearchList1 ul').html("");
				}
			});
		}
		
		/*
		 * 刷新
		 */
		function refreshThreeMeetingsAndOneClassPaperUD(){
			pageNo = 1;
			loading = true;
			loadKnowledgeTopic(false);
			pageNo1 = 1;
			loading1 = true;
			searchPaper(searchContent,false);
		}
		
			/**
		 * 上下拉操作 
		 */
		function pushAndPull(page) {
			//下拉刷新	
			var ptrContent = $$(page.container).find('.pull-to-refresh-content.threeMeetingsAndOneClassList');
			var ptrContent1 = $$(page.container).find('.pull-to-refresh-content.threeMeetingsAndOneClassSearch');
			ptrContent.on('refresh', function(e) {
				setTimeout(function() {
					pageNo = 1;
					loading = true;
					//这里写请求
					loadKnowledgeTopic(false);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
			ptrContent1.on('refresh', function(e) {
				setTimeout(function() {
					pageNo1 = 1;
					loading1 = true;
					//这里写请求
					searchPaper(false);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
	
			//滚动加载
			var loadMoreContent = $$(page.container).find('.infinite-scroll.threeMeetingsAndOneClassList');
			var loadMoreContent1 = $$(page.container).find('.infinite-scroll.threeMeetingsAndOneClassSearch');
			loadMoreContent.on('infinite', function() {
				if(loading) return;
				loading = true;
				pageNo += 1;
				loadKnowledgeTopic(true);
			});
			loadMoreContent1.on('infinite', function() {
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				searchPaper(true);
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
			refreshThreeMeetingsAndOneClassPaperUD: refreshThreeMeetingsAndOneClassPaperUD,
			resetFirstIn: resetFirstIn,
		}
	});