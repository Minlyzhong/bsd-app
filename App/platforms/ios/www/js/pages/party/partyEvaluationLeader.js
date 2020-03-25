define(['app',
		'hbs!js/hbs/evaLPeople',
], function(app,evaLPeopleTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	
	//接口
	//获取年份
	var getYearsPath = app.basePath + '/mobile/partyAm/getYears';
	//加载党建考评人名
	var PartyMemberByConditonPath = app.basePath + 'orgUser/findCompletedOrNotDeptPartyMember';
	
	
	//公用
	var year = '';
	var month = '';
	//月份
	var evaLMonthStartDate = '';
	var evaLMonthEndDate = '';
	var pageNo = 1;
	var pageNoUD = 1;
	var loading = true;
	var loadingUD = true;
	var evaLMonthCount = 1;
	var evaLMonthCountUD = 1;
	//季度
	var evaLSeasonStartDate = '';
	var evaLSeasonEndDate = '';
	var pageASeason = 1;
	var loadingASeason = true;
	var pageASeasonUD = 1;
	var loadingASeasonUD = true;
	var evaLSeasonCount = 1;
	var evaLSeasonCountUD = 1;
	var season='';
	//年度
	var evaLYearStartDate = '';
	var evaLYearEndDate = '';
	var pageAYear = 1;
	var loadingAYear = true;
	var pageAYearUD = 1;
	var loadingAYearUD = true;
	var evaLYearCount = 1;
	var evaLYearCountUD = 1;
	//查询
	var evaLSearchStartDate = '';
	var evaLSearchEndDate = '';
	var pageASearch = 1;
	var loadingASearch = true;
	var pageASearchUD = 1;
	var loadingASearchUD = true;
	var evaLSearchCount = 1;
	var evaLSearchCountUD = 1;

	var oldContent = '';
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		attrDefine(page);
		clickEvent(page);
		pushAndPull(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		$$('.evaLeaderHeader').html(pageData.appName);
		//公用
		year = '';
		month = '';
		//月份
		evaLMonthStartDate = '';
		evaLMonthEndDate = '';
		pageNo = 1;
		pageNoUD = 1;
		loading = true;
		loadingUD = true;
		evaLMonthCount = 1;
		evaLMonthCountUD = 1;
		//季度
		evaLSeasonStartDate = '';
		evaLSeasonEndDate = '';
		pageASeason = 1;
		loadingASeason = true;
		pageASeasonUD = 1;
		loadingASeasonUD = true;
		evaLSeasonCount = 1;
		evaLSeasonCountUD = 1;
		season='';
		//年度
		evaLYearStartDate = '';
		evaLYearEndDate = '';
		pageAYear = 1;
		loadingAYear = true;
		pageAYearUD = 1;
		loadingAYearUD = true;
		evaLYearCount = 1;
		evaLYearCountUD = 1;
		//查询
		evaLSearchStartDate = '';
		evaLSearchEndDate = '';
		pageASearch = 1;
		loadingASearch = true;
		pageASearchUD = 1;
		loadingASearchUD = true;
		evaLSearchCount = 1;
		evaLSearchCountUD = 1;
	
		oldContent = '';
	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
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
				
			}
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
		evaLMonthStartDate = year+'-'+month+'-01';
		evaLMonthEndDate = year+'-'+month+'-31';
		$$(".evaLTime").on('click',function(){
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
				evaLMonthStartDate = year+'-'+month+'-01';
				evaLMonthEndDate = year+'-'+month+'-31';
				if($$('.LeaderMonth .evaDone').hasClass('active')){
					pageNo = 1;
					loading = true;
					ajaxLoadContent(false);
				}else{
					pageNoUD = 1;
					loadingUD = true;
					ajaxLoadContentUD(false);
				}
			});
		});
		//季度时间判断
		if(month<=3){
			$("#picker-describeSeason").val(year+'年 '+ '第一季度');
			evaLSeasonStartDate = year+'-01-01';
			evaLSeasonEndDate = year+'-03-31';
		}else if(month>3 && month<=6){
			$("#picker-describeSeason").val(year+'年 '+ '第二季度');
			evaLSeasonStartDate = year+'-04-01';
			evaLSeasonEndDate = year+'-06-31';
		}else if(month>6 && month<=9){
			$("#picker-describeSeason").val(year+'年 '+ '第三季度');
			evaLSeasonStartDate = year+'-07-01';
			evaLSeasonEndDate = year+'-09-31';
		}else if(month>9 && month<=12){
			$("#picker-describeSeason").val(year+'年 '+ '第四季度');
			evaLSeasonStartDate = year+'-10-01';
			evaLSeasonEndDate = year+'-12-31';
		}
		$$(".evaLTimeSeason").on('click',function(){
			pickerDescribeSeason.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeSeason.value[0].substring(0,pickerDescribeSeason.value[0].length-1);
				season = pickerDescribeSeason.value[1].substring(0,pickerDescribeSeason.value[1].length);
				if(season == '第一季度'){
					evaLSeasonStartDate = year+'-01-01';
					evaLSeasonEndDate = year+'-03-31';
				}else if(season == '第二季度'){
					evaLSeasonStartDate = year+'-04-01';
					evaLSeasonEndDate = year+'-06-31';
				}else if(season == '第三季度'){
					evaLSeasonStartDate = year+'-07-01';
					evaLSeasonEndDate = year+'-09-31';
				}else if(season == '第四季度'){
					evaLSeasonStartDate = year+'-10-01';
					evaLSeasonEndDate = year+'-12-31';
				}
				$("#picker-describeSeason").val(year+'年 '+ season);
				if($$('.LeaderSeason .evaDoneSeason').hasClass('active')){
					pageASeason = 1;
					loadingASeason = true;
					ajaxLoadContentBySeason(false);
				}else{
					pageASeasonUD = 1;
					loadingASeasonUD = true;
					ajaxLoadContentBySeasonUD(false);
				}
				
			});
		});
		//年份时间判断
		$("#picker-describeYear").val(year+'年 ');
		evaLYearStartDate = year+'-01-01';
		evaLYearEndDate = year+'-12-31';
		$$(".evaLTimeYear").on('click',function(){
			pickerDescribeYear.open();
			$$('.picker-3d .close-picker').text('完成');
			$$('.toolbar-inner .right').css('margin-right','20px');	
			$$('.picker-3d .close-picker').on('click',function(){
				year = pickerDescribeYear.value[0].substring(0,pickerDescribeYear.value[0].length-1);
				evaLYearStartDate = year+'-01-01';
				evaLYearEndDate = year+'-12-31';
				$("#picker-describeYear").val(year+'年 ');
				if($$('.LeaderSeason .evaDoneSeason').hasClass('active')){
					pageAYear = 1;
					loadingAYear = true;
					ajaxLoadContentByYear(false);
				}else{
					pageAYearUD = 1;
					loadingAYearUD = true;
					ajaxLoadContentByYearUD(false);
				}
			});
		});
		//点击查询框
		$$('#evaLSearch').on('focus', function() {
			$$('.evaLTab').css('display','none');
			$$(this).css('text-align', 'left');
			$$('.evaLSearchBar .evaLSearchCancelBtn').css('display', 'block');
			$$('.evaSearchLeader').css('display', 'block');
			$$('.evaBadgeDSearch').css('display','none');
			$$('.evaBadgeUDSearch').css('display','none');
		});
		//取消按钮
		$$('.evaLSearchCancelBtn').on('click',cancelAssessmentSearch);
//		//搜索按钮
		$$('#evaLSearch').on('keyup', searchAssessment1);
		//点击tab标签
		//月份
		$$('.buttonShyk').on('click',function(){
			if($$('.evaLTab').css('display') == 'none'){
				setTimeout(function(){
					searchAssessment1();
				},100);
			}
		});
		//季度
		$$('.buttonShykSeason').on('click',function(){
			if($$('.evaLTab').css('display') == 'none'){
				setTimeout(function(){
					searchAssessment1();
				},100);
			}else{
				if(evaLSeasonCount == 1){
					$$('.LeaderSeason .evaDone').addClass("active");
					ajaxLoadContentBySeason();
					evaLSeasonCount += 1;
				}
			}
		});
		//年份
		$$('.buttonShykYear').on('click',function(){
			if($$('.evaLTab').css('display') == 'none'){
				setTimeout(function(){
					searchAssessment1();
				},100);
			}else{
				if(evaLYearCount == 1){
					$$('.LeaderYear .evaDone').addClass("active");
					ajaxLoadContentByYear();
					evaLYearCount += 1;
				}
			}
		});
		
		
		$$('.LeaderMonth .evaDone').on('click',function(){
			pageNo = 1;
			loading = true;
			$$(this).addClass('active');
			$$(".LeaderMonth .evaUDone").removeClass('active');
			ajaxLoadContent(false);
		});
		$$('.LeaderMonth .evaUDone').on('click',function(){
			pageNoUD = 1;
			loadingUD = true;
			$$(this).addClass('active');
			$$(".LeaderMonth .evaDone").removeClass('active');
			ajaxLoadContentUD(false);
		});
		
		$$('.LeaderSeason .evaDone').on('click',function(){
			pageASeason = 1;
			loadingASeason = true;
			$$(this).addClass('active');
			$$(".LeaderSeason .evaUDone").removeClass('active');
			ajaxLoadContentBySeason(false);
		});
		$$('.LeaderSeason .evaUDone').on('click',function(){
			pageASeasonUD = 1;
			loadingASeasonUD = true;
			$$(this).addClass('active');
			$$(".LeaderSeason .evaDone").removeClass('active');
			ajaxLoadContentBySeasonUD(false);
		});
		
		$$('.LeaderYear .evaDone').on('click',function(){
			pageASeason = 1;
			loadingASeason = true;
			$$(this).addClass('active');
			$$(".LeaderYear .evaUDone").removeClass('active');
			ajaxLoadContentByYear(false);
		});
		$$('.LeaderYear .evaUDone').on('click',function(){
			pageASeasonUD = 1;
			loadingASeasonUD = true;
			$$(this).addClass('active');
			$$(".LeaderYear .evaDone").removeClass('active');
			ajaxLoadContentByYearUD(false);
		});
		//查询
		$$('.LeaderSearch .evaDone').on('click',function(){
			pageASearch = 1;
			loadingASearch = true;
			$$(this).addClass('active');
			$$(".LeaderSearch .evaUDone").removeClass('active');
			ajaxLoadContentBySearch(false);
		});
		$$('.LeaderSearch .evaUDone').on('click',function(){
			pageASearchUD = 1;
			loadingASearchUD = true;
			$$(this).addClass('active');
			$$(".LeaderSearch .evaDone").removeClass('active');
			ajaxLoadContentBySearchUD(false);
		});
		
		//加载月份
		ajaxLoadContent(false);
	}
	
	//搜索条件
	function searchAssessment1(){
		var monthClassName = $('#tab1').hasClass('active');
		var seasonClassName = $('#tab2').hasClass('active');
		var yearClassName = $('#tab3').hasClass('active');
		console.log(monthClassName);
		console.log(seasonClassName);
		console.log(yearClassName);
		if(monthClassName){
			evaLSearchStartDate = evaLMonthStartDate;
			evaLSearchEndDate = evaLMonthEndDate;
		}else if(seasonClassName){
			evaLSearchStartDate = evaLSeasonStartDate;
			evaLSearchEndDate = evaLSeasonEndDate;
		}else if(yearClassName){
			evaLSearchStartDate = evaLYearStartDate;
			evaLSearchEndDate = evaLYearEndDate;
		}
		oldContent = $$('#evaLSearch').val();
		ajaxLoadContentBySearch(false);
	}
	//点击取消按钮
	function cancelAssessmentSearch(){
		$$('.evaLTab').css('display','block');
		oldContent = '';
		$$('#evaLSearch').val("");
		$$('.evaLSearchBar #evaLSearch').css('text-align', 'center');
		$$('.evaLSearchBar .evaLSearchCancelBtn').css('display','none');
		$$('.evaLListSearch ul').html("");
		$$('.evaSearchLeader').css('display', 'none');
	}
	/*
	 * 月份(已做人员)
	 */
	function ajaxLoadContent(isLoadMore){
		console.log(evaLMonthStartDate);
		console.log(evaLMonthEndDate);
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageNo,
			deptId:app.user.deptId,
			startDate:evaLMonthStartDate,
			endDate:evaLMonthEndDate,
			type:1,
		},function(data){
			console.log(data)
			if(data.data&&data.data.length>0){
				if(pageNo == 1){
					if(data.total > 0){
						$$('.evaBadgeD').html(data.total);
						$$('.evaBadgeD').css('display','block');
					}else{
						$$('.evaBadgeD').css('display','none');
					}
					$$('.evaLList ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLList ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLList ul').html(evaLPeopleTemplate(data.data));
				}
				loading = false;	
			}else{
				if(pageNo == 1){
					$$('.evaLList ul').html('');
				}
				loading = true;
			}
			
			$$('.evaLList .clickEva').on('click',function(){
				var userId = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('partyLeaderShipEvaluation.html?userId='+userId+'&startTime='+evaLMonthStartDate+'&endTime='+evaLMonthEndDate+'&type=1&khpl=2');
			})
		});
	}
	/*
	 * 月份(未做人员)
	 */
	function ajaxLoadContentUD(isLoadMore){
		console.log(evaLMonthStartDate);
		console.log(evaLMonthEndDate);
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageNoUD,
			deptId:app.user.deptId,
			startDate:evaLMonthStartDate,
			endDate:evaLMonthEndDate,
			type:0,
		},function(data){
			console.log(data)
			if(data.data&&data.data.length>0){
				if(pageNoUD == 1){
					if(data.total > 0){
						$$('.evaBadgeUD').html(data.total);
						$$('.evaBadgeUD').css('display','block');
					}else{
						$$('.evaBadgeUD').css('display','none');
					}
					$$('.evaLList ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLList ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLList ul').html(evaLPeopleTemplate(data.data));
				}
				loadingUD = false;	
			}else{
				if(pageNoUD == 1){
					$$('.evaLList ul').html('');
				}
				loadingUD = true;
			}
			
				
		});
	}
	/*
	 * 季度
	 * type=1(已做)
	 */
	function ajaxLoadContentBySeason(isLoadMore){
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageASeason,
			deptId:app.user.deptId,
			startDate:evaLSeasonStartDate,
			endDate:evaLSeasonEndDate,
			type:1,
		},function(data){
			console.log(data)
			if(data.data&&data.data.length>0){
				if(pageASeason == 1){
					if(data.total > 0){
						$$('.evaBadgeDSeason').html(data.total);
						$$('.evaBadgeDSeason').css('display','block');
					}else{
						$$('.evaBadgeDSeason').css('display','none');
					}
					$$('.evaLListSeason ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLListSeason ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLListSeason ul').html(evaLPeopleTemplate(data.data));
				}
				loadingASeason = false;	
			}else{
				if(pageASeason == 1){
					$$('.evaLListSeason ul').html('');
				}
				loadingASeason = true;	
			}
			$$('.evaLListSeason .clickEva').on('click',function(){
				var userId = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('partyLeaderShipEvaluation.html?userId='+userId+'&startTime='+evaLSeasonStartDate+'&endTime='+evaLSeasonEndDate+'&type=1&khpl=1');
			})
		});
	}
	/*
	 * 季度
	 * type=0(未做)
	 */
	function ajaxLoadContentBySeasonUD(isLoadMore){
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageASeasonUD,
			deptId:app.user.deptId,
			startDate:evaLSeasonStartDate,
			endDate:evaLSeasonEndDate,
			type:0,
		},function(data){
			console.log(data)
			if(data.data&&data.data.length>0){
				if(pageASeasonUD == 1){
					if(data.total > 0){
						$$('.evaBadgeUDSeason').html(data.total);
						$$('.evaBadgeUDSeason').css('display','block');
					}else{
						$$('.evaBadgeUDSeason').css('display','none');
					}
					$$('.evaLListSeason ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLListSeason ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLListSeason ul').html(evaLPeopleTemplate(data.data));
				}
				loadingASeasonUD = false;	
			}else{
				if(pageASeasonUD == 1){
					$$('.evaLListSeason ul').html('');
				}
				loadingASeasonUD = true;	
			}
		});
	}
	/*
	 * 年度(已做)
	 */
	function ajaxLoadContentByYear(isLoadMore){
		console.log(evaLYearStartDate);
		console.log(evaLYearEndDate);
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageAYear,
			deptId:app.user.deptId,
			startDate:evaLSeasonStartDate,
			endDate:evaLSeasonEndDate,
			type:1,
		},function(data){
			console.log(data);
			if(data.data&&data.data.length>0){
				if(pageAYear == 1){
					if(data.total > 0){
						$$('.evaBadgeDYear').html(data.total);
						$$('.evaBadgeDYear').css('display','block');
					}else{
						$$('.evaBadgeDYear').css('display','none');
					}
					$$('.evaLListYear ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLListYear ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLListYear ul').html(evaLPeopleTemplate(data.data));
				}
				loadingAYear = false;
			}else{
				if(pageAYear == 1){
					$$('.evaLListYear ul').html('');
				}
				loadingAYear = true;
			}
			$$('.evaLListYear .clickEva').on('click',function(){
				var userId = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('partyLeaderShipEvaluation.html?userId='+userId+'&startTime='+year+'&endTime='+evaLYearEndDate+'&type=0&khpl=0');
			})
		});
	}
	
	
	
	/*
	 * 年度(未做)
	 */
	function ajaxLoadContentByYearUD(isLoadMore){
		console.log(evaLYearStartDate);
		console.log(evaLYearEndDate);
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageAYearUD,
			deptId:app.user.deptId,
			startDate:evaLSeasonStartDate,
			endDate:evaLSeasonEndDate,
			type:0,
		},function(data){
			console.log(data);
			if(data.data&&data.data.length>0){
				if(pageAYearUD == 1){
					if(data.total > 0){
						$$('.evaBadgeUDYear').html(data.total);
						$$('.evaBadgeUDYear').css('display','block');
					}else{
						$$('.evaBadgeUDYear').css('display','none');
					}
					$$('.evaLListYear ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLListYear ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLListYear ul').html(evaLPeopleTemplate(data.data));
				}
				loadingAYearUD = false;	
			}else{
				if(pageAYearUD == 1){
					$$('.evaLListYear ul').html('');
				}
				loadingAYearUD = true;	
			}
		});
	}
	
	
	/*
	 * 查询(已做)
	 */
	function ajaxLoadContentBySearch(isLoadMore){
		console.log(evaLSearchStartDate);
		console.log(evaLSearchEndDate);
		console.log(oldContent);
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageASearch,
			deptId:app.user.deptId,
			startDate:evaLSearchStartDate,
			endDate:evaLSearchEndDate,
			type:1,
			query:oldContent,
		},function(data){
			console.log(data);
			if(data.data&&data.data.length>0){
				if(pageASearch == 1){
					if(data.total > 0){
						$$('.evaBadgeDSearch').html(data.total);
						$$('.evaBadgeDSearch').css('display','block');
					}else{
						$$('.evaBadgeDSearch').css('display','none');
					}
					$$('.evaLListSearch ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLListSearch ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLListSearch ul').html(evaLPeopleTemplate(data.data));
				}
				loadingASearch = false;
			}else{
				if(pageASearch == 1){
					$$('.evaLListSearch ul').html('');
				}
				loadingASearch = true;
			}
		});
	}
	
	
	
	/*
	 *查询(未做)
	 */
	function ajaxLoadContentBySearchUD(isLoadMore){
		console.log(evaLSearchStartDate);
		console.log(evaLSearchEndDate);
		console.log(oldContent);
		app.ajaxLoadPageContent(PartyMemberByConditonPath,{
			pageNo:pageASearchUD,
			deptId:app.user.deptId,
			startDate:evaLSearchStartDate,
			endDate:evaLSearchEndDate,
			type:0,
			query:oldContent,
		},function(data){
			console.log(data);
			if(data.data&&data.data.length>0){
				if(pageASearchUD == 1){
					if(data.total > 0){
						$$('.evaBadgeUDSearch').html(data.total);
						$$('.evaBadgeUDSearch').css('display','block');
					}else{
						$$('.evaBadgeUDSearch').css('display','none');
					}
					$$('.evaLListSearch ul').html('');
				}
				if(isLoadMore == true) {
					$$('.evaLListSearch ul').append(evaLPeopleTemplate(data.data));
				} else{
					$$('.evaLListSearch ul').html(evaLPeopleTemplate(data.data));
				}
				loadingASearchUD = false;	
			}else{
				if(pageASearchUD == 1){
					$$('.evaLListSearch ul').html('');
				}
				loadingASearchUD = true;	
			}
		});
	}
	
	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//月份
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content.evaLmonth');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				if($$('.LeaderMonth .evaDone').hasClass('active')){
					pageNo = 1;
					loading = true;
					ajaxLoadContent(false);
				}else{
					pageNoUD = 1;
					loadingUD = true;
					ajaxLoadContentUD(false);
				}
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContent = $$(page.container).find('.infinite-scroll.evaLmonth');
		console.log(loadMoreContent);
		loadMoreContent.on('infinite', function() {
			if($$('.LeaderMonth .evaDone').hasClass('active')){
				if(loading) return;
				loading = true;
				pageNo += 1;
				ajaxLoadContent(true);
			}else{
				if(loadingUD) return;
				loadingUD = true;
				pageNoUD += 1;
				ajaxLoadContentUD(true);
			}
		});		
		//季度
		//下拉刷新	
		var ptrContentSeason = $$(page.container).find('.pull-to-refresh-content.evaLSeason');
		ptrContentSeason.on('refresh', function(e) {
			setTimeout(function() {
				if($$('.LeaderSeason .evaDone').hasClass('active')){
					pageASeason = 1;
					loadingASeason = true;
					//这里写请求
					ajaxLoadContentBySeason(false);
				}else{
					pageASeasonUD = 1;
					loadingASeasonUD = true;
					//这里写请求
					ajaxLoadContentBySeasonUD(false);
				}
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContentSeason = $$(page.container).find('infinite-scroll.evaLSeason');
		loadMoreContentSeason.on('infinite', function() {
			if($$('.LeaderSeason .evaDone').hasClass('active')){
				if(loadingASeason) return;
				loadingASeason = true;
				pageASeason += 1;
				ajaxLoadContentBySeason(true);
			}else{
				if(loadingASeasonUD) return;
				loadingASeasonUD = true;
				pageASeasonUD += 1;
				ajaxLoadContentBySeasonUD(true);
			}
		});
		//年度
		//下拉刷新	
		var ptrContentYear = $$(page.container).find('.pull-to-refresh-content.evaLYear');
		ptrContentYear.on('refresh', function(e) {
			setTimeout(function() {
				if($$('.LeaderYear .evaDone').hasClass('active')){
					pageAYear = 1;
					loadingAYear = true;
					//这里写请求
					ajaxLoadContentByYear(false);
				}else{
					pageAYearUD = 1;
					loadingAYearUD = true;
					//这里写请求
					ajaxLoadContentByYearUD(false);
				}	
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContentYear = $$(page.container).find('infinite-scroll.evaLYear');
		loadMoreContentYear.on('infinite', function() {
			if($$('.LeaderYear .evaDone').hasClass('active')){
				if(loadingAYear) return;
				loadingAYear = true;
				pageAYear += 1;
				ajaxLoadContentByYear(true);
			}else{
				if(loadingAYearUD) return;
				loadingAYearUD = true;
				pageAYearUD += 1;
				ajaxLoadContentByYearUD(true);
			}	
		});
//		/查询
//		//下拉刷新	
		var ptrContentSearch= $$(page.container).find('.pull-to-refresh-content.evaLSearch');
		ptrContentSearch.on('refresh', function(e) {
			setTimeout(function() {
				if($$('.LeaderSearch .evaDone').hasClass('active')){
					pageASearch = 1;
					loadingASearch= true;
					//这里写请求
					ajaxLoadContentBySearch(false);
				}else{
					pageASearchUD = 1;
					loadingASearchUD= true;
					//这里写请求
					ajaxLoadContentBySearchUD(false);
				}	
				
				app.myApp.pullToRefreshDone();
			}, 500);
		});
		//滚动加载
		var loadMoreContentSearch = $$(page.container).find('.infinite-scroll.evaLSearch');
		loadMoreContentSearch.on('infinite', function() {
			if($$('.LeaderSearch .evaDone').hasClass('active')){
				if(loadingASearch) return;
				loadingASearch = true;
				pageASearch += 1;
				ajaxLoadContentBySearch(true);
			}else{
				if(loadingASearchUD) return;
				loadingASearchUD = true;
				pageASearchUD += 1;
				ajaxLoadContentBySearchUD(true);
			}
			
		});
	}
	function resetFirstIn() {
		firstIn = 1;
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
	}
});