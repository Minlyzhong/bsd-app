define(['app',
	'hbs!js/hbs/partyDynamicContent',
	'hbs!js/hbs/partyDynamicContentSeason',
	'hbs!js/hbs/partyDynamicContentYear'
], function(app, partyDynamicContent,partyDynamicContentSeason,partyDynamicContentYear) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//查询部门工作简报
	var loadPartyDynamicPath = app.basePath + '/mobile/partyAm/loadDeptPartyDynamicByDate';
	//查询子部门工作简报
	var loadPartyDynamicContentPath = app.basePath + '/mobile/partyAm/loadDynamicMessageByDate';
	//var loadPartyDynamicMonthContentPath = app.basePath + 'dynamic/loadMonthDynamicMessage';
	//var loadPartyDynamicSeasonContentPath = app.basePath + 'dynamic/loadQuarterDynamicMessage';
	//var loadPartyDynamicYearContentPath = app.basePath + 'dynamic/loadYearDynamicMessage';
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	var deptId = 0;
	var deptIdSeason = 0;
	var deptIdYear = 0;
	var deptIdSearch = 0;
	//月份
	var pickType = 0;
	var reorder = 0;
	//季度
	var pickTypeSeason = 0;
	var reorderSeason = 0;
	//年度
	var pickTypeYear = 0;
	var reorderYear = 0;
	//查询
	var pickTypeSearch = 0;
	var reorderSearch = 0;
	
	
	var deptName = '';
	var deptNameSeason = '';
	var deptNameYear = '';
	var deptNameSearch = '';
	var time = '';
	var timeType = 0;
	var titleBlockHtml = '';
	var titleBlockSeasonHtml = '';
	var titleBlockYearHtml = '';
	var titleBlockSearchHtml = '';
	var userId = 0;
	var userIdYear = 0;
	var userIdSeason = 0;
	var userIdSearch = 0;
	var khpl = 2;
	//搜索关键字
	var partyDynamicKey = '';
	
	//时间处理
	year = '';
	month = '';
	//月份
	var pDMonthStartTime = '';
	var pDMonthEndTime = '';
	//季度
	var pDSeasonStartTime = '';
	var pDSeasonEndTime = '';
	var season = '';
	var pagePDSeason = 1;
	var loadingPDSeason = true;
	var pDSeasonCount = 1;
	//年份
	var pDYearStartTime = '';
	var pDYearEndTime = '';
	var pagePDYear = 1;
	var loadingPDYear = true;
	var pDYearCount = 1;
	//查询
	var pDSearchStartTime = '';
	var pDSearchEndTime = '';
	var pagePDSearch = 1;
	var loadingPDSearch = true;
	//var pDSearchCount = 1;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('partyDynamic/partyDynamic', [
//			'contacts/contactsShowPeople',
//			'partyDynamic/partyDynamicDetail'
//		]);
//		if(firstIn) {
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		pushAndPull(page);
		handlePartyDynamicType();
		setTimeout(function(){
			console.log(page.query)
			if(page.query.deptId != undefined && page.query.deptName != undefined){
				itemClick1(page.query.deptName,page.query.deptId,page.query.parentDeptName,page.query.parentDeptId);
			}
		},1000);
		console.log(deptId);
		console.log(deptIdSeason);
		console.log(deptIdYear);
		loadPartyDynamic(0);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		deptId = app.user.deptId;
		deptIdSeason = app.user.deptId;
		deptIdYear = app.user.deptId;
		deptIdSearch = app.user.deptId;
		//月份
		pickType = 2;
		reorder = 0;
		//季度
		pickTypeSeason = 2;
		reorderSeason = 0;
		//年度
		pickTypeYear = 2;
		reorderYear = 0;
		//查询
		pickTypeSearch = 2;
		reorderSearch = 0;
		
		time = '本周';
		timeType = 0;
		
		
		deptName = '';
		deptNameSeason = '';
		deptNameYear = '';
		deptNameSearch = '';
		titleBlockHtml = '';
		titleBlockYearHtml = ''
		titleBlockSeasonHtml = ''
		titleBlockSearchHtml = ''
		userId = app.userId;
		userIdSeson = app.userId;
		userIdYear = app.userId;
		userIdSearch = app.userId;
		//月份
		pDMonthStartTime = '';
		pDMonthEndTime = '';
		//季度
		pDSeasonStartTime = '';
		pDSeasonEndTime = '';
		season = '';
		pagePDSeason = 1;
		loadingPDSeason = true;
		pDSeasonCount = 1;
		//年份
		pDYearStartTime = '';
		pDYearEndTime = '';
		pagePDYear = 1;
		loadingPDYear = true;
		pDYearCount = 1;
		//查询
		pDSearchStartTime = '';
		pDSearchEndTime = '';
		pagePDSearch = 1;
		loadingPDSearch = true;
		//pDYearCount = 1;
		khpl = 2;
		var str = '';
		str += '<div class="infinite-scroll-preloader">';
		str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
		str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
		str += '</div>';
		$$('.dynamicList ul').html(str);
		
		
		$$($$('.dynamicFilterContent')[3]).css({
			backgroundImage: 'url(./img/icon/orderDown.png)',
			color: '#ed4c3c',
		});
		$$($$('.dynamicFilterContentSeason')[3]).css({
			backgroundImage: 'url(./img/icon/orderDown.png)',
			color: '#ed4c3c',
		});
		$$($$('.dynamicFilterContentYear')[3]).css({
			backgroundImage: 'url(./img/icon/orderDown.png)',
			color: '#ed4c3c',
		});
		$$($$('.dynamicFilterContentSearch')[3]).css({
			backgroundImage: 'url(./img/icon/orderDown.png)',
			color: '#ed4c3c',
		});
		$$($$('.dynamicFilterContent')[3]).data('picker', 1);
		$$($$('.dynamicFilterContentSeason')[3]).data('pickerSeason', 1);
		$$($$('.dynamicFilterContentYear')[3]).data('pickerYear', 1);
		$$($$('.dynamicFilterContentSearch')[3]).data('pickerSearch', 1);
	}

	/**
	 * 读取缓存数据 
	 */
//	function loadStorage() {
//		$$('.titleBlock').html(titleBlockHtml);
//		var height = (titleBlockHtml.getCurrentHeight() / 30 * 33);
//		$$('.titleBlock').css('height', height == 0 ? height : (height + 5) + 'px');
//		$$('.titleContent').on('click', titleContentClick);
//		$$('.dynamicTime').html(time);
//		$$('.dynamicTime').data('type', timeType);
//		$$('.dynamicReportTime').html(time.substr(1));
//		handlePartyDynamic(pageDataStorage['partyDynamic']);
//		handlePartyDynamicContent(pageDataStorage['partyDynamicContent'], false);
//		$$.each($$('.dynamicFilterContent'), function(index, item) {
//			if($$(item).data('pickType') == pickType) {
//				$$(item).data('picker', '1');
//				if(reorder == 0) {
//					$$(item).css('background-image', 'url(./img/icon/orderDown.png)');
//				} else {
//					$$(item).css('background-image', 'url(./img/icon/orderUp.png)');
//				}
//				$$(item).css('color', '#ed4c3c');
//			}
//		});
//	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		$$('.pageTitle').html(page.query.appName);
		$$('.dynamicReportList .grid').css('font-size', ($(window).width() / 26) + 'px');
		$$('.dynamicReportList .grid span').css('font-size', ($(window).width() / 26) + 'px');
		$$('.dynamicReportName').html(deptName);
		$$('.dynamicDate').html(app.utils.getCurTime().split(' ')[0]);
		//当滑动的时候触发
		scroll(function(direction) {
			if(direction == 'up') {
				//$$('.dynamicFilter').css('margin-top','0px');
				//$$('.dynamicPage').css('margin-top','65px');
				$('.dynamicNav').slideDown(200);
			} else {
				//$$('.dynamicFilter').css('margin-top','0px');
				//$$('.dynamicPage').css('margin-top','56px');
				$('.dynamicNav').slideUp(200);
			} 
		});

		function scroll(fn) {
			var beforeScrollTop = $('.dynamicPage')[0].scrollTop,
				fn = fn || function() {};
			$('.dynamicPage')[0].addEventListener("scroll", function() {
				var afterScrollTop = $('.dynamicPage')[0].scrollTop,
					delta = afterScrollTop - beforeScrollTop,
					height = $('.dynamicPage').height();
				if(afterScrollTop >= 0 && afterScrollTop <= height) {
					beforeScrollTop = afterScrollTop;
				} else {
					delta = 0;
				}
				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
			}, false);
		}
		
		scrollSeason(function(direction) {
			if(direction == 'up') {
				//$$('.dynamicFilterSeason').css('margin-top','0px');
				//$$('.dynamicPageSeason').css('margin-top','0px');
				$('.dynamicNavSeason').slideDown(200);
			} else {
				//$$('.dynamicFilterSeason').css('margin-top','0px');
				//$$('.dynamicPageSeason').css('margin-top','0px');
				$('.dynamicNavSeason').slideUp(200);
			} 
		});

		function scrollSeason(fn) {
			var beforeScrollTop = $('.dynamicPageSeason')[0].scrollTop,
				fn = fn || function() {};
			$('.dynamicPageSeason')[0].addEventListener("scroll", function() {
				var afterScrollTop = $('.dynamicPageSeason')[0].scrollTop,
					delta = afterScrollTop - beforeScrollTop,
					height = $('.dynamicPageYear').height();
				if(afterScrollTop >= 0 && afterScrollTop <= height) {
					beforeScrollTop = afterScrollTop;
				} else {
					delta = 0;
				}
				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
			}, false);
		}
		scrollYear(function(direction) {
			if(direction == 'up') {
				//$$('.dynamicFilterYear').css('margin-top','0px');
				//$$('.dynamicPageYear').css('margin-top','50px');
				$('.dynamicNavYear').slideDown(200);
			} else {
				//$$('.dynamicFilterYear').css('margin-top','0px');
				//('.dynamicPageYear').css('margin-top','56px');
				$('.dynamicNavYear').slideUp(200);
			} 
		});

		function scrollYear(fn) {
			var beforeScrollTop = $('.dynamicPageYear')[0].scrollTop,
				fn = fn || function() {};
			$('.dynamicPageYear')[0].addEventListener("scroll", function() {
				var afterScrollTop = $('.dynamicPageYear')[0].scrollTop,
					delta = afterScrollTop - beforeScrollTop,
					height = $('.dynamicPageYear').height();
				if(afterScrollTop >= 0 && afterScrollTop <= height) {
					beforeScrollTop = afterScrollTop;
				} else {
					delta = 0;
				}
				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
			}, false);
		}
		
		scrollSearch(function(direction) {
			if(direction == 'up') {
				$$('.dynamicFilterSearch').css('margin-top','0px');
				$$('.dynamicPageSearch').css('margin-top','0px');
				$('.dynamicNavSearch').slideDown(200);
			} else {
				$$('.dynamicFilterSearch').css('margin-top','0px');
				$$('.dynamicPageSearch').css('margin-top','6px');
				$('.dynamicNavSearch').slideUp(200);
			} 
		});

		function scrollSearch(fn) {
			var beforeScrollTop = $('.dynamicPageSearch')[0].scrollTop,
				fn = fn || function() {};
			$('.dynamicPageSearch')[0].addEventListener("scroll", function() {
				var afterScrollTop = $('.dynamicPageSearch')[0].scrollTop,
					delta = afterScrollTop - beforeScrollTop,
					height = $('.dynamicPageSearch').height();
				if(afterScrollTop >= 0 && afterScrollTop <= height) {
					beforeScrollTop = afterScrollTop;
				} else {
					delta = 0;
				}
				if(delta === 0) return false;
				fn(delta > 0 ? "down" : "up");
			}, false);
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		//选择本周、本月、本季度、本年
		$$('.dynamicTime').on('click', timePicker);
		//选择人数、日志、考核次数、考核得分
		$$('.dynamicFilterContent').on('click', filterPicker);
		$$('.dynamicFilterContentSeason').on('click', filterPickerBySeason);
		$$('.dynamicFilterContentYear').on('click', filterPickerByYear);
		$$('.dynamicFilterContentSearch').on('click', filterPickerBySearch);
		//选择总人数、日志数量、考核次数、考核得分
		$$('.dynamicMonth .grid').on('click', gridClick);
		$$('.dynamicSeason .grid').on('click', gridClickBySeason);
		$$('.dynamicYear .grid').on('click', gridClickByYear);
		$$('.dynamicSearch .grid').on('click', gridClickBySearch);
		//点击查询input
		$$('#partyDynamicSearch').on('focus',function(){
			//$$('.partyDynamicSearch').css('display','block');
			$$('.dynamicListSearch ul').html('');
			$$(this).css('text-align', 'left');
			$$('.partyDynamicSearchBar .searchCancelBtn').css('display', 'block');
			$$('.partyDynamicsTab').css('display','none');
			$$('.dynamicNavSearch').css('display','block');
		});
		//点击取消按钮
		$$('.partyDynamicSearchBar .searchCancelBtn').on('click',function(){
			$$('.partyDynamicsTab').css('display','block');
			$$('.dynamicNavSearch').css('display','none');
			$$('#partyDynamicSearch').val("");
			//$('#partyDynamicContext').val();
			$$('#partyDynamicSearch').css('text-align', 'center');
			$$('.partyDynamicSearchBar .searchCancelBtn').css('display', 'none');
		});
		
//		$$('.partyDynamicSearch .partyDynamicSearchClose').on('click',function(){
//			$$('.partyDynamicSearch').css('display','none');
//			$$('#partyDynamicSearch').css('text-align', 'center');
//			$$('.partyDynamicSearchBar .searchCancelBtn').css('display', 'none');
//		});
		//在查询input输入文字触发keyup事件
		$$('#partyDynamicSearch').on('keyup', searchPartyDynamic);
		
		//$$('.partyDynamicSearch .searchBtn').on('click', keyupContent);
		
//		$$('.partyDynamicSearch .resetBtn').on('click', function(){
//			$$('#partyDynamicSearch').val("");
//			$('#partyDynamicContext').val();
//			
//		});

		//选择时间
		var result = [];
		var pickerDescribe;
		var pickerDescribeSeason;
		var pickerDescribeYear;
		//获取年份
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
			$$.each(result, function(index, item) {
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
		pDMonthStartTime = year+'-'+month+'-01';
		pDMonthEndTime = year+'-'+month+'-31';
		console.log(month)
		$$(".partyDynamicsTime").on('click',function(){
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
				$("#picker-describe").val(year+'年 '+ month+'月');
				pageNo = 1;
				loading = true;
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.dynamicList ul').html(str);
				pDMonthStartTime = year+'-'+month+'-01';
				pDMonthEndTime = year+'-'+month+'-31';
				loadPartyDynamic(0);
			});
		});
		
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			pDSeasonStartTime = year+'-01-01';
			pDSeasonEndTime = year+'-03-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			pDSeasonStartTime = year+'-04-01';
			pDSeasonEndTime = year+'-06-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			pDSeasonStartTime = year+'-07-01';
			pDSeasonEndTime = year+'-09-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			pDSeasonStartTime = year+'-10-01';
			pDSeasonEndTime = year+'-12-31';
		}
		$$(".partyDynamicsTimeSeason").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					pDSeasonStartTime = year+'-01-01';
					pDSeasonEndTime = year+'-03-31';
				}else if(season == '第二季度'){
					pDSeasonStartTime = year+'-04-01';
					pDSeasonEndTime = year+'-06-31';
				}else if(season == '第三季度'){
					pDSeasonStartTime = year+'-07-01';
					pDSeasonEndTime = year+'-09-31';
				}else if(season == '第四季度'){
					pDSeasonStartTime = year+'-10-01';
					pDSeasonEndTime = year+'-12-31';
				}
				$("#picker-describeSeason").val(year+'年 '+ season);
				pagePDSeason = 1;
				loadingPDSeason = true;
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.dynamicListSeason ul').html(str);
				loadPartyDynamicBySeason(0);
			});
		});
		
		//年份时间判断
		$("#picker-describeYear").val(year+'年 ');
		pDYearStartTime= year+'-01-01';
		pDYearEndTime= year+'-12-31';
		$$(".partyDynamicsTimeYear").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				pDYearStartTime= year+'-01-01';
				pDYearEndTime= year+'-12-31';
				$("#picker-describeYear").val(year+'年 ');
				pagePDYear = 1;
				loadingPDYear= true;
				var str = '';
				str += '<div class="infinite-scroll-preloader">';
				str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
				str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
				str += '</div>';
				$$('.dynamicListYear ul').html(str);
				loadPartyDynamicByYear(0);
			});
		});
		
		//点击tab标签
		//月份
		$$('.buttonShyk').on('click',function(){
			khpl = 2;
			setTimeout(function(){
				//$$('.').css('display','block');
				//$$('.').css('display','none');
				//$$('.').css('display','none');
			},100);
			
			if($$('.partyDynamicsTab').css('display') == 'none'){
				setTimeout(function(){
					
					searchPartyDynamic();
				},100);
			}
		});
		//季度
		$$('.buttonShykSeason').on('click',function(){	
			khpl = 1;

			if($$('.partyDynamicsTab').css('display') == 'none'){
				setTimeout(function(){
					searchPartyDynamic();
				},100);
			}else{
				setTimeout(function(){
					if(pDSeasonCount == 1){
						var str = '';
						str += '<div class="infinite-scroll-preloader">';
						str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
						str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
						str += '</div>';
						$$('.dynamicListSeason ul').html(str);
						pDSeasonCount += 1;
						loadPartyDynamicBySeason(0);
					}
				},100);
			}
		});
		//年份
		$$('.buttonShykYear').on('click',function(){
			khpl = 0;			
			if($$('.partyDynamicsTab').css('display') == 'none'){
				setTimeout(function(){
					searchPartyDynamic();
				},100);
			}else{
				setTimeout(function(){
					if(pDYearCount == 1){
						var str = '';
						str += '<div class="infinite-scroll-preloader">';
						str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
						str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
						str += '</div>';
						$$('.dynamicListYear ul').html(str);
						pDYearCount += 1;
						loadPartyDynamicByYear(0);
					}
				},100);
			}
		});
	}
	
	
	//搜索条件
	function searchPartyDynamic(){
		var str = '';
		str += '<div class="infinite-scroll-preloader">';
		str += '<div class="preloader" style="left:35%;margin-left:0px;margin-top:0px;position:absolute;"></div>';
		str += '<div style="position: absolute;left: 45%;;font-size: 17px;">加载中...</div>';
		str += '</div>';
		$$('.dynamicListSearch ul').html(str);
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(monthClassName){
			pDSearchStartTime = pDMonthStartTime;
			pDSearchEndTime = pDMonthEndTime;
		}else if(seasonClassName){
			pDSearchStartTime = pDSeasonStartTime;
			pDSearchEndTime = pDSeasonEndTime;
		}else if(yearClassName){
			pDSearchStartTime = pDYearStartTime;
			pDSearchEndTime = pDYearEndTime;
		}
		keyupContent();
	}
	/*
	 * 在查询input输入文字触发keyup事件
	 */
	function keyupContent(){
		console.log('keyupContent');
		partyDynamicKey = $('#partyDynamicSearch').val();
		//$$('.partyDynamicSearch').css('display','none');
		//partyDynamicKey = $('#partyDynamicContext').val();
		loadPartyDynamicBySearch(0);
	}
	
	/**
	 *  加载查询类型
	 */
	function handlePartyDynamicType() {
		//年份类型
		$$("#partyDynamicYear").append("<option value='2017' selected>2017 </option>");
		$$("#partyDynamicYear").append("<option value='2018' >2018</option>");
		$$('#partyDynamicYear').change(function() {});
		
		//季度类型
		$$("#partyDynamicSeason").append("<option value='0' selected>第一季度 </option>");
		$$("#partyDynamicSeason").append("<option value='1' >第二季度 </option>");
		$$("#partyDynamicSeason").append("<option value='3' >第三季度  </option>");
		$$("#partyDynamicSeason").append("<option value='4' >第四季度  </option>");
		$$('#partyDynamicSeason').change(function() {});
	}
	/**
	 * 导航标签点击事件 (月份)
	 */
	function titleContentClick() {
		var index = $$(this).index();
		deptId = $$(this).data('deptId');
		deptName = $$(this).html();
		$$('.dynamicReportName').html(deptName);
		var parentHtml = $$(this).parent().find('.titleContent');
		console.log(parentHtml);
		$$.each(parentHtml, function(key, val) {
			if(key >= index) {
				val.remove();
			}
		});
		titleBlockHtml = $$('.titleBlock').html();
		console.log(titleBlockHtml);
		var height = (titleBlockHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlock').css('height', height == 0 ? height : (height + 5) + 'px');
		loadPartyDynamic(0);
	}
	/**
	 * 导航标签点击事件 (季度)
	 */
	function titleContentClickBySeason() {
		var index1 = $$(this).index();
		deptIdSeason = $$(this).data('deptId');
		deptNameSeason = $$(this).html();
		$$('.dynamicReportNameSeason').html(deptNameSeason);
		var parentHtml1 = $$(this).parent().find('.titleContentSeason');
		console.log(parentHtml1);
		$$.each(parentHtml1, function(key, val) {
			if(key >= index1) {
				val.remove();
			}
		});
		titleBlockSeasonHtml = $$('.titleBlockSeason').html();
		console.log(titleBlockSeasonHtml);
		var height = (titleBlockSeasonHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlockSeason').css('height', height == 0 ? height : (height + 5) + 'px');
		loadPartyDynamicBySeason(0);
	}
	/**
	 * 导航标签点击事件 (年度)
	 */
	function titleContentClickByYear() {
		var index2 = $$(this).index();
		deptIdYear = $$(this).data('deptId');
		deptNameYear = $$(this).html();
		$$('.dynamicReportNameYear').html(deptNameYear);
		var parentHtml2 = $$(this).parent().find('.titleContentYear');
		console.log(parentHtml2);
		$$.each(parentHtml2, function(key, val) {
			if(key >= index2) {
				val.remove();
			}
		});
		titleBlockYearHtml = $$('.titleBlockYear').html();
		console.log(titleBlockYearHtml);
		var height = (titleBlockYearHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlockYear').css('height', height == 0 ? height : (height + 5) + 'px');
		loadPartyDynamicByYear(0);
	}
	/**
	 * 导航标签点击事件 (查询)
	 */
	function titleContentClickBySearch() {
		var index3 = $$(this).index();
		deptIdSearch = $$(this).data('deptId');
		deptNameSearch = $$(this).html();
		$$('.dynamicReportNameYear').html(deptNameSearch);
		var parentHtml3 = $$(this).parent().find('.titleContentSearch');
		console.log(parentHtml3);
		$$.each(parentHtml3, function(key, val) {
			if(key >= index3) {
				val.remove();
			}
		});
		titleBlockSearchHtml = $$('.titleBlockSearch').html();
		console.log(titleBlockSearchHtml);
		var height = (titleBlockSearchHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlockSearch').css('height', height == 0 ? height : (height + 5) + 'px');
		loadPartyDynamicBySearch(0);
	}

	/**
	 * 时间选择器 
	 */
	function timePicker() {
		var clickedLink = this;
		var popoverHTML = '<div class="popover" style="width: 30%;">' +
			'<div class="popover-inner">' +
			'<div class="list-block dynamicPopover">' +
			'<ul>' +
			'<li><a href="#" data-type="0">本周</a></li>' +
			'<li><a href="#" data-type="1">本月</a></li>' +
			'<li><a href="#" data-type="2">本季度</a></li>' +
			'<li><a href="#" data-type="3">本年度</a></li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		var popover = app.myApp.popover(popoverHTML, clickedLink);
		$$('.dynamicPopover li a').on('click', function() {
			app.myApp.closeModal(popover);
		});
		$$('.dynamicPopover li').on('click', function() {
			if($$(this).find('a').html() != $$('.dynamicTime').html()) {
				time = $$(this).find('a').html()
				$$('.dynamicTime').html(time);
				$$('.dynamicReportTime').html(time.substr(1));
				timeType = $$(this).find('a').data('type');
				$$('.dynamicTime').data('type', timeType);
				loadPartyDynamic(timeType);
			}
		});
	}

	/**
	 * 部门详情按钮(月份)
	 */
	function gridClick() {
		var type = parseInt($$(this).data('type'));
		var count = parseInt($$($$(this).find('span')[0]).html());
		console.log(type+'/'+count)
		if(!count) {
			app.myApp.alert('暂无数据！');
			return;
		}
		switch(type) {
			case 0:
				app.myApp.getCurrentView().loadPage('contactsShowPeople.html?deptName=' + deptName + '&deptId=' + deptId + '&type=partyDynamic');
				break;
			case 1:
				var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptId + '&deptName=' + deptName + '&detailType=workLog&startDate='+pDMonthStartTime+'&endDate='+pDMonthEndTime+'&khpl='+perKhpl);
				break;
			case 2:
			case 3:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptId + '&deptName=' + deptName + '&detailType=assessment&startDate='+pDMonthStartTime+'&endDate='+pDMonthEndTime+'&khpl='+perKhpl);
				break;
			default:
				break;
		}
	}
	/**
	 * 部门详情按钮(季度)
	 */
	function gridClickBySeason() {
		var type = parseInt($$(this).data('type'));
		var count = parseInt($$($$(this).find('span')[0]).html());
		if(!count) {
			app.myApp.alert('暂无数据！');
			return;
		}
		switch(type) {
			case 0:
				app.myApp.getCurrentView().loadPage('contactsShowPeople.html?deptName=' + deptNameSeason + '&deptId=' + deptIdSeason+ '&type=partyDynamic');
				break;
			case 1:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptIdSeason + '&deptName=' + deptNameSeason + '&detailType=workLog&startDate='+pDSeasonStartTime+'&endDate='+pDSeasonEndTime+'&khpl='+perKhpl);
				break;
			case 2:
			case 3:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptIdSeason + '&deptName=' + deptNameSeason + '&detailType=assessment&startDate='+pDSeasonStartTime+'&endDate='+pDSeasonEndTime+'&khpl='+perKhpl);
				break;
			default:
				break;
		}
	}
	/**
	 * 部门详情按钮(年度)
	 */
	function gridClickByYear() {
		var type = parseInt($$(this).data('type'));
		var count = parseInt($$($$(this).find('span')[0]).html());
		if(!count) {
			app.myApp.alert('暂无数据！');
			return;
		}
		switch(type) {
			case 0:
				app.myApp.getCurrentView().loadPage('contactsShowPeople.html?deptName=' + deptNameYear + '&deptId=' + deptIdYear+ '&type=partyDynamic');
				break;
			case 1:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptIdYear + '&deptName=' + deptNameYear + '&detailType=workLog&startDate='+pDYearStartTime+'&endDate='+pDYearEndTime+'&khpl='+perKhpl);
				break;
			case 2:
			case 3:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptIdYear + '&deptName=' + deptNameYear + '&detailType=assessment&startDate='+pDYearStartTime+'&endDate='+pDYearEndTime+'&khpl='+perKhpl);
				break;
			default:
				break;
		}
	}
	
	/**
	 * 部门详情按钮(年度)
	 */
	function gridClickBySearch() {
		var type = parseInt($$(this).data('type'));
		var count = parseInt($$($$(this).find('span')[0]).html());
		if(!count) {
			app.myApp.alert('暂无数据！');
			return;
		}
		switch(type) {
			case 0:
				app.myApp.getCurrentView().loadPage('contactsShowPeople.html?deptName=' + deptNameSearch + '&deptId=' + deptIdSearch+ '&type=partyDynamic');
				break;
			case 1:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptIdSearch + '&deptName=' + deptNameSearch + '&detailType=workLog&startDate='+pDSearchStartTime+'&endDate='+pDSearchEndTime+'&khpl='+perKhpl);
				break;
			case 2:
			case 3:
					var perKhpl = parseInt($$(this).data('khpl'));
				app.myApp.getCurrentView().loadPage('partyDynamicDetail.html?dateType=' + $$('.dynamicTime').data('type') + '&deptId=' + deptIdSearch + '&deptName=' + deptNameSearch + '&detailType=assessment&startDate='+pDSearchStartTime+'&endDate='+pDSearchEndTime+'&khpl='+perKhpl);
				break;
			default:
				break;
		}
	}

	/*
	 * 排序选择器(月份)
	 */
	function filterPicker() {
		$$('.dynamicPage').scrollTop(0);
		pageNo = 1;
		var picker = $$(this).data('picker');
		pickType = $$(this).data('pickType');
		console.log(pickType);
		console.log(picker);
		if(picker == 1) {
			var imageAttr = $$(this).css('background-image').split('/');
			imageAttr = imageAttr[imageAttr.length - 1];
			if(imageAttr.indexOf('orderDown') > -1) {
				$$(this).css('background-image', 'url(./img/icon/orderUp.png)');
				reorder = 1;
			} else {
				$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
				reorder = 0;
			}
		} else {
			$$('.dynamicFilterContent').data('picker', '0');
			$$('.dynamicFilterContent').css('background-image', '');
			$$('.dynamicFilterContent').css('color', 'black');
			$$(this).data('picker', '1');
			$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
			$$(this).css('color', '#ed4c3c');
			reorder = 0;
		}
		console.log("$$('.dynamicTime').data('type')");
		console.log($$('.dynamicTime').data('type'));
		//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
		loadPartyDynamicContent(false);
	}
	
	/*
	 * 排序选择器(季度)
	 */
	function filterPickerBySeason() {
		$$('.dynamicPageSeason').scrollTop(0);
		pagePDSeason = 1;
		var pickerSeason = $$(this).data('pickerSeason');
		pickTypeSeason = $$(this).data('pickTypeSeason');
		console.log(pickerSeason);
		console.log(pickTypeSeason);
		if(pickerSeason == 1) {
			var imageAttrSeason = $$(this).css('background-image').split('/');
			imageAttrSeason = imageAttrSeason[imageAttrSeason.length - 1];
			if(imageAttrSeason.indexOf('orderDown') > -1) {
				$$(this).css('background-image', 'url(./img/icon/orderUp.png)');
				reorderSeason = 1;
			} else {
				$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
				reorderSeason = 0;
			}
		} else {
			$$('.dynamicFilterContentSeason').data('pickerSeason', '0');
			$$('.dynamicFilterContentSeason').css('background-image', '');
			$$('.dynamicFilterContentSeason').css('color', 'black');
			$$(this).data('pickerSeason', '1');
			$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
			$$(this).css('color', '#ed4c3c');
			reorderSeason = 0;
		}
		//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
		loadPartyDynamicContentBySeason(false);
	}
	
	/*
	 * 排序选择器(年度)
	 */
	function filterPickerByYear() {
		$$('.dynamicPageYear').scrollTop(0);
		pagePDYear = 1;
		var pickerYear = $$(this).data('pickerYear');
		pickTypeYear = $$(this).data('pickTypeYear');
		console.log(pickerYear);
		console.log(pickTypeYear);
		if(pickerYear == 1) {
			var imageAttrYear = $$(this).css('background-image').split('/');
			imageAttrYear = imageAttrYear[imageAttrYear.length - 1];
			if(imageAttrYear.indexOf('orderDown') > -1) {
				$$(this).css('background-image', 'url(./img/icon/orderUp.png)');
				reorderYear = 1;
			} else {
				$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
				reorderYear = 0;
			}
		} else {
			$$('.dynamicFilterContentYear').data('pickerYear', '0');
			$$('.dynamicFilterContentYear').css('background-image', '');
			$$('.dynamicFilterContentYear').css('color', 'black');
			$$(this).data('pickerYear', '1');
			$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
			$$(this).css('color', '#ed4c3c');
			reorderYear = 0;
		}
		//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
		loadPartyDynamicContentByYear(false);
	}
	/*
	 * 排序选择器(查询)
	 */
	function filterPickerBySearch() {
		$$('.dynamicPageSearch').scrollTop(0);
		pagePDSearch = 1;
		var pickerSearch = $$(this).data('pickerSearch');
		pickTypeSearch = $$(this).data('pickTypeSearch');
		console.log(pickerSearch);
		console.log(pickTypeSearch);
		if(pickerSearch == 1) {
			var imageAttrSearch = $$(this).css('background-image').split('/');
			imageAttrSearch = imageAttrSearch[imageAttrSearch.length - 1];
			if(imageAttrSearch.indexOf('orderDown') > -1) {
				$$(this).css('background-image', 'url(./img/icon/orderUp.png)');
				reorderSearch = 1;
			} else {
				$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
				reorderSearch = 0;
			}
		} else {
			$$('.dynamicFilterContentSearch').data('pickerSearch', '0');
			$$('.dynamicFilterContentSearch').css('background-image', '');
			$$('.dynamicFilterContentSearch').css('color', 'black');
			$$(this).data('pickerSearch', '1');
			$$(this).css('background-image', 'url(./img/icon/orderDown.png)');
			$$(this).css('color', '#ed4c3c');
			reorderSearch = 0;
		}
		//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
		loadPartyDynamicContentBySearch(false);
	}

	/**
	 * 获取部门工作简报(月份)
	 * @param {Object} dateType 0:week; 1:month, 2:season, 3:year
	 * @param {Object} deptId 部门ID
	 */
	function loadPartyDynamic(dateType) {
		console.log(deptId);
		console.log(dateType);
		console.log(pDMonthStartTime);
		console.log(pDMonthEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicPath, {
			// dateType: dateType,
			deptId: deptId,
			khpl:2,
			// userId: userId,
			startDate:pDMonthStartTime,
			endDate:pDMonthEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyDynamic'] = data.data;
			handlePartyDynamic(data.data);
			pageNo = 1;
			//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
			loadPartyDynamicContent(false);
		});
	}

	/**
	 * 加载部门工作简报(月份)
	 * @param {Object} data
	 */
	function handlePartyDynamic(data) {
		userId = 0;
		$$('.detialPoint').html(data.detialPoint);
		$$('.detialTotal').html(data.detialTotal);
		$$('.people').html(data.people);
		$$('.workTotal').html(data.workTotal);
		deptId = data.deptId;
		deptName = data.deptName;
		$$('.dynamicReportName').html(deptName);
	}
	/**
	 * 获取部门工作简报(季度)
	 * @param {Object} dateType 0:week; 1:month, 2:season, 3:year
	 * @param {Object} deptId 部门ID
	 */
	function loadPartyDynamicBySeason(dateType) {
		console.log(dateType);
		console.log(deptIdSeason);
		console.log(pDSeasonStartTime);
		console.log(pDSeasonEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicPath, {
			// dateType: dateType,
			deptId: deptIdSeason,
			// userId: userIdSeson,
			khpl:1,
			startDate:pDSeasonStartTime,
			endDate:pDSeasonEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyDynamicSeason'] = data.data;
			handlePartyDynamicBySeason(data.data);
			pagePDSeason = 1;
			loadingPDSeason = true;
			//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
			loadPartyDynamicContentBySeason(false);
		});
	}

	/**
	 * 加载部门工作简报(季度)
	 * @param {Object} data
	 */
	function handlePartyDynamicBySeason(data) {
		userIdSeson = 0;
		$$('.detialPointSeason').html(data.detialPoint);
		$$('.detialTotalSeason').html(data.detialTotal);
		$$('.peopleSeason').html(data.people);
		$$('.workTotalSeason').html(data.workTotal);
		deptIdSeason = data.deptId;
		deptNameSeason = data.deptName;
		$$('.dynamicReportNameSeason').html(deptNameSeason);
	}
	/**
	 * 获取部门工作简报(年度)
	 * @param {Object} dateType 0:week; 1:month, 2:season, 3:year
	 * @param {Object} deptId 部门ID
	 */
	function loadPartyDynamicByYear(dateType) {
		console.log(dateType);
		console.log(pDYearStartTime);
		console.log(pDYearEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicPath, {
			// dateType: dateType,
			deptId: deptIdYear,
			khpl:0,
			// userId: userIdYear,
			startDate:pDYearStartTime,
			endDate:pDYearEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyDynamicSeason'] = data.data;
			handlePartyDynamicByYear(data.data);
			pagePDYear = 1;
			loadingPDYear = true;
			//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
			loadPartyDynamicContentByYear(false);
		});
	}

	/**
	 * 加载部门工作简报(年度)
	 * @param {Object} data
	 */
	function handlePartyDynamicByYear(data) {
		userIdYear = 0;
		$$('.detialPointYear').html(data.detialPoint);
		$$('.detialTotalYear').html(data.detialTotal);
		$$('.peopleYear').html(data.people);
		$$('.workTotalYear').html(data.workTotal);
		deptIdYear = data.deptId;
		deptNameYear = data.deptName;
		$$('.dynamicReportNameYear').html(deptNameYear);
	}
	
	/**
	 * 获取部门工作简报(查询)
	 * @param {Object} dateType 0:week; 1:month, 2:season, 3:year
	 * @param {Object} deptId 部门ID
	 */
	function loadPartyDynamicBySearch(dateType) {
		console.log(dateType);
		console.log(pDSearchStartTime);
		console.log(pDSearchEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicPath, {
			khpl: khpl,
			deptId: deptIdSearch,
			// userId: userIdSearch,
			startDate:pDSearchStartTime,
			endDate:pDSearchEndTime,
		}, function(data) {
			console.log(data);
			pageDataStorage['partyDynamicSearch'] = data.data;
			handlePartyDynamicBySearch(data.data);
			pagePDSearch = 1;
			loadingPDSearch = true;
			//loadPartyDynamicContent($$('.dynamicTime').data('type'), false);
			loadPartyDynamicContentBySearch(false);
		});
	}

	/**
	 * 加载部门工作简报(年度)
	 * @param {Object} data
	 */
	function handlePartyDynamicBySearch(data) {
		userIdSearch = 0;
		$$('.detialPointSearch').html(data.detialPoint);
		$$('.detialTotalSearch').html(data.detialTotal);
		$$('.peopleSearch').html(data.people);
		$$('.workTotalSearch').html(data.workTotal);
		deptIdSearch = data.deptId;
		deptNameSearch = data.deptName;
		console.log('khpl---'+khpl)
		if(khpl == 0){
			$$('.dynamicReportTimeSearch').html('年');
		}else if(khpl == 1){
			$$('.dynamicReportTimeSearch').html('季');
		}else{
			$$('.dynamicReportTimeSearch').html('月');
		}
		$$('.dynamicReportNameSearch').html(deptNameSearch);
	}

	/**
	 *  获取子部门工作简报(月份)
	 * @param {Object} dateType 0:本周 1:本月 2:本季度
	 */
//	function loadPartyDynamicContent(dateType, isLoadMore) {
	function loadPartyDynamicContent(isLoadMore) {
//		var loadPath = '';
//		if(dateType == 0) {
//			loadPath = loadPartyDynamicContentPath;
//		} else if(dateType == 1) {
//			loadPath = loadPartyDynamicMonthContentPath;
//		} else if(dateType == 2) {
//			loadPath = loadPartyDynamicSeasonContentPath;
//		} else {
//			loadPath = loadPartyDynamicYearContentPath;
//		}
		partyDynamicKey='';
		console.log('deptId:'+deptId);
		console.log(pDMonthStartTime);
		console.log(pDMonthEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicContentPath, {
			deptId: deptId,
			sortType: pickType,
			current: pageNo,
			reorder: reorder,
			// userId: userId,
			khpl: 2,
			// queryByDeptName : partyDynamicKey,
			startDate:pDMonthStartTime,
			endDate:pDMonthEndTime,
		}, function(data) {
			$$.each(data, function(_, item) {
				item.pickType = pickType;
			});
			console.log(data);
			var data = data.data.records;
			if(!isLoadMore) {
				pageDataStorage['partyDynamicContent'] = data;
			} else {
				pageDataStorage['partyDynamicContent'] = pageDataStorage['partyDynamicContent'].concat(data);
			}
			handlePartyDynamicContent(data, isLoadMore);
		});
	}

	/**
	 * 加载子部门工作简报(月份)
	 * @param {Object} data
	 */
	function handlePartyDynamicContent(data, isLoadMore) {
		$$('.partyDynamicNotFound').hide();
		if(data.length > 0) {
			if(data.length == 10) {
				loading = false;
			}
			if(!isLoadMore) {
				$$('.dynamicList ul').html(partyDynamicContent(data));
				if(data.length < 7) {
					$$('.dynamicPage').css({
						paddingBottom: (15 + (6 - data.length) * 102) + 'px',
						marginBottom: (-15 - (6 - data.length) * 102) + 'px',
					});
				} else {
					$$('.dynamicPage').css({
						paddingBottom: '15px',
						marginBottom: '-15px',
					});
				}
			} else {
				$$('.dynamicList ul').append(partyDynamicContent(data));
			}
			//off() 方法通常用于移除通过 on() 方法添加的事件处理程序。
			setTimeout(function(){
				$$('.dynamicList .item-content').off('click', itemClick);
				$$('.dynamicList .item-content').on('click', itemClick);
			},100)
		} else {
			if(!isLoadMore) {
				$$('.dynamicList ul').html("");
				$$('.partyDynamicNotFound').show();
			}
		}
	}
	
	/**
	 *  获取子部门工作简报(季度)
	 * @param {Object} dateType 0:本周 1:本月 2:本季度
	 */
	function loadPartyDynamicContentBySeason(isLoadMore) {
		partyDynamicKey="";
		console.log(pDSeasonStartTime);
		console.log(pDSeasonEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicContentPath, {
			deptId: deptIdSeason,
			sortType: pickTypeSeason,
			current: pagePDSeason,
			reorder: reorderSeason,
			khpl: 1,
			// userId:userIdSeason,
			// queryByDeptName : partyDynamicKey,
			startDate:pDSeasonStartTime,
			endDate:pDSeasonEndTime,
		}, function(data) {
			var data = data.data.records;
			$$.each(data, function(_, item) {
				item.pickTypeSeason = pickTypeSeason;
			});
			console.log(data);
			if(!isLoadMore) {
				pageDataStorage['partyDynamicContentSeason'] = data;
			} else {
				pageDataStorage['partyDynamicContentSeason'] = pageDataStorage['partyDynamicContentSeason'].concat(data);
			}
			handlePartyDynamicContentBySeason(data, isLoadMore);
		});
	}

	/**
	 * 加载子部门工作简报(季度)
	 * @param {Object} data
	 */
	function handlePartyDynamicContentBySeason(data, isLoadMore) {

		$$('.partyDynamicNotFound').hide();
		if(data.length > 0) {
			if(data.length == 10) {
				loadingPDSeason = false;
			}
			if(!isLoadMore) {
				$$('.dynamicListSeason ul').html(partyDynamicContentSeason(data));
				if(data.length < 7) {
					$$('.dynamicPageSeason').css({
						paddingBottom: (15 + (6 - data.length) * 102) + 'px',
						marginBottom: (-15 - (6 - data.length) * 102) + 'px',
					});
				} else {
					$$('.dynamicPageSeason').css({
						paddingBottom: '15px',
						marginBottom: '-15px',
					});
				}
			} else {
				$$('.dynamicListSeason ul').append(partyDynamicContentSeason(data));
			}
			//off() 方法通常用于移除通过 on() 方法添加的事件处理程序。
			setTimeout(function(){
				$$('.dynamicListSeason .item-content').off('click', itemClickBySeason);
				$$('.dynamicListSeason .item-content').on('click', itemClickBySeason);
			},100);
		} else {
			if(!isLoadMore) {
				$$('.dynamicListSeason ul').html("");
				$$('.partyDynamicNotFound').show();
			}
		}
	}
	
	/**
	 *  获取子部门工作简报(年份)
	 * @param {Object} dateType 0:本周 1:本月 2:本季度
	 */
	function loadPartyDynamicContentByYear(isLoadMore) {
		console.log(pDYearStartTime);
		console.log(pDYearEndTime);
		app.ajaxLoadPageContent(loadPartyDynamicContentPath, {
			deptId: deptIdYear,
			sortType: pickTypeYear,
			current: pagePDYear,
			reorder: reorderYear,
			// userId: userIdYear,
			khpl: 0,
			query : partyDynamicKey,
			startDate:pDYearStartTime,
			endDate:pDYearEndTime,
		}, function(data) {
			var data = data.data.records;
			$$.each(data, function(_, item) {
				item.pickTypeYear = pickTypeYear;
			});
			console.log(data);
			if(!isLoadMore) {
				pageDataStorage['partyDynamicContentYear'] = data;
			} else {
				pageDataStorage['partyDynamicContentYear'] = pageDataStorage['partyDynamicContentYear'].concat(data);
			}
			handlePartyDynamicContentByYear(data, isLoadMore);
		});
	}

	/**
	 * 加载子部门工作简报(年份)
	 * @param {Object} data
	 */
	function handlePartyDynamicContentByYear(data, isLoadMore) {
		$$('.partyDynamicNotFound').hide();
		if(data.length > 0) {
			if(data.length == 10) {
				loadingPDYear = false;
			}
			if(!isLoadMore) {
				$$('.dynamicListYear ul').html(partyDynamicContentYear(data));
				if(data.length < 7) {
					$$('.dynamicPageYear').css({
						paddingBottom: (15 + (6 - data.length) * 102) + 'px',
						marginBottom: (-15 - (6 - data.length) * 102) + 'px',
					});
				} else {
					$$('.dynamicPageYear').css({
						paddingBottom: '15px',
						marginBottom: '-15px',
					});
				}
			} else {
				$$('.dynamicListYear ul').append(partyDynamicContentYear(data));
			}
			//off() 方法通常用于移除通过 on() 方法添加的事件处理程序。
			setTimeout(function(){
				$$('.dynamicListYear .item-content').off('click', itemClickByYear);
				$$('.dynamicListYear .item-content').on('click', itemClickByYear);
			},100)
		} else {
			if(!isLoadMore) {
				$$('.dynamicListYear ul').html("");
				$$('.partyDynamicNotFound').show();
			}
		}
	}
	/**
	 *  获取子部门工作简报(查询)
	 * @param {Object} dateType 0:本周 1:本月 2:本季度
	 */
	function loadPartyDynamicContentBySearch(isLoadMore) {
		console.log(pDSearchStartTime);
		console.log(pDSearchEndTime);
		console.log(khpl);
		console.log("$$('.dynamicTime').data('type')");
		console.log($$('.dynamicTime').data('type'));
		app.ajaxLoadPageContent(loadPartyDynamicContentPath, {
			deptId: deptIdSearch,
			sortType: pickTypeSearch,
			current: pagePDSearch,
			reorder: reorderSearch,
			// userId: userIdSearch,
			khpl : khpl,
			query : partyDynamicKey,
			startDate:pDSearchStartTime,
			endDate:pDSearchEndTime,
		}, function(data) {
			var data = data.data.records;
			$$.each(data, function(_, item) {
				item.pickTypeYear = pickTypeSearch;
			});
			console.log(data);
			if(!isLoadMore) {
				console.log('1')
				pageDataStorage['partyDynamicContentSearch'] = data;
			} else {
				console.log('2')
				pageDataStorage['partyDynamicContentSearch'] = pageDataStorage['partyDynamicContentSearch'].concat(data);
			}
			handlePartyDynamicContentBySearch(data, isLoadMore);
		});
	}

	/**
	 * 加载子部门工作简报(查询)
	 * @param {Object} data
	 */
	function handlePartyDynamicContentBySearch(data, isLoadMore) {
		$$('.partyDynamicNotFoundSearch').hide();
		if(data.length > 0) {
			if(data.length == 10) {
				loadingPDSearch = false;
			}
			if(!isLoadMore) {
				$$('.dynamicListSearch ul').html(partyDynamicContentYear(data));
				if(data.length < 7) {
					$$('.dynamicPageSearch').css({
						paddingBottom: (15 + (6 - data.length) * 102) + 'px',
						marginBottom: (-15 - (6 - data.length) * 102) + 'px',
					});
				} else {
					$$('.dynamicPageSearch').css({
						paddingBottom: '15px',
						marginBottom: '-15px',
					});
				}
			} else {
				$$('.dynamicListSearch ul').append(partyDynamicContentYear(data));
			}
			//off() 方法通常用于移除通过 on() 方法添加的事件处理程序。
			setTimeout(function(){
				$$('.dynamicListSearch .item-content').off('click', itemClickBySearch);
				$$('.dynamicListSearch .item-content').on('click', itemClickBySearch);
			},100)
		} else {
			if(!isLoadMore) {
				$$('.dynamicListSearch ul').html("");
				$$('.partyDynamicNotFoundSearch').show();
			}
		}
	}
	//月份
	function itemClick() {
		//点击部门清除搜索框的key值
		console.log('月份');
		partyDynamicKey = '';
		$$('.dynamicPage').scrollTop(0);
		console.log($$('.dynamicReportName').html());
		var html = '<span class="titleContent" data-deptId="' + deptId + '">' + $$('.dynamicReportName').html() + '</span>';
		$$('.titleBlock').append(html);
		titleBlockHtml = $$('.titleBlock').html();
		var height = (titleBlockHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlock').css('height', height == 0 ? height : (height + 5) + 'px');
		setTimeout(function(){
			$$('.titleContent').off('click', titleContentClick);
			$$('.titleContent').on('click', titleContentClick);
		},100);
		
		var _deptId = $$(this).data('deptId');
		deptId = _deptId;
		deptName = $$(this).find('.dynamicContentTitle').html();
		$$('.dynamicReportName').html(deptName);
		console.log($$('.dynamicReportName').html());
		console.log(deptId);
		console.log(deptName);
		loadPartyDynamic(0);
	}
	//季度
	function itemClickBySeason() {
		//点击部门清除搜索框的key值
		console.log('季度');
		partyDynamicKey = '';
		$$('.dynamicPageSeason').scrollTop(0);
		console.log($$('.dynamicReportNameSeason').html());
		var html = '<span class="titleContentSeason" data-deptId="' + deptIdSeason + '">' + $$('.dynamicReportNameSeason').html() + '</span>';
		$$('.titleBlockSeason').append(html);
		titleBlockSeasonHtml = $$('.titleBlockSeason').html();
		var height = (titleBlockSeasonHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlockSeason').css('height', height == 0 ? height : (height + 5) + 'px');
		setTimeout(function(){
			$$('.titleContentSeason').off('click', titleContentClickBySeason);
			$$('.titleContentSeason').on('click', titleContentClickBySeason);
		},100);
		var _deptId = $$(this).data('deptId');
		deptIdSeason = _deptId;
		deptNameSeason = $$(this).find('.dynamicContentTitle').html();
		$$('.dynamicReportNameSeason').html(deptNameSeason);
		console.log($$('.dynamicReportNameSeason').html());
		console.log(deptIdSeason);
		console.log(deptNameSeason);
		//loadPartyDynamic($$('.dynamicTime').data('type'));
		loadPartyDynamicBySeason(0);
	}
	//年度
	function itemClickByYear() {
		console.log('年度');
		//点击部门清除搜索框的key值
		partyDynamicKey = '';
		$$('.dynamicPageYear').scrollTop(0);
		console.log($$('.dynamicReportNameYear').html());
		var html = '<span class="titleContentYear" data-deptId="' + deptIdYear + '">' + $$('.dynamicReportNameYear').html() + '</span>';
		$$('.titleBlockYear').append(html);
		titleBlockYearHtml = $$('.titleBlockYear').html();
		var height = (titleBlockYearHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlockYear').css('height', height == 0 ? height : (height + 5) + 'px');
		setTimeout(function(){
			$$('.titleContentYear').off('click', titleContentClickByYear);
			$$('.titleContentYear').on('click', titleContentClickByYear);
		},100);
		var _deptId = $$(this).data('deptId');
		deptIdYear = _deptId;
		deptNameYear = $$(this).find('.dynamicContentTitle').html();
		$$('.dynamicReportNameYear').html(deptNameYear);
		console.log($$('.dynamicReportNameYear').html());
		console.log(deptIdYear);
		console.log(deptNameYear);
		//loadPartyDynamic($$('.dynamicTime').data('type'));
		loadPartyDynamicByYear(0);
	}
	//查询
	function itemClickBySearch() {
		console.log('查询');
		//点击部门清除搜索框的key值
		partyDynamicKey = '';
		$$('.dynamicPageSearch').scrollTop(0);
		
		
		console.log($$('.dynamicReportNameSearch').html());

		var html = '<span class="titleContentSearch" data-deptId="' + deptIdSearch + '">' + $$('.dynamicReportNameSearch').html() + '</span>';
	
		$$('.titleBlockSearch').append(html);

		titleBlockSearchHtml = $$('.titleBlockSearch').html();
		var height = (titleBlockSearchHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlockSearch').css('height', height == 0 ? height : (height + 5) + 'px');
		setTimeout(function(){
			$$('.titleContentSearch').off('click', titleContentClickBySearch);
			$$('.titleContentSearch').on('click', titleContentClickBySearch);
		},100);
		var _deptId = $$(this).data('deptId');
		deptIdSearch = _deptId;
		deptNameSearch = $$(this).find('.dynamicContentTitle').html();
		$$('.dynamicReportNameSearch').html(deptNameYear);
		console.log($$('.dynamicReportNameSearch').html());
		console.log(deptIdSearch);
		console.log(deptNameSearch);
		console.log($$('.dynamicTime').data('type'));
		//loadPartyDynamic($$('.dynamicTime').data('type'));

		loadPartyDynamicBySearch(0);
	}
	
	function itemClick1(deptName1,deptId1,parentDeptName,parentDeptId) {
		//点击部门清除搜索框的key值
		console.log(parentDeptName);
		console.log(parentDeptId);
		partyDynamicKey = '';
		$$('.dynamicPage').scrollTop(0);
		if(deptId1 != 1){
			var html = '<span class="titleContent" data-deptId="' + parentDeptId + '">' + parentDeptName + '</span>';
			$$('.titleBlock').append(html);
			titleBlockHtml = $$('.titleBlock').html();
		}
		
		var height = (titleBlockHtml.getCurrentHeight() / 30 * 33);
		$$('.titleBlock').css('height', height == 0 ? height : (height + 5) + 'px');
		$$('.titleContent').off('click', titleContentClick);
		$$('.titleContent').on('click', titleContentClick);
		deptId = deptId1;
		deptName = deptName1;
		console.log(deptId);
		console.log(deptName);
		$$('.dynamicReportName').html(deptName);
		loadPartyDynamic(0);
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.dynamicPage');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			loadPartyDynamicContent(true);
		});
		var loadMoreContent1 = $$(page.container).find('.infinite-scroll.dynamicPageSeason');
		loadMoreContent1.on('infinite', function() {
			if(loadingPDSeason) return;
			loadingPDSeason = true;
			pagePDSeason += 1;
			loadPartyDynamicContentBySeason(true);
		});
		var loadMoreContent2 = $$(page.container).find('.infinite-scroll.dynamicPageYear');
		loadMoreContent2.on('infinite', function() {
			if(loadingPDYear) return;
			loadingPDYear = true;
			pagePDYear += 1;
			loadPartyDynamicContentByYear(true);
		});
		var loadMoreContent3 = $$(page.container).find('.infinite-scroll.dynamicPageSearch');
		loadMoreContent3.on('infinite', function() {
			if(loadingPDSearch) return;
			loadingPDSearch = true;
			pagePDSearch += 1;
			loadPartyDynamicContentBySearch(true);
		});
	}

	String.prototype.getCurrentHeight = function(font) {
		var f = font || '13px arial',
			o = $('<div>' + this + '</div>')
			.css({
				'position': 'absolute',
				'float': 'left',
				'white-space': 'nowrap',
				'visibility': 'hidden',
				'font': f
			})
			.appendTo($('body')),
			w = o.height();

		o.remove();
		return w;
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