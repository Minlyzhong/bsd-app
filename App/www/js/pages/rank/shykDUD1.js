define(['app',
	'hbs!js/hbs/shykUD',
	'hbs!js/hbs/shykD',
], function(app, shykUDTemplate,shykDTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	var pageNo3 = 1;
	var loading3 = true;
	var pageNo4 = 1;
	var loading4 = true;
	//获取年份
	var getYearsPath = 	app.basePath + '/mobile/partyAm/getYears';
	//获取党委下面已完成未完成的支部
	var getOneDepartmentCompletionStatusPath = 	app.basePath + '/mobile/partyAm/getOneDepartmentCompletionStatus';
	//获取三会一课分类
	var getAllThreeAndOnePath = app.basePath + 'knowledgeTopic/findThreePlusXTopic';
	var queryByDeptName1 = '';
	var year="";
	var year1="";
	var month="";
	var month1="";
	var udCount = 0;
	var dCount = 0;
	var startDate = '';
	var endDate = '';
	var deptId = 0;
	//0是未参与1是已参与
	var type=1;
	var deptN = ''
	var topicId = 0;
	//季度时间
	var dudSeasonStartDate = '';
	var dudSeasonEndDate = '';
	var season = '';
	var dudSeasonCount = 1;
	var udSeasonCount = 0;
	var pagedudSeason = 1
	var loadingdudSeason = true;
	var pageudSeason = 1
	var loadingudSeason = true;
	//年份时间
	var dudYearStartDate = '';
	var dudYearEndDate = '';
	var dudYearCount = 1;
	var udYearCount = 0;
	var pagedudYear = 1
	var loadingdudYear = true;
	var pageudYear = 1
	var loadingudYear = true;
	//查询
	var dudStartDate = '';
	var dudEndDate = '';
	var dSearchCount = 1;
	var udSearchCount = 0;
	
	var countHead = '';
	var uDoneHead = '';

	var monthDoneHead = 0;
	var monthUDoneHead = 0;
	var seasonDoneHead = 0;
	var seasonUDoneHead = 0;
	var yearDoneHead = 0;
	var yearUDoneHead = 0;

	var khpl;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page);
		clickEvent(page);
		$$($$('.atdjdTab div')[0]).addClass('active');
		app.back2Home();
	}

	/**
	 * 初始化模块变量
	 */
	function initData(page) {
		khpl = 2;
		queryByDeptName1 = ''
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		pageNo3 = 1;
		loading3 = true;
		pageNo4 = 1;
		loading4 = true;
		year="";
		year1="";
		month="";
		month1="";
		type=1;
		topicId = 0;
		deptId = app.user.deptId;
		if(deptN){
			deptN = page.query.deptName;
		}else{
			deptN = app.userDetail.deptName;
		}
		
		//月份
		startDate = "";
		endDate="";
		udCount = 0;
		dCount = 0;

		monthDoneHead = -1;
		monthUDoneHead = -1;
		seasonDoneHead = -1;
		seasonUDoneHead = -1;
		yearDoneHead = -1;
		yearUDoneHead = -1;
		//查询
		dSearchCount = 1;
		udSearchCount = 0;
		dudStartDate = '';
		dudEndDate = '';
		$$(".shykdN").html('('+deptN+')三会一课考核统计');
		if(page.query.deptId != undefined){
			deptId = page.query.deptId;
		}
		if(page.query.startDate != undefined){
			startDate = page.query.startDate;
		}
		if(page.query.endDate != undefined){
			endDate = page.query.endDate;
		}
		//季度时间
		dudSeasonStartDate = '';
		dudSeasonEndDate = '';
		season = '';
		dudSeasonCount = 1;
		udSeasonCount = 0;
		pagedudSeason = 1
		loadingdudSeason = true;
		pageudSeason = 1
		loadingudSeason = true;
		//年份时间
		dudYearStartDate = '';
		dudYearEndDate = '';
		dudYearCount = 1;
		udYearCount = 0;
		pagedudYear = 1
		loadingdudYear = true;
		pageudYear = 1
		loadingudYear = true;
		
		countHead = '';
		uDoneHead = '';
		//方法
		pushAndPull(page);
		loadTime();	
		// loadSort();
		loadshykD(false);
		
		
		
	}
	
	
	// function loadSort(){		
	// 	app.ajaxLoadPageContent(getAllThreeAndOnePath, {
	// 	}, function(data) {
	// 		console.log(data);
	// 		handleSort(data);
	// 	});
	// }
	
	function handleSort(data){
//		$$("#shykSearchType").append("<option value='全部' selected>sddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</option>");
		$.each(data,function(index,item){
				$$("#shykSearchType").append("<option value="+item.id+">"+item.title+"</option>");
		});
		$$('#shykSearchType').change(function() {
			
		});
	}
	/*
	 * 显示日期
	 */
	function loadTime(){	
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
				$$.each(data.data, function(index, item) {
						result[index] = item.toString()+'年';
				});
			console.log(result);
			pickerDescribe = app.myApp.picker({
	    		input: '#picker-describeOther',
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
	    		input: '#picker-describeSeasonOther',
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
	    		input: '#picker-describeYearOther',
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
		startDate = year+'-'+month+'-01';
		endDate = year+'-'+month+'-31';
		$$(".shykdudTimeMonth").on('click',function(){
			setTimeout(function(){
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
					udCount = 0;
       				dCount = 0;
					year = pickerDescribe.value[0].substring(0,pickerDescribe.value[0].length-1);
					month = pickerDescribe.value[1].substring(0,pickerDescribe.value[1].length-1);
					$("#picker-describe").val(year+'年 '+ month+'月');
					startDate = year+'-'+month+'-01';
					endDate = year+'-'+month+'-31';
					if(type==1){
						loadshykD(false);
					}else{
						loadshykUD(false);
					}
				});
			},100);
		});
		
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			dudSeasonStartDate = year+'-01-01';
			dudSeasonEndDate = year+'-03-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			dudSeasonStartDate = year+'-04-10';
			dudSeasonEndDate = year+'-06-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			dudSeasonStartDate = year+'-07-01';
			dudSeasonEndDate = year+'-09-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			dudSeasonStartDate = year+'-10-01';
			dudSeasonEndDate = year+'-12-31';
		}
		$$(".shykdudTimeSeason").on('click',function(){
			setTimeout(function(){
				pickerDescribeSeason.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					dudSeasonCount = 1;
        			udSeasonCount = 0;
					year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
					season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
					if(season == '第一季度'){
						dudSeasonStartDate = year+'-01-01';
						dudSeasonEndDate = year+'-03-31';
					}else if(season == '第二季度'){
						dudSeasonStartDate = year+'-04-01';
						dudSeasonEndDate = year+'-06-31';
					}else if(season == '第三季度'){
						dudSeasonStartDate = year+'-07-01';
						dudSeasonEndDate = year+'-09-31';
					}else if(season == '第四季度'){
						dudSeasonStartDate = year+'-10-01';
						dudSeasonEndDate = year+'-12-31';
					}
					$("#picker-describeSeason").val(year+'年 '+ season);
					if(type==1){
						loadshykDBySeason(false);
					}else{
						loadshykUDBySeason(false);
					}
				});
			},100);
		});
		
		//年份时间判断
		$("#picker-describeYear").val(year+'年 ');
		dudYearStartDate= year+'-01-01';
		dudYearEndDate= year+'-12-31';
		$$(".shykdudTimeYear").on('click',function(){
			setTimeout(function(){
				pickerDescribeYear.open();
				$$('.picker-3d .close-picker').text('完成');
				$$('.toolbar-inner .right').css('margin-right','20px');	
				$$('.picker-3d .close-picker').on('click',function(){
					dudYearCount = 1;
        			udYearCount = 0;
					year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
					dudYearStartDate= year+'-01-01';
					dudYearEndDate= year+'-12-31';
					$("#picker-describeYear").val(year+'年 ');
					if(type==1){
						loadshykDByYear(false);
					}else{
						loadshykUDByYear(false);
					}
				});
			},100);
		});
		
		
		//点击tab标签
		//月份
		$$('.shykdudSelect .buttonShyk').on('click',function(){
			khpl = 2;
			console.log(monthDoneHead);
			console.log(monthUDoneHead);
			console.log(type);
			console.log($$('.shykdudTab').css('display') == 'none');

			$$('.alrdone').html();
			$$('.uDone').html();

			if($$('.shykdudTab').css('display') == 'none'){
				if(type==1){
					searchshykD(false);

				}else{
					searchshykUD(false);
				}
			}else{
				setTimeout(function(){
					if(type==1){
						if(dCount == 1){
							loadshykD(false);
							 dCount += 1;
						}else{
							if(monthDoneHead != -1){
								$$('.alrdone').html('('+monthDoneHead+')');
							}
							if(monthUDoneHead != -1){
								$$('.uDone').html('('+monthUDoneHead+')');
							}
						}

					}else{
						if(udCount == 0){
							loadshykUD(false);
							udCount += 1;
						}else{
							if(monthDoneHead != -1){
								$$('.alrdone').html('('+monthDoneHead+')');
							}
							if(monthUDoneHead != -1){
								$$('.uDone').html('('+monthUDoneHead+')');
							}
						}
					}
					
				},100);
			}
			
				
		});
		//季度
		$$('.shykdudSelect .buttonShykSeason').on('click',function(){
			khpl = 1;

			console.log(type);
			console.log(seasonDoneHead);
			console.log(seasonUDoneHead);
			console.log($$('.shykdudTab').css('display') == 'none');

			$$('.alrdone').html();
			$$('.uDone').html();

			if($$('.shykdudTab').css('display') == 'none'){
				if(type==1){
					searchshykD(false);
				}else{
					searchshykUD(false);
				}
			}else{
				setTimeout(function(){
					if(type==1){
						if(dudSeasonCount == 1){
							loadshykDBySeason(false);
							dudSeasonCount += 1;
						}else{
							if(seasonDoneHead != -1){
								$$('.alrdone').html('('+seasonDoneHead+')');
							}
							if(seasonUDoneHead != -1){
								$$('.uDone').html('('+seasonUDoneHead+')');
							}
						}
					}else{
						if(udSeasonCount == 0){
							loadshykUDBySeason(false);
							udSeasonCount += 1;
						}else{
							if(seasonDoneHead != -1){
								$$('.alrdone').html('('+seasonDoneHead+')');
							}
							if(seasonUDoneHead != -1){
								$$('.uDone').html('('+seasonUDoneHead+')');
							}
						}
					}
				},100);
			}
		});
		//年份
		$$('.shykdudSelect .buttonShykYear').on('click',function(){
			khpl = 0;
			console.log(yearDoneHead);
			console.log(yearUDoneHead);
			console.log(type);

			$$('.alrdone').html();
			$$('.uDone').html();

			console.log($$('.shykdudTab').css('display') == 'none');
			if($$('.shykdudTab').css('display') == 'none'){
				if(type==1){
					searchshykD(false);
				}else{
					searchshykUD(false);
				}
			}else{
				setTimeout(function(){
					if(type==1){
						if(dudYearCount == 1){
							loadshykDByYear(false);
							dudYearCount += 1;
						}else{
							if(yearDoneHead != -1){
								$$('.alrdone').html('('+yearDoneHead+')');
							}
							if(yearUDoneHead != -1){
								$$('.uDone').html('('+yearUDoneHead+')');
							}
						}
					}else{
						if(udYearCount == 0){
							loadshykUDByYear(false);
							dudYearCount += 1;
						}else{
							if(yearDoneHead != -1){
								$$('.alrdone').html('('+yearDoneHead+')');
							}
							if(yearUDoneHead != -1){
								$$('.uDone').html('('+yearUDoneHead+')');
							}
						}
					}
				},100);
			}
		});
	}
	/**
	 * 点击事件
	 */
	function clickEvent(page) {	
		$$('.atdjdTab div').on('click', tabClick);
		
		$$('.shykuduSearchBar #shykuduSearch').on('focus',startSearch);
		
		$$('.shykdudSearchBox .searchBtn').on('click',keyupContent);
		
		$$('.shykdudSearchBox .resetBtn').on('click',clearSearchList);
		
		$$('.shykdudSearchClose').on('click',function(){
			$$('.shykdudSearchBox').css('display','none');
		});
		$$('.shykuduSearchBar .searchCancelBtn').on('click',hideSearchList1);
	}
	
	
	//查询
	function startSearch(){
		$$('.shykdudTab').css('display','none');
		$$(this).css('text-align', 'left');
		$$('.shykuduSearchBar .searchCancelBtn').css('display','block');
		$$('.shykdudSearchBox').css('display','block');
		
		$$('.shykDSearch').css('margin-top','-10px');
		$$('.shykUDSearch').css('margin-top','-10px');
		$$('.abc').css('margin-top','47px');
		$$('.atdjdTab').css('margin-top','10px');
//		$$('.shykD').css('display','none');
//		$$('.shykUD').css('display','none');
		console.log(type);
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(monthClassName){
			khpl = 2;
			dudStartDate = startDate;
			dudEndDate = endDate;
		}else if(seasonClassName){
			khpl = 1;
			dudStartDate = dudSeasonStartDate;
			dudEndDate = dudSeasonEndDate;
		}else if(yearClassName){
			khpl = 0;
			dudStartDate = dudYearStartDate;
			dudEndDate = dudYearEndDate;
		}
		if(type == 1){
			$$('.shykUDSearch').css('display','none');
			$$('.shykDSearch').css('display','block');
		}else{
			$$('.shykUDSearch').css('display','block');
			$$('.shykDSearch').css('display','none');
		}
		
		
	}
	
	//tab切换
	function tabClick() {
		$$('.atdjdTab div').removeClass('active');
		$$(this).addClass('active');
		var index = $$(this).data('index');
		$$('.shykUDSearch').css('display','none');
		$$('.shykDSearch').css('display','none');
		//hideSearchList1();
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(index == '0') {
//			$$('.shykD').css('display', 'block');
//			$$('.shykUD').css('display', 'none');
			type = 1;
			$$('.shykUDSearch').css('display','none');
			$$('.shykDSearch').css('display','block');

			$$('.shykD').css('display','block');
			$$('.shykUD').css('display','none');
			$$('.shykDSeason').css('display','block');
			$$('.shykUDSeason').css('display','none');
			$$('.shykDYear').css('display','block');
			$$('.shykUDYear').css('display','none');
			if(monthClassName){
				if($$('.shykdudTab').css('display') == 'none'){
					searchshykD(false);
				}else{
					if(dCount == 0){
						loadshykD(false);
						dCount += 1;
					}
				}	
			}else if(seasonClassName){
				if($$('.shykdudTab').css('display') == 'none'){
					searchshykD(false);
				}else{
					if(dudSeasonCount == 1){
						loadshykDBySeason(false);
						dudSeasonCount += 1;
					}
				}
			}else if(yearClassName){
				if($$('.shykdudTab').css('display') == 'none'){
					searchshykD(false);
				}else{
					if(dudYearCount == 1){
						loadshykDByYear(false);
						dudYearCount += 1;
					}
				}
			}	
		} else {
			type = 0;
			$$('.shykUDSearch').css('display','block');
			$$('.shykDSearch').css('display','none');

			$$('.shykD').css('display','none');
			$$('.shykUD').css('display','block');
			$$('.shykDSeason').css('display','none');
			$$('.shykUDSeason').css('display','block');
			$$('.shykDYear').css('display','none');
			$$('.shykUDYear').css('display','block');
			if(monthClassName){
				if($$('.shykdudTab').css('display') == 'none'){
					searchshykUD(false);
				}else{
					if(udCount == 0){
						loadshykUD(false);
						udCount += 1;
					}
				}
			}else if(seasonClassName){
				if($$('.shykdudTab').css('display') == 'none'){
					searchshykUD(false);
				}
				else{
					if(udSeasonCount == 0){
						loadshykUDBySeason(false);
						udSeasonCount += 1;
					}
				}
			}else if(yearClassName){
				if($$('.shykdudTab').css('display') == 'none'){
					searchshykUD(false);
				}
				else{
					if(udYearCount == 0){
						loadshykUDByYear(false);
						udYearCount += 1;
					}
				}
			}
					
		}
	}
	/*
	 * 点击取消按钮
	 */
	function hideSearchList1(){
		queryByDeptName1 = '';
		topicId = 0;
		$$('.shykuduSearchBar #shykuduSearch').css('text-align', 'center');
		$$('.shykuduSearchBar .searchCancelBtn').css('display','none');
		$$('.shykdudTab').css('display','block');
		$$('.alrdone').html('('+countHead+')');
		$$('.uDone').html('('+uDoneHead+')');
		$$('.atdjdTab').css('margin-top','40px');
		$$('.abc').css('margin-top','77px');
		$$('.shykUDSearch').css('margin-top','40px');
		$$('.shykDSearch').css('margin-top','40px');
		
		
//		$$('.shykUDSearch').css('display','none');
//		$$('.shykDSearch').css('display','none');
//		$$('.shykUDNotFound').css('display','none');
//		$$('.shykDNotFound').css('display','none');
//		if(type==1){
//			console.log('完成');
//			$$('.shykD').css('display','block');
//			$$('.shykUD').css('display','none');
//		}else{
//			console.log('未完成');
//			$$('.shykD').css('display','none');
//			$$('.shykUD').css('display','block');
//		}	
	}
	/*
	 * 点击q清空按钮
	 */
	function clearSearchList(){
		queryByDeptName1 = '';
//		startDate='';
//		endDate='';
		topicId = 0;
		dudStartDate='';
		dudEndDate='';
		$$('#shykDeptName').val('');
		$$('#shykStartTime').val('');
		$$('#shykEndTime').val('');
	}
	/*
	 * keyup事件的触发
	 */
	function keyupContent(){
//		if($$("#shykStartTime").val() == '' && $$("#shykEndTime").val() != ''){
//			app.myApp.alert('请选择开始时间！');
//			return;
//		}
//		if($$("#shykEndTime").val() == '' && $$("#shykStartTime").val() != ''){
//			app.myApp.alert('请选择结束时间！');
//			return;
//		}
//		console.log(year);
//		console.log(year1);
//		if(year > year1){
//			app.myApp.alert('开始年份必须小于结束年份！');
//			return;
//		}else if(year == year1 && month>month1){
//			app.myApp.alert('开始月份必须小于结束月份！');
//			return;
//		}else if(year != year1){
//			app.myApp.alert('月份跨度不能大于12个月！');
//			return;
//		}
		topicId = $$('#shykSearchType').val()
		queryByDeptName1 = $$('#shykDeptName').val();
		$$('.shykdudSearchBox').css('display','none');
		console.log(queryByDeptName1);
		console.log(dudStartDate);
		console.log(dudEndDate);
		if(type==1){
			searchshykD(false);
		}else{
			searchshykUD(false);
		}
		
		
	}
	
	//已完成支部(月份)
	function loadshykD(isLoadMore) {
		console.log(startDate);
		console.log(endDate);
		console.log(type);
		console.log(topicId);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pageNo,
			startDate:startDate,
			endDate:endDate,
			// topicId:topicId,
			khpl:2
		}, function(result) {
			console.log(result);
			var data = result.data;
			console.log(data.records == '');
			if(data.records == ''){
				$$('.alrdone').html('(0)');
				countHead = '0';
				monthDoneHead='0';
				$$('.infinite-scroll-preloader').remove();
			}else{
				monthDoneHead = data.total;
				countHead = data.total;
				$$('.alrdone').html('('+data.total+')');
			}	
			setTimeout(function(){
				handleCompletedStatus(data.records, isLoadMore);
			},100);
		});
	}
	
	/*
	 * 处理各级党委部门下的支部完成情况(月份)
	 */
	function handleCompletedStatus(data,isLoadMore){
		console.log(data);
		if(data.length == 0 && pageNo == 1){
			$$('.shykD .kpi-a-list ul').html("");
		}
		if(data.length == 0){
			$$('.infinite-scroll-preloader').remove();
			//$$('.shykD .kpi-a-list ul').html("");
		}
		if(data){
			if(data.length) {
				if(isLoadMore) {
					$$('.infinite-scroll-preloader').remove();
					$$('.shykD .kpi-a-list ul').append(shykDTemplate(data));
				} else {
					$$('.shykD .kpi-a-list ul').html(shykDTemplate(data));
				}
				if(data.length<10 && pageNo == 1){
					$$('.infinite-scroll-preloader').remove();
				}
				$$('.shykD .item-content').on('click',function(){
					console.log('已参与');
					app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&deptId='+$$(this).data('id')+'&topicId='+topicId+'&branchName='+$$(this).data('name')+'&startTime='+startDate+'&endTime='+endDate+'&khpl=2');
				});
				$$('.infinite-scroll-preloader').remove();
				loading = false;
			} else {
				loading = true;
			}
		}
	}
	//未完成支部(月份)
	function loadshykUD(isLoadMore) {
		console.log(type);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pageNo1,
			startDate:startDate,
			endDate:endDate,
			// topicId:topicId,
			khpl:2
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == ''){
				$$('.uDone').html('(0)');
				uDoneHead = '0';
				monthUDoneHead = '0';
				$$('.infinite-scroll-preloader').remove();
			}else{
				uDoneHead = data.total;
				monthUDoneHead = data.total;
				$$('.uDone').html('('+data.total+')');
			}
			setTimeout(function(){
				handleUCompletedStatus(data.records,isLoadMore);
			},100)
		});
	}
	//月份
	function handleUCompletedStatus(data,isLoadMore){
		console.log('未完成月份');
		if(data.length == 0 && pageNo1 == 1){
			$$('.shykUD .kpi-a-list ul').html("");
		}
		if(data.length == 0){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data){
			if(data.length) {
				if(isLoadMore) {
					$$('.infinite-scroll-preloader').remove();
					$$('.shykUD .kpi-a-list ul').append(shykUDTemplate(data));
				} else {
					$$('.shykUD .kpi-a-list ul').html(shykUDTemplate(data));
				}
				if(data.length<10 && pageNo1 == 1){
					$$('.infinite-scroll-preloader').remove();
				}
				$$('.shykUD .item-content').on('click',function(){
					console.log('未参与');
				});
				loading1 = false;
			} else {
				loading1 = true;
			}
		}
	}
	//已完成支部(季度)
	function loadshykDBySeason(isLoadMore) {
		console.log(dudSeasonStartDate);
		console.log(dudSeasonEndDate);
		console.log(type);
		console.log(topicId);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pagedudSeason,
			startDate:dudSeasonStartDate,
			endDate:dudSeasonEndDate,
			// topicId:topicId,
			khpl:1
		}, function(result) {
			console.log(result);
			var dataSeason = result.data;
			console.log(result == '');
			if(dataSeason.records == ''){
				$$('.alrdone').html('(0)');
				countHead = '0';
				seasonDoneHead = '0';
				$$('.infinite-scroll-preloader').remove();
			}else{
				countHead = dataSeason.total;
				seasonDoneHead = dataSeason.total;
				$$('.alrdone').html('('+dataSeason.total+')');
			}	
			setTimeout(function(){
				handleCompletedStatusBySeason(dataSeason.records,isLoadMore);
			},100);
		});
	}
	/*
	 * 处理各级党委部门下的支部完成情况(季度)
	 */
	function handleCompletedStatusBySeason(dataSeason,isLoadMore){
		if(dataSeason.length == 0 && pagedudSeason == 1){
			$$('.shykDSeason .kpi-a-list ul').html("");
		}
		if(dataSeason.length == 0){
			$$('.infinite-scroll-preloader').remove();
			//$$('.shykDSeason .kpi-a-list ul').html("");
		}
		if(dataSeason){
			if(dataSeason.length) {
				if(isLoadMore) {
					$$('.infinite-scroll-preloader').remove();
					$$('.shykDSeason .kpi-a-list ul').append(shykDTemplate(dataSeason));
				} else {
					$$('.shykDSeason .kpi-a-list ul').html(shykDTemplate(dataSeason));
				}
				if(dataSeason.length<10 && pagedudSeason == 1){
					$$('.infinite-scroll-preloader').remove();
				}
				$$('.shykDSeason .item-content').on('click',function(){
					console.log('已参与');
					app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&deptId='+$$(this).data('id')+'&topicId='+topicId+'&branchName='+$$(this).data('name')+'&startTime='+dudSeasonStartDate+'&endTime='+dudSeasonEndDate+'&khpl=1');
				});
				loadingdudSeason = false;
			} else {
				loadingdudSeason = true;
			}
		}
	}
	//未完成支部(季度)
	function loadshykUDBySeason(isLoadMore) {
		console.log(dudSeasonStartDate);
		console.log(dudSeasonEndDate);
		console.log(type);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pageudSeason,
			startDate:dudSeasonStartDate,
			endDate:dudSeasonEndDate,
			// topicId:topicId,
			khpl:1
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == ''){
				$$('.uDone').html('(0)');
				uDoneHead = '0';
				seasonUDoneHead = '0';
				$$('.infinite-scroll-preloader').remove();
			}else{
				uDoneHead = data.total;
				seasonUDoneHead = data.total;
				$$('.uDone').html('('+data.total+')');
			}
			setTimeout(function(){
				handleUCompletedStatusBySeason(data.records,isLoadMore);
			},100);
		});
	}
	//季度
	function handleUCompletedStatusBySeason(data,isLoadMore){
		console.log('未完成季度');
		if(data.length == 0 && pageudSeason == 1){
			$$('.shykUDSeason .kpi-a-list ul').html("");
		}
		if(data.length == 0){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data){
			if(data.length) {
				if(isLoadMore) {
					$$('.infinite-scroll-preloader').remove();
					$$('.shykUDSeason .kpi-a-list ul').append(shykUDTemplate(data));
				} else {
					$$('.shykUDSeason .kpi-a-list ul').html(shykUDTemplate(data));
				}
				if(data.length<10 && pageudSeason == 1){
					$$('.infinite-scroll-preloader').remove();
				}
				$$('.shykUDSeason .item-content').on('click',function(){
					console.log('未参与');
				});
				loadingudSeason = false;
			} else {
				loadingudSeason = true;
			}
		}
	}
	//已完成支部(年度)
	function loadshykDByYear(isLoadMore) {
		console.log(dudYearStartDate);
		console.log(dudYearEndDate);
		console.log(type);
		console.log(topicId);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pagedudYear,
			startDate:dudYearStartDate,
			endDate:dudYearEndDate,
			// topicId:topicId,
			khpl:0
		}, function(result) {
			console.log(result);
			var dataYear = result.data;
			console.log(result == '');
			if(dataYear.records == ''){
				$$('.alrdone').html('(0)');
				countHead = '0';
				yearDoneHead = '0';
				$$('.infinite-scroll-preloader').remove();
			}else{
				countHead = dataYear.total;
				yearDoneHead = dataYear.total;
				$$('.alrdone').html('('+dataYear.total+')');
			}	
			setTimeout(function(){
				handleCompletedStatusByYear(dataYear.records,isLoadMore);
			},100);
		});
	}
	/*
	 * 处理各级党委部门下的支部完成情况(年度)
	 */
	function handleCompletedStatusByYear(dataYear,isLoadMore){
		if(dataYear.length == 0 && pagedudYear == 1){
			$$('.shykDYear .kpi-a-list ul').html("");
		}
		if(dataYear.length == 0){
			$$('.infinite-scroll-preloader').remove();
			//$$('.shykDYear .kpi-a-list ul').html("");
		}
		if(dataYear){
			if(dataYear.length) {
				if(isLoadMore) {
					$$('.infinite-scroll-preloader').remove();
					$$('.shykDYear .kpi-a-list ul').append(shykDTemplate(dataYear));
				} else {
					$$('.shykDYear .kpi-a-list ul').html(shykDTemplate(dataYear));
				}
				if(dataYear.length<10 && pagedudSeason == 1){
					$$('.infinite-scroll-preloader').remove();
				}
				$$('.shykDYear .item-content').on('click',function(){
					console.log('已参与');
					app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&deptId='+$$(this).data('id')+'&topicId='+topicId+'&branchName='+$$(this).data('name')+'&startTime='+dudYearStartDate+'&endTime='+dudYearEndDate+'&khpl=0');
				});
				loadingdudYear = false;
			} else {
				loadingdudYear = true;
			}
		}
	}
	//未完成支部(年度)
	function loadshykUDByYear(isLoadMore) {
		console.log(dudYearStartDate);
		console.log(dudYearEndDate);
		console.log(type);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			current:pageudYear,
			startDate:dudYearStartDate,
			endDate:dudYearEndDate,
			// topicId:topicId,
			khpl:0
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == ''){
				$$('.uDone').html('(0)');
				uDoneHead = '0';
				yearUDoneHead = '0';
				$$('.infinite-scroll-preloader').remove();
			}else{
				uDoneHead = data.total;
				yearUDoneHead = data.total;
				$$('.uDone').html('('+data.total+')');
			}
			setTimeout(function(){
				handleUCompletedStatusByYear(data.records,isLoadMore);
			},100);
		});
	}
	//年度
	function handleUCompletedStatusByYear(data,isLoadMore){
		console.log('未完成年度');
		if(data.length == 0 && pageudYear == 1){
			$$('.shykUDYear .kpi-a-list ul').html("");
		}
		if(data.length == 0){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data){
			if(data.length) {
				if(isLoadMore) {
					$$('.infinite-scroll-preloader').remove();
					$$('.shykUDYear .kpi-a-list ul').append(shykUDTemplate(data));
				} else {
					$$('.shykUDYear .kpi-a-list ul').html(shykUDTemplate(data));
				}
				if(data.length<10 && pageudSeason == 1){
					$$('.infinite-scroll-preloader').remove();
				}
				$$('.shykUDYear .item-content').on('click',function(){
					console.log('未参与');
				});
				loadingudYear = false;
			} else {
				loadingudYear = true;
			}
		}
	}
	
	//已完成支部
	function searchshykD(isLoadMore) {
		console.log(dudStartDate);
		console.log(dudEndDate);
		console.log(type);
		console.log(topicId);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			query:queryByDeptName1,
			current:pageNo3,
			startDate:dudStartDate,
			endDate:dudEndDate,
			// topicId:topicId,
			khpl:khpl
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == ''){
				$$('.alrdone').html('(0)');;
				$$('.infinite-scroll-preloader').remove();
			}else{
				$$('.alrdone').html('('+data.total+')');
			}
			SearchCompletedStatus(data.records,isLoadMore,khpl);
		});
	}
	/*
	 * 处理各级党委部门下的支部完成情况
	 */
	function SearchCompletedStatus(data,isLoadMore,khpl){
		console.log(data)
		if(data == "" && pageNo3 == 1){
			$$('.shykDSearch .kpi-a-list ul').html("");
			$$('.shykDNotFound').css('display','block');
		}
		if(data == ""){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data.length) {
			if(isLoadMore) {
				$$('.infinite-scroll-preloader').remove();
				$$('.shykDSearch .kpi-a-list ul').append(shykDTemplate(data));
			} else {
				$$('.shykDSearch .kpi-a-list ul').html(shykDTemplate(data));
			}
			if(data.length<10 && pageNo3 == 1){
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.shykDSearch .item-content').on('click',function(){
				console.log('已参与查询');
				app.myApp.getCurrentView().loadPage('threeMeetingsAndOneClassD.html?type=1&deptId='+$$(this).data('id')+'&startTime='+dudStartDate+'&endTime='+dudEndDate+'&topicId='+topicId+'&branchName='+$$(this).data('name')+'&khpl='+khpl);
			});
			loading3 = false;
		} else {
			loading3 = true;
		}
	}
	//未完成支部
	function searchshykUD(isLoadMore) {
		
		console.log(dudStartDate);
		console.log(dudEndDate);
		console.log(type);
		app.ajaxLoadPageContent1(getOneDepartmentCompletionStatusPath, {
			type:type,
			deptId:deptId,
			query:queryByDeptName1,
			current:pageNo4,
			startDate:dudStartDate,
			endDate:dudEndDate,
			// topicId:topicId,
			khpl:khpl
		}, function(result) {
			console.log(result);
			var data = result.data;
			if(data.records == ''){
				$$('.uDone').html('(0)');;
				$$('.infinite-scroll-preloader').remove();
			}else{
				$$('.uDone').html('('+data.total+')');
			}
			SearchUCompletedStatus(data.records,isLoadMore);
		});
	}
	function SearchUCompletedStatus(data,isLoadMore){
		console.log(data)
		if(data == "" && pageNo4 == 1){
			$$('.shykUDSearch .kpi-a-list ul').html("");
			$$('.shykUDNotFound').css('display','block');
		}
		if(data == ""){
			$$('.infinite-scroll-preloader').remove();
		}
		if(data.length) {
			if(isLoadMore) {
				$$('.infinite-scroll-preloader').remove();
				$$('.shykUDSearch .kpi-a-list ul').append(shykUDTemplate(data));
			} else {
				$$('.shykUDSearch .kpi-a-list ul').html(shykUDTemplate(data));
			}
			if(data.length<10 && pageNo4 == 1){
				$$('.infinite-scroll-preloader').remove();
			}
			$$('.shykUDSearch .item-content').on('click',function(){
				console.log('未参与查询');
			});
			loading4 = false;
		} else {
			loading4 = true;
		}
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll.shykD');
		var loadMoreContent1 = $$(page.container).find('.infinite-scroll.shykUD');
		var loadMoreContent2 = $$(page.container).find('.infinite-scroll.shykDSearch');
		var loadMoreContent3 = $$(page.container).find('.infinite-scroll.shykUDSearch');
		var loadMoreContentDSeason = $$(page.container).find('.infinite-scroll.shykDSeason');
		var loadMoreContentUDSeason = $$(page.container).find('.infinite-scroll.shykUDSeason');
		var loadMoreContentDYear = $$(page.container).find('.infinite-scroll.shykDYear');
		var loadMoreContentUDYear= $$(page.container).find('.infinite-scroll.shykUDYear');
		loadMoreContent.on('infinite',function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
			loadshykD(true);
		});
		loadMoreContent1.on('infinite',function() {
			if(loading1) return;
			loading1 = true;
			pageNo1 += 1;
			//这里写请求
			loadshykUD(true);
		});
		loadMoreContent2.on('infinite',function() {
			if(loading3) return;
			loading3 = true;
			pageNo3 += 1;
			//这里写请求
			searchshykD(true);
		});
		loadMoreContent3.on('infinite',function() {
			if(loading4) return;
			loading4 = true;
			pageNo4 += 1;
			//这里写请求
			searchshykUD(true);
		});
		//季度
		loadMoreContentDSeason.on('infinite',function() {
			if(loadingdudSeason) return;
			loadingdudSeason = true;
			pagedudSeason += 1;
			//这里写请求
			loadshykDBySeason(true);
		});
		loadMoreContentUDSeason.on('infinite',function() {
			if(loadingudSeason) return;
			loadingudSeason = true;
			pageudSeason += 1;
			//这里写请求
			loadshykUDBySeason(true);
		});
		//年度
		loadMoreContentDYear.on('infinite',function() {
			if(loadingdudYear) return;
			loadingdudYear = true;
			pagedudYear += 1;
			//这里写请求
			loadshykDByYear(true);
		});
		loadMoreContentUDYear.on('infinite',function() {
			if(loadingudYear) return;
			loadingudYear = true;
			pageudYear += 1;
			//这里写请求
			loadshykUDByYear(true);
		});
		//下拉刷新	
		var ptrContent=$$(page.container).find('.pull-to-refresh-content.shykD');
		var ptrContent1=$$(page.container).find('.pull-to-refresh-content.shykUD');
		var ptrContent2=$$(page.container).find('.pull-to-refresh-content.shykDSearch');
		var ptrContent3=$$(page.container).find('.pull-to-refresh-content.shykUDSearch');
		
		var ptrContentDSeason = $$(page.container).find('.pull-to-refresh-content.shykDSeason');
		var ptrContentUDSeason = $$(page.container).find('.pull-to-refresh-content.shykUDSeason');
		var ptrContentDYear = $$(page.container).find('.pull-to-refresh-content.shykDYear');
		var ptrContentUDYear = $$(page.container).find('.pull-to-refresh-content.shykUDYear');
		ptrContent.on('refresh', function() {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				loadshykD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});	
		ptrContent1.on('refresh', function() {
			setTimeout(function() {
				pageNo1 = 1;
				loading1 = true;
				//这里写请求
				loadshykUD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent2.on('refresh', function() {
			setTimeout(function() {
				pageNo3 = 1;
				loading3 = true;
				//这里写请求
				searchshykD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContent3.on('refresh', function() {
			setTimeout(function() {
				pageNo4 = 1;
				loading4 = true;
				//这里写请求
				searchshykUD(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//季度
		ptrContentDSeason.on('refresh', function() {
			setTimeout(function() {
				pagedudSeason = 1;
				loadingdudSeason = true;
				//这里写请求
				loadshykDBySeason(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContentUDSeason.on('refresh', function() {
			setTimeout(function() {
				pageudSeason = 1;
				loadingudSeason = true;
				//这里写请求
				loadshykUDBySeason(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//年份
		ptrContentDYear.on('refresh', function() {
			setTimeout(function() {
				pagedudYear = 1;
				loadingdudYear = true;
				//这里写请求
				loadshykDByYear(false);
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		ptrContentUDYear.on('refresh', function() {
			setTimeout(function() {
				pageudYear = 1;
				loadingudYear = true;
				//这里写请求
				loadshykUDByYear(false);
				app.myApp.pullToRefreshDone();
			}, 500);
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