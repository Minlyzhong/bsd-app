define(['app',
		'hbs!js/hbs/assessmentContent',
		'hbs!js/hbs/assessmentItem',
		'hbs!js/hbs/assessmentPaper',
	],
	function(app, contentTemplate, itemTemplate, paperTemplate) {
		var $$ = Dom7;
		var firstIn = 1;
		var pageDataStorage = {};
		var pageNo = 1;
		var loading = true;
		//考核责任项
		var loadPartyMenuPath = app.basePath + 'result/loadTestPaper';
		//查找考核清单
		var searchPaperPath = app.basePath + 'result/queryTopic';
		//加载考核清单
		var loadTopicPath = app.basePath + 'result/loadTopic';
		//参数
		var year = '';
		var month = '';
		var oldContent = '';
		//月份
		var tpArr = {};
		var notAssess = [];
		var assessTpId = 0;
		//月份
		var pageNo = 1;
		var loading = true;
		var asessmentMonthCount = 1;
		//查询
		var asessmentSearchStartDate = '';
		var asessmentSearchEndDate = '';
		var pageASearch = 1;
		var loadingASSearch = true;
		var asessmentSearchCount = 1;		
		//接收页面传来的参数
		var assessResultid = '';
		var khpl = '';
		var type = '';
		var startDate = '';
		var endDate = '';
		/**
		 * 页面初始化 
		 * @param {Object} page 页面内容
		 */
		function init(page) {
			initData(page.query);
			app.back2Home();
			clickEvent();
			ajaxLoadContent();
		}
		/**
		 * 初始化模块变量
		 */
		function initData(pageData) {
			//全局参数
			firstIn = 0;
			pageDataStorage = {};
			year = '';
			month = '';
			oldContent = '';
			//接收页面传来的参数
			assessResultid = pageData.assessResultid;
			khpl = pageData.khpl;
			type = pageData.type;
			startDate = pageData.startDate;
			endDate = pageData.endDate;
			//=========分割线=========
			//月份
			pageNo = 1;
			loading = true;
			tpArr = {};
			assessTpId = 0;
			//notAssess = JSON.parse(pageData.notAssess);
			//查询
			asessmentSearchStartDate = '';
			asessmentSearchEndDate = '';
			pageASearch = 1;
			loadingASSearch = true;
			asessmentSearchCount = 1;
		}

		/**
		 * 读取缓存数据 
		 */
		function loadStorage() {
			//arguments[0]获取其传回来的第一个参数
			if(arguments[0] >= 0) {
				loadTopic(pageDataStorage['tpId']);
				$$($$('.assesserPCLeftList .item-inner')[arguments[0]]).click();
			} else {
				$$('.assesserPCLeftList ul').html(itemTemplate(pageDataStorage['left']));
				loadEvent(pageDataStorage['left']);
			}
		}
		/*
		 * 点击事件
		 */
		function clickEvent() {	
			//点击查询框
			$$('#assessPCSearch').on('focus', function() {
				$$('.assessResultPCContent').css('display','none');
				$$('.assessmentResultPCTab').css('display','none');
				$$(this).css('text-align', 'left');
				$$('.assessPCSearchBar .searchCancelBtn').css('display', 'block');
				$$('.assesserPCSearchList').css('display', 'block');
			});
			//取消按钮
			$$('.searchCancelBtn').on('click',cancelAssessmentSearch);
			//搜索按钮
			$$('#assessPCSearch').on('keyup', keyupAssessment);
		}
		//搜索条件
		function searchAssessment1(){
//			var monthClassName = $('#tab1').hasClass('active');
//			var seasonClassName = $('#tab2').hasClass('active');
//			var yearClassName = $('#tab3').hasClass('active');
//			console.log(monthClassName);
//			console.log(seasonClassName);
//			console.log(yearClassName);
//			if(monthClassName){
//				asessmentSearchStartDate = asessmentMonthStartDate;
//				asessmentSearchEndDate = asessmentMonthEndDate;
//				//keyupAssessment();
//			}else if(seasonClassName){
//				asessmentSearchStartDate = asessmentSeasonStartDate;
//				asessmentSearchEndDate = asessmentSeasonEndDate;
//				//keyupAssessment();
//			}else if(yearClassName){
//				asessmentSearchStartDate = asessmentYearStartDate;
//				asessmentSearchStartDate = asessmentYearEndDate;
//				//keyupAssessment();
//			}
//			keyupAssessment();
		}
		//
		function keyupAssessment(){
			var searchContent = $$('#assessPCSearch').val();
			if(!searchContent) {
				oldContent = '';
				$$('.searchbar-clear').css('opacity', '0');
				$$('.assesserPCSearchList ul').html("");
			} else {
				$$('.searchbar-clear').css('opacity', '1');
			}
			
			searchPaper(searchContent);
		}
		//点击x按钮
		function cancelAssessmentSearch(){
			$$('.assessmentResultPCTab').css('display','block');
			oldContent = '';
			$$('#assessPCSearch').val("");
			//$$('.assessmentSearch').css('display','none');
			$$('.assessPCSearchBar #assessPCSearch').css('text-align', 'center');
			$$('.assessPCSearchBar .searchCancelBtn').css('display','none');
			$$('.assesserPCSearchList ul').html("");
			$$('.assesserPCSearchList').css('display', 'none');
			$$('.assessPCNotFound').css('display', 'none');
		}
		/**
		 * 异步请求页面数据 
		 */
		function ajaxLoadContent() {
			console.log(startDate);
			console.log(endDate);
			console.log(type);
			console.log(khpl);
			console.log(assessResultid);
			app.ajaxLoadPageContent(loadPartyMenuPath, {
				deptId:assessResultid,
				type:type,
				startDate:startDate,
				endDate:endDate,
				khpl:khpl,
			}, function(result) {
				var data = result;
				console.log(data);
				pageDataStorage['left'] = data;
				$$('.assesserPCLeftList ul').html(itemTemplate(data));
				if(notAssess.length) {
					$$.each($$('.assesserPCLeftList .item-inner'), function(index, item1) {
						$$.each(notAssess, function(index, item2) {
							if($$(item1).data('tpid') == item2.knowledgePaperId) {
								if(item2.totalNum) {
									$$(item1).prepend('<span class="appBadge bg-red assessBadge" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
								}
							}
						});
					});
				}
				setTimeout(function(){
					loadEvent(data);
				},100)	
			});
		}

		/**
		 * 动态加载事件(月份)
		 * @param {Object} data 请求的数据
		 */
		function loadEvent(data) {
			$$('.assesserPCLeftList .item-inner').on('click', function() {
				assessTpId = $$(this).data('tpid');
				pageDataStorage['index'] = $$(this).parent().index();
				$$('.assesserPCLeftList .item-inner').css('background', 'whitesmoke');
				$$('.assesserPCLeftList .item-inner').children().css('color', 'gray');
				$$(this).css('background', 'white');
				$$(this).children().css('color', '#ed4c3c');
				var tpId = $$(this).data('tpId');
				pageDataStorage['tpId'] = tpId;
				if(tpId && !tpArr[tpId]) {
					loadTopic(tpId);
				} else {
					handleTopic(tpId);
				}
			});
			$$($$('.assesserPCLeftList .item-inner')[0]).click();
		}
		/**
		 * 加载考核清单
		 * @param {Object} tpId 考核项ID
		 */
		function loadTopic(tpId) {
			console.log(startDate);
			console.log(endDate);
			app.ajaxLoadPageContent(loadTopicPath, {
				deptId:assessResultid,
				tpId: tpId,
				userId: app.userId,
				type:type,
				startDate:startDate,
				endDate:endDate,
				khpl:khpl,
			}, function(result) {
				var data = result;
				console.log(result);
				tpArr[tpId] = result;
				handleTopic(tpId);
			});
		}
		//回显
		function addCallback() {
			loadStorage(pageDataStorage['index']);
			if(notAssess.length) {
				$$.each(notAssess, function(index, item2) {
					if(item2.knowledgePaperId == parseInt(assessTpId)) {
						item2.totalNum = item2.totalNum - 1;
					}
				});
				$$('.assessBadge').remove();
				$$.each($$('.assesserPCLeftList .item-inner'), function(index, item1) {
					$$.each(notAssess, function(index, item2) {
						if($$(item1).data('tpid') == item2.knowledgePaperId) {
							if(item2.totalNum) {
								$$(item1).prepend('<span class="appBadge bg-red assessBadge" style="font-size: 13px;right: 0;top: 0;text-align: center;">' + item2.totalNum + '</span>');
							}
						}
					});
				});
				require(['js/pages/appList/appList'], function(appList) {
					appList.minusAssessNum(parseInt(assessTpId));
				});
			}
		}
		/**
		 * 把考核清单写入页面 
		 * @param {Object} tpId 考核项ID
		 */
		function handleTopic(tpId) {
			var topicContent = tpArr[tpId];
			$$('.assesserPCRightList ul').html(paperTemplate(topicContent));
			
			//点击事件
			$$('.assesserPCRightList .item-content').on('click', function() {
				var id = $$(this).data('id');
				app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+assessResultid+'&topicId='+id+'&startDate='+startDate+'endDate='+endDate);
			});
		}

		//查找考核清单
		function searchPaper(content) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
			$$('.assessPCNotFound').css('display', 'none');
			if(!content) {
				return;
			}
			console.log(startDate);
			console.log(endDate);
			app.ajaxLoadPageContent(searchPaperPath, {
				deptId: assessResultid,
				query: content,
				khpl:khpl,
				type:type,
				startDate:startDate,
				endDate:endDate,
			}, function(data) {
				console.log(data);
				if(data.data && data.data.length > 0) {
					$$('.assesserPCSearchList ul').html(contentTemplate(data.data));
					$$('.assesserPCSearchList .item-content').on('click', function() {
						var id = $$(this).data('id');
						var title = $$(this).find('.kpi-title').html();
						var score = $$(this).data("score");
						var target = $$(this).data('target');
						var minus = $$(this).data('minus');
						var memo = $$(this).data('memo');
						//app.myApp.getCurrentView().loadPage('assessWork.html?assessId=' + id + '&title=' + title + '&score=' + score + '&target=' + target + '&minus=' + minus +'&memo=' + memo+'&StartDate='+asessmentSearchStartDate);
						var id = $$(this).data('id');
						app.myApp.getCurrentView().loadPage('assessmentResultPaperDetail.html?deptId='+assessResultid+'&topicId='+id+'&startDate='+startDate+'endDate='+endDate);
					});
				} else {
					$$('.assesserPCSearchList ul').html("");
					$$('.assessPCNotFound').css('display', 'block');
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
			addCallback: addCallback,
		}
	});