define(['app',
		'hbs!js/hbs/threeMeetingsAndOneClassPaper',
	],
	function(app,paperTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		//根据年月查询三会一课
		var loadKnowledgeTopicByYearAndMonthPath = app.basePath + '/mobile/partyAm/loadKnowledgeTopicByYearAndMonth';

		//查询3+x未读的日志数量
		var findShykUnReadPath = app.basePath + '/mobile/partyAm/loadKnowledgeTopicByYearAndMonthNun';
		//获取三会一课年份
		var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
		var oldContent = '';
		//月份
		var pageNo = 1;
		var loading = true;
		var year = '';
		var month = '';
		var numMonth = '';
		//查询
		var pageNo1 = 1;
		var loading1 = true;
		//季度
		var season = '';
		var pageSeason = 1;
		var loadingSeason = true;
		var seasonCount = 1;
		var numSeason = '';
		//年度
		var pageYear= 1;
		var loadingYear= true;
		var yearCount = 1;
		var numYear = '';
		//月份的时间段
		var monthStartTime='';
		var monthEndTime='';
		//季度时间段
		var seasonStartTime='';
		var seasonEndTime='';
		//年度时间段
		var yearStartTime='';
		var yearEndTime='';
		//查询
		var searchContent = '';
		var SearchStartTime='';
		var SearchEndTime='';
		var numSearch = '';
		//导航栏的名称
		var thisAppName = ''
		
		var khpl = 2;
		

		/**
		 * 页面初始化 
		 * @param {Object} page 页面内容
		 */
		function init(page) {
			//初始化模块变量
			initData(page.query);
			//返回首页
			app.back2Home();
			//刷新和滚动加载
			pushAndPull(page);
			//点击事件
			clickEvent();
			//月份
			loadKnowledgeTopic(false);
		}

		/**
		 * 初始化模块变量
		 */
		function initData(pageData) {
			firstIn = 0;
			pageDataStorage = {};
			//初始化月份
			pageNo = 1;
			loading = true;
			year = '';
			month = '';
			//初始化查询
			pageNo1 = 1;
			loading1 = true;
			oldContent = '';
			searchContent = '';
			SearchStartTime='';
			SearchEndTime='';
			//初始化季度
			season = '';
			pageSeason = 1;
			loadingSeason = true;
			seasonCount = 1;
			//初始化年度
			pageYear= 1;
			loadingYear= true;
			yearCount = 1;
			
			numSeason = '';
			numMonth = '';
			numYear = '';
			numSearch = '';
			//设置标题栏名称
			$$('.threeMeetingsAndOneClassPage .center').text(pageData.appName);
			thisAppName = pageData.appName;
		}

		/**
	 * 查询3+x未读的日志数量
	 */
	function findShykReadRows(data) {
		
		var myDate = new Date();
		
		var month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;
		startDate = myDate.getFullYear()+'-'+ month +'-01';
		endDate =myDate.getFullYear()+'-'+ month+'-31';
		
		app.ajaxLoadPageContent(findShykUnReadPath, {
			khpl:data,
			startDate:startDate,
			endDate:endDate,
		}, function(result) {
			if(result.code == 0){
				shykReadRows = result.data;
			}
			
		},{
			async: false
		});
	}

		/**
		 * 点击事件
		 */
		function clickEvent() {
			//选择时间
			var result = [];
			var pickerDescribe;
			var pickerDescribeSeason;
			var pickerDescribeYear;
			//获取年份
			app.ajaxLoadPageContent1(getYearsPath,{
			},function(data){
				if(result == null){
					var nowDate = new Date();
					var nowYear = nowDate.getFullYear();
					result =[nowYear+'年']
					console.log(result);
				}
				result = data.data;
				$$.each(data.data, function(index, item) {
					result[index] = item.toString()+'年';
			});
				console.log(result);
				pickerDescribe = app.myApp.picker({
		    		input: '#picker-describe',
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
				pickerDescribeSeason = app.myApp.picker({
		    		input: '#picker-describeSeason',
				    rotateEffect: true,
				    cols: [
				        {
				            textAlign: 'left',
				            values:(result)
				        },
				        {
				            values: ('第一季度 第二季度 第三季度 第四季度').split(' ')
				        },
				    ]
				});
				pickerDescribeYear = app.myApp.picker({
		    		input: '#picker-describeYear',
				    rotateEffect: true,
				    cols: [
				        {
				            textAlign: 'left',
				            values:(result)
				        },
				    ]
				});
			});
			var myDate = new Date();
			year = myDate.getFullYear();
			month = myDate.getMonth()+1<10? "0"+(myDate.getMonth()+1):myDate.getMonth()+1;
			//月份时间判断
			$("#picker-describe").val(year+'年 '+ month+'月');
			
			monthStartTime = year+'-'+month+'-01';
			monthEndTime = year+'-'+month+'-31';
			$$(".assessTime").on('click',function(){
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
					$$('.shykNotFound').css('display','none');
					year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
					month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
					$("#picker-describe").val(year+'年 '+ month+'月');
					pageNo = 1;
					loading = true;
					var str = '';
					str += '<div class="infinite-scroll-preloader">';
					str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
					str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
					str += '</div>';
					$$('.threeMeetingsAndOneClassRightList ul').html(str);
					monthStartTime = year+'-'+month+'-01';
					monthEndTime = year+'-'+month+'-31';
					loadKnowledgeTopic(false);
				});
			});
			
			
			//季度时间判断
			if(month<=3){
				$("#picker-describeSeason").val(year+'年 '+ '第一季度');
				seasonStartTime = year+'-01-01';
				seasonEndTime = year+'-03-31';
			}else if(month>3 && month<=6){
				$("#picker-describeSeason").val(year+'年 '+ '第二季度');
				seasonStartTime = year+'-04-01';
				seasonEndTime = year+'-06-31';
			}else if(month>6 && month<=9){
				$("#picker-describeSeason").val(year+'年 '+ '第三季度');
				seasonStartTime = year+'-07-01';
				seasonEndTime = year+'-09-31';
			}else if(month>9 && month<=12){
				$("#picker-describeSeason").val(year+'年 '+ '第四季度');
				seasonStartTime = year+'-10-01';
				seasonEndTime = year+'-12-31';
			}
			$$(".assessTimeSeason").on('click',function(){
				pickerDescribeSeason.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					$$('.shykNotFound').css('display','none');
					year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
					season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
					if(season == '第一季度'){
						seasonStartTime = year+'-01-01';
						seasonEndTime = year+'-03-31';
					}else if(season == '第二季度'){
						seasonStartTime = year+'-04-01';
						seasonEndTime = year+'-06-31';
					}else if(season == '第三季度'){
						seasonStartTime = year+'-07-01';
						seasonEndTime = year+'-09-31';
					}else if(season == '第四季度'){
						seasonStartTime = year+'-10-01';
						seasonEndTime = year+'-12-31';
					}
					$("#picker-describeSeason").val(year+'年 '+ season);
					pageSeason = 1;
					loadingSeason = true;
					var str = '';
					str += '<div class="infinite-scroll-preloader">';
					str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
					str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
					str += '</div>';
					$$('.threeMeetingsAndOneClassRightListSeason ul').html(str);
					loadShykBySeason(false);
				});
			});
			
			
			//年份时间判断
			$("#picker-describeYear").val(year+'年 ');
			yearStartTime= year+'-01-01';
			yearEndTime= year+'-12-31';
			$$(".assessTimeYear").on('click',function(){
				pickerDescribeYear.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					$$('.shykNotFound').css('display','none');
					year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
					yearStartTime= year+'-1-1';
					yearEndTime= year+'-12-31';
					$("#picker-describeYear").val(year+'年 ');
					pageYear = 1;
					loadingYear = true;
					var str = '';
					str += '<div class="infinite-scroll-preloader">';
					str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
					str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
					str += '</div>';
					$$('.threeMeetingsAndOneClassRightListYear ul').html(str);
					loadShykByYear(false);
				});
			});
			
			
			//点击查询框
			$$('#threeMeetingsAndOneClassSearch').on('focus', function() {
				$$(this).css('text-align', 'left');
				$$('.threeMeetingsAndOneClassSearchBar .threeMeetingsAndOneClassCancelBtn').css('display', 'block');
				$$('.assessTime').css('display', 'none');
				$$('.threeMeetingsAndOneClassSearchList').css('display', 'block');
				//$$('.threeMeetingsAndOneClassList').css('display', 'none');
				$$('.threeMeetingsAndOneClassSearch').css('display', 'block');
				$$('.shykTab').css('display', 'none');
			});
			//取消按钮
			$$('.threeMeetingsAndOneClassCancelBtn').on('click',cancelAssessmentSearch);
			//搜索按钮
			$$('#threeMeetingsAndOneClassSearch').on('keyup', keyupAssessment);
			//点击时间图标
			$$('.icon-history').on('click',function(){
				app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassPaperDetail.html');
			});
			
			//点击tab标签
			//月份
			$$('.buttonShyk').on('click',function(){
				khpl = 2;
				setTimeout(function(){
					$$('.threeMeetingsAndOneClassList').css('display','block');
					$$('.threeMeetingsAndOneClassListSeason').css('display','none');
					$$('.threeMeetingsAndOneClassListYear').css('display','none');
				},100);
				if($$('.shykTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment();
					},100);
				}
			});
			//季度
			$$('.buttonShykSeason').on('click',function(){
				khpl = 1;
				setTimeout(function(){
					$$('.threeMeetingsAndOneClassListSeason').css('display','block');
					$$('.threeMeetingsAndOneClassList').css('display','none');
					$$('.threeMeetingsAndOneClassListYear').css('display','none');
				},100);
				if($$('.shykTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment();
					},100);
				}else{
					if(seasonCount == 1){
						loadShykBySeason(false);
						seasonCount += 1;
					}
				}
			});
			//年份
			$$('.buttonShykYear').on('click',function(){
				khpl = 0;
				setTimeout(function(){
					$$('.threeMeetingsAndOneClassListYear').css('display','block');
					$$('.threeMeetingsAndOneClassList').css('display','none');
					$$('.threeMeetingsAndOneClassListSeason').css('display','none');
				},100);
				if($$('.shykTab').css('display') == 'none'){
					setTimeout(function(){
						searchAssessment();
					},100);
				}else{
					if(yearCount == 1){
						loadShykByYear(false);
						yearCount += 1;
					}
				}
			});		
		}
		
		/*
		 * 根据年度月份去查询
		 */
		function loadKnowledgeTopic(isLoadMore){
			console.log(monthStartTime);
			console.log(monthEndTime);
			console.log(app.user.deptId);
			// khpl年 0 ， 季 1，月 2
			app.ajaxLoadPageContent1(loadKnowledgeTopicByYearAndMonthPath,{
				startDate:monthStartTime,
				endDate:monthEndTime,
				// pageNo:pageNo,
				// userId:app.userId,
				// deptId:app.user.deptId,
				khpl:2
			},function(data){
				
				console.log(data);
				// numMonth = data.unCompletedTotal;
				findShykReadRows(2);
				numMonth = shykReadRows
				var data = data.data;
				//当没有数据的时候
				if(data == undefined || data == null){
					loading = true;
					$$('.infinite-scroll-preloader').remove();	
				}
				if((data == '' && pageNo == 1) || (data == null && pageNo == 1)){
					$$('.shykNotFound').css('display','block');
				}
				if(data.length>0){
					if(pageNo == 1){
						$$('.shykMonthNum').css('display','block');
						$$('.shykMonthNum').html(numMonth);
					}	
					if(isLoadMore == true) {
						$$('.infinite-scroll-preloader').remove();
						$$('.threeMeetingsAndOneClassRightList ul').append(paperTemplate(data));
					} else{
						$$('.threeMeetingsAndOneClassRightList ul').html(paperTemplate(data));
					}
					if(pageNo == 1 && data.length<10){
						$$('.infinite-scroll-preloader').remove();
					}
					//点击.item-content
					$$('.threeMeetingsAndOneClassRightList .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html() || '无标题';
						var score = $$(this).data("score") || 0;
						var target = $$(this).data('target') || '无';
						var minus = $$(this).data('minus') || 0;
						var memo = $$(this).data('memo') || '无';
						//app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+monthStartTime);
						app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAdd.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+monthStartTime);
					});
					//点击手指
					$$('.getDetail').on('click',function(){
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId=' + id+'&startDate='+monthStartTime+'&endDate='+monthEndTime+'&deptId='+app.user.deptId);
					});
					loading = false;
				}else{
					loading = true;
					$$('.infinite-scroll-preloader').remove();	
				}

			});
		}
		
		/*
		 * 根据季度去查询
		 */
		function loadShykBySeason(isLoadMore){
			console.log(seasonStartTime);
			console.log(seasonEndTime);
			app.ajaxLoadPageContent1(loadKnowledgeTopicByYearAndMonthPath,{
				startDate:seasonStartTime,
				endDate:seasonEndTime,
				// pageNo:pageSeason,
				// userId:app.userId,
				// deptId:app.user.deptId,
				khpl:1
			},function(data){
				console.log(data);
				findShykReadRows(1);
				numSeason = shykReadRows
				var data = data.data;
				if(data == undefined || data == null){
					loading = true;
					$$('.infinite-scroll-preloader').remove();	
				}
				if((data == '' && pageSeason == 1) || (data == null && pageSeason == 1)){
					$$('.shykSeasonNotFound').css('display','block');
				}
				if(data.length>0){
					if(pageSeason == 1){
						$$('.shykSeasonNum').css('display','block');
						$$('.shykSeasonNum').html(numSeason);
					}
					if(isLoadMore == true) {
						$$('.infinite-scroll-preloader').remove();
						$$('.threeMeetingsAndOneClassRightListSeason ul').append(paperTemplate(data));
					} else{
						$$('.threeMeetingsAndOneClassRightListSeason ul').html(paperTemplate(data));
					}
					if(pageSeason == 1 && data.length<10){
						$$('.infinite-scroll-preloader').remove();
					}
					//点击.item-content
					$$('.threeMeetingsAndOneClassRightListSeason .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html() || '无标题';
						var score = $$(this).data("score") || 0;
						var target = $$(this).data('target') || '无';
						var minus = $$(this).data('minus') || 0;
						var memo = $$(this).data('memo') || '无';
						//app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+seasonStartTime);
						app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAdd.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+seasonStartTime);
					});
					//点击手指
					$$('.getDetail').on('click',function(){
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId=' + id+'&startDate='+seasonStartTime+'&endDate='+seasonEndTime+'&deptId='+app.user.deptId);
					});
					loadingSeason = false;
				}else{
					loadingSeason = true;
					$$('.infinite-scroll-preloader').remove();	
				}
			});
		}
		
		/*
		 * 根据年份去查询
		 */
		function loadShykByYear(isLoadMore){
			console.log(yearStartTime);
			console.log(yearEndTime);
			app.ajaxLoadPageContent1(loadKnowledgeTopicByYearAndMonthPath,{
				startDate:yearStartTime,
				endDate:yearEndTime,
				// pageNo:pageYear,
				// userId:app.userId,
				// deptId:app.user.deptId,
				khpl:0
			},function(data){
				console.log(data);
				findShykReadRows(0);
				shykYearNum = shykReadRows
				var data = data.data;
				if(data == undefined ){
					loading = true;
					$$('.infinite-scroll-preloader').remove();	
				}
				
				if((data == '' && pageYear == 1)||(data == null && pageYear == 1)){
					$$('.shykYearNotFound').css('display','block');
				}
				if(data.length>0){
					if(pageYear == 1){
						$$('.shykYearNum').css('display','block');
						$$('.shykYearNum').html(numYear);
					}
					if(isLoadMore == true) {
						$$('.infinite-scroll-preloader').remove();
						$$('.threeMeetingsAndOneClassRightListYear ul').append(paperTemplate(data));
					} else{
						$$('.threeMeetingsAndOneClassRightListYear ul').html(paperTemplate(data));
					}
					if(pageYear == 1 && data.length<10){
						$$('.infinite-scroll-preloader').remove();
					}
					//点击.item-content
					$$('.threeMeetingsAndOneClassRightListYear .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html() || '无标题';
						var score = $$(this).data("score") || 0;
						var target = $$(this).data('target') || '无';
						var minus = $$(this).data('minus') || 0;
						var memo = $$(this).data('memo') || '无';
						//app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+yearStartTime);
						app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAdd.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+yearStartTime);
					});
					//点击手指
					$$('.getDetail').on('click',function(){
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId=' + id+'&startDate='+yearStartTime+'&endDate='+yearEndTime+'&deptId='+app.user.deptId);
					});
					loadingYear = false;
				}else{
					loadingYear = true;
					$$('.infinite-scroll-preloader').remove();	
				}
			});
		}
		
		//点击查询
		function keyupAssessment(){
			searchContent = $$('#threeMeetingsAndOneClassSearch').val();
			if(!searchContent) {
				oldContent = '';
				$$('.searchbar-clear').css('opacity', '0');
				$$('.threeMeetingsAndOneClassSearchList ul').html("");
			} else {
				$$('.searchbar-clear').css('opacity', '1');
			}
			searchAssessment();
		}
		//搜索条件
		function searchAssessment(){
			var monthClassName = $('#tab1').hasClass('active');
			var seasonClassName = $('#tab2').hasClass('active');
			var yearClassName = $('#tab3').hasClass('active');
			console.log(monthClassName);
			console.log(seasonClassName);
			console.log(yearClassName);
			if(monthClassName){
				khpl = 2;
				SearchStartTime = monthStartTime;
				SearchEndTime = monthEndTime;
				$$('.shykMonthNum').css('display','block');
				$$('.shykSeasonNum').css('display','none');
				$$('.shykYearNum').css('display','none');
			}else if(seasonClassName){
				khpl = 1;
				SearchStartTime = seasonStartTime;
				SearchEndTime = seasonEndTime;
				$$('.shykMonthNum').css('display','none');
				$$('.shykSeasonNum').css('display','block');
				$$('.shykYearNum').css('display','none');
			}else if(yearClassName){
				khpl = 0;
				SearchStartTime = yearStartTime;
				SearchEndTime = yearEndTime;
				$$('.shykMonthNum').css('display','none');
				$$('.shykSeasonNum').css('display','none');
				$$('.shykYearNum').css('display','block');
			}
			searchPaper(searchContent,false);
		}
		
		function cancelAssessmentSearch(){
			$$('.shykTab').css('display', 'block');
			oldContent = '';
			$$('#threeMeetingsAndOneClassSearch').val("");
			$$('.assessTime').css('display', 'block');
			$$('.threeMeetingsAndOneClassList').css('display', 'block');
			$$('.threeMeetingsAndOneClassSearchBar #threeMeetingsAndOneClassSearch').css('text-align', 'center');
			$$('.threeMeetingsAndOneClassSearchBar .threeMeetingsAndOneClassCancelBtn').css('display','none');
			$$('.threeMeetingsAndOneClassSearchList ul').html("");
			$$('.threeMeetingsAndOneClassSearchList').css('display', 'none');
			$$('.threeMeetingsAndOneClassSearch').css('display', 'none');
			$$('.threeMeetingsAndOneClassNotFound').css('display', 'none');
			numSearch = '';
			if($$('.shykMonthNum').css('display') == 'block' || numMonth != ''){
				$$('.shykMonthNum').css('display','block');
				$$('.shykMonthNum').html(numMonth);
			};
			if($$('.shykSeasonNum').css('display') == 'block' || numSeason != ''){
				$$('.shykSeasonNum').css('display','block');
				$$('.shykSeasonNum').html(numSeason);
			};
			if($$('.shykYearNum').css('display') == 'block' || numYear != ''){
				$$('.shykYearNum').css('display','block');
				$$('.shykYearNum').html(numYear);
			};
		}
		//查找考核清单
		function searchPaper(searchContent,isLoadMore) {
			console.log(searchContent);
			searchContent = searchContent.trim();
			$$('.threeMeetingsAndOneClassNotFound').css('display', 'none');
			if(!searchContent) {
				return;
			}
			console.log(SearchStartTime);
			console.log(SearchEndTime);
			app.ajaxLoadPageContent(loadKnowledgeTopicByYearAndMonthPath, {
				query: searchContent,
				startDate:SearchStartTime,
				endDate:SearchEndTime,
				// pageNo:pageNo1,
				// userId:app.userId,
				// deptId:app.user.deptId,
				khpl:khpl
			}, function(data) {
				console.log(data);
				var data = data.data;
				
				
				if(data == undefined || data == null){
					loading = true;
					$$('.shykMonthNum').css('display','none');
				$$('.shykSeasonNum').css('display','none');
				$$('.shykYearNum').css('display','none');
					$$('.infinite-scroll-preloader').remove();
					$$('.threeMeetingsAndOneClassSearchList ul').html(' ');	
					$$('.threeMeetingsAndOneClassSearchList .threeMeetingsAndOneClassNotFound').css('display','block');
				}
				if(data.length>0){
					numSearch = data.length;
					// numSearch = data.unCompletedTotal
					$$('.shykMonthNum').html(numSearch);
					$$('.shykSeasonNum').html(numSearch);
					$$('.shykYearNum').html(numSearch);
					if(isLoadMore == true) {
						$$('.infinite-scroll-preloader').remove();
						$$('.threeMeetingsAndOneClassSearchList ul').append(paperTemplate(data));
					} else{
						$$('.threeMeetingsAndOneClassSearchList ul').html(paperTemplate(data));
					}
					if(pageNo1 == 1 && data.length<10){
						$$('.infinite-scroll-preloader').remove();
					}
					//点击item-content
					$$('.threeMeetingsAndOneClassSearchList .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html() || '无标题';
						var score = $$(this).data("score") || 0;
						var target = $$(this).data('target') || '无';
						var minus = $$(this).data('minus') || 0;
						var memo = $$(this).data('memo') || '无';
						//app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+seasonStartTime);
						app.myApp.getCurrentView().loadPage('threeMeetingAndOneClassAdd.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo='+ memo +'&thisAppName=' +thisAppName+'&deptId='+app.user.deptId+'&StartDate='+SearchStartTime);
					});
					//点击手指
					$$('.getDetail').on('click',function(){
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('shykDDetail.html?topicId=' + id+'&startDate='+SearchStartTime+'&endDate='+SearchEndTime+'&deptId='+app.user.deptId);
					});
					loading1 = false;
				}else if(data.length<0 && pageNo1 == 1){
					$$('.threeMeetingsAndOneClassNotFound').css('display', 'block');
				}else{
					loading1 = true;
					$$('.infinite-scroll-preloader').remove();
					//$$('.threeMeetingsAndOneClassSearchList ul').html("");
				}
			});
		}
		
		/*
		 * 刷新
		 */
		function refreshThreeMeetingsAndOneClassPaper(){
			pageNo = 1;
			loading = true;
			loadKnowledgeTopic(false);
			pageSeason = 1
			loadingSeason = true;
			loadShykBySeason(false);
			pageYear = 1;
			loadingYear = true;
			loadShykByYear(false);
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
			var ptrContent2 = $$(page.container).find('.pull-to-refresh-content.threeMeetingsAndOneClassListSeason');
			var ptrContent3 = $$(page.container).find('.pull-to-refresh-content.threeMeetingsAndOneClassListYear');
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
					searchPaper(searchContent,false);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
			ptrContent2.on('refresh', function(e) {
				setTimeout(function() {
					pageSeason = 1;
					loadingSeason = true;
					//这里写请求
					loadShykBySeason(false);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
			ptrContent3.on('refresh', function(e) {
				setTimeout(function() {
					pageYear = 1;
					loadingYear = true;
					//这里写请求
					loadShykByYear(false);
					app.myApp.pullToRefreshDone();
				}, 500);
			});	
	
			//滚动加载
			var loadMoreContent = $$(page.container).find('.infinite-scroll.threeMeetingsAndOneClassList');
			var loadMoreContent1 = $$(page.container).find('.infinite-scroll.threeMeetingsAndOneClassSearch');
			var loadMoreContent2 = $$(page.container).find('.infinite-scroll.threeMeetingsAndOneClassListSeason');
			var loadMoreContent3 = $$(page.container).find('.infinite-scroll.threeMeetingsAndOneClassListYear');
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
				searchPaper(searchContent,true);
			});
			loadMoreContent2.on('infinite', function() {
				
				if(loadingSeason) return;
				loadingSeason = true;
				pageSeason += 1;
				loadShykBySeason(true);
			});
			loadMoreContent3.on('infinite', function() {
				if(loadingYear) return;
				loadingYear = true;
				pageYear += 1;
				loadShykByYear(true);
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
			refreshThreeMeetingsAndOneClassPaper: refreshThreeMeetingsAndOneClassPaper,
			resetFirstIn: resetFirstIn,
		}
	});