define(['app',
	'hbs!js/hbs/contactsPeople',
	'hbs!js/hbs/contactPage',
	'hbs!js/hbs/contactsDept'
], function(app, contactsPeopleTemplate, contactPageTemplate,contactsDeptTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var pageNo1 = 1;
	var loading1 = true;
	//查找子部门
	var findDeptPath = app.basePath + '/mobile/political/department/list';
	//选择部门人员
	var findDeptPeoplePath = app.basePath + '/mobile/user/findDeptPeople/';
	//模糊搜索部门人员
	var searchDeptPeoplePath = app.basePath + '/mobile/user/searchDeptPeople';
	//模糊搜索部门query=藤县中&pageNo=1
	var findDeptByConditonPath = app.basePath + '/mobile/political/department/findDeptByConditon';
	//	根据组织机构ID，查询最新党员队伍统计信息
	var findPartyMemberInfoPath = app.basePath + '/mobile/user/findPartyMemberInfo/';
	//查询最新党组织统计信息
	var findPartyStatInfoPath = app.basePath + '/mobile/political/department/statistics';
	//查询党建考核进度信息
	var findCompRateOfPartyPath = app.basePath + '/mobile/partyAm/findCompRateOfParty/';
	//获取已参与考核的党支部列表
	var findCompPagerOfPartyInDZB = app.basePath + '/mobile/partyAm/findCompPagerOfPartyInDZB/';
	//每日一学最新一条数据
	var studyEveryDayPath = app.basePath + '/mobile/course/content/push/';
	//用于判断该部门是否请求过数据
	var deptIdList = {};
	var oldContent = '';
	var alreadyGetStudyData = false;
	var alreadyGetOtherData = false;
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		var loginCB = app.myApp.onPageBack('login', function(backPage) {
			//获取用户信息
			console.log('重新获取通讯录信息');
			$$('.contactMenu').html("");
			initData(page);
//			getStudyEveryDayData();
		});
		// 销毁子页面缓存
		app.pageStorageClear('contacts/contacts', [
			loginCB
		]);
		initData(page);
		app.back2Home();

	}

	/**
	 * 初始化模块变量
	 */
	function initData(page) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		pageNo1 = 1;
		loading1 = true;
		var user = new Object();
		user.role = app.roleId;
		// user.role = 1;
		console.log('contact.js')
		console.log(user)
		
		$$('.contactPage').html(contactPageTemplate(user));
		if(app.roleId == -1) {
			$$('.assessLogin').on('click', function() {
				app.myApp.getCurrentView().loadPage('login.html');
			});
		} else {
			deptIdList = {};
			oldContent = '';
			pushAndPull(page);
			clickEvent();
			// findDept(app.user.deptId, '', '', 0);
			findDept(-1, '', '', 0);
			handleDict();
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent() {
		$$('#contactsPeopleSearch').on('focus', showSearchList);
		$$('.contactsPeopleSearchBar .searchCancelBtn').on('click', hideSearchList);
		//$$('#contactsPeopleSearch').on('keyup', keyupContent);
		$$('.contactSearchBar .searchBtn').on('click',function(){
			$$('.contactSearchList ul').html("");
			$$('.contactSearchBar').css('display', 'none');
			keyupContent();
		});
		$$('.contactsPeopleSearchBar .searchbar-clear').on('click', clearContent);
		$$('.contactSearchClose').on('click',function(){
			$$('.contactSearchBar').css('display', 'none');
			hideSearchList();
		});
		$$('.contactSearchBar .resetBtn').on('click',function(){
			$$('#contactName').val('');
			$$('#deptName').val('');
		});
		
		
	}
	
	function handleDict() {
		$("#contactsId").append("<option value='0' selected>人员名称 </option>");
		$("#contactsId").append("<option value='1' >部门名称 </option>");
		$$('#contactsId').change(function() {
			if($("#contactsId").val() == 1){
				$$('.contactName').css('display','none');
				$$('.deptContactName').css('display','block');
			}else{
				$$('.contactName').css('display','block');
				$$('.deptContactName').css('display','none');
			}
		});
	}
	/**
	 * 显示搜索列表 
	 */
	function showSearchList() {
		$$(this).css('text-align', 'left');
		$$('.contactsPeopleSearchBar .searchCancelBtn').css('display', 'block');
		$$('.contactContent').css('display', 'none');
		$$('.infinite-scroll.contactSearch').css('display', 'block');
		$$('.chooseBtnRow').css('display', 'flex');
		$$('.sendTo').css('display', 'none');
		$$('.contactSearchBar').css('display', 'block');
	}

	/**
	 * 隐藏搜索列表
	 */
	function hideSearchList() {
		oldContent = '';
		loading = true;
		pageNo = 1;
		loading1 = true;
		pageNo1 = 1;
		$$('#contactsPeopleSearch').val("");
		$$('.contactsPeopleSearchBar #contactsPeopleSearch').css('text-align', 'center');
		$$('.contactsPeopleSearchBar .searchCancelBtn').css('display', 'none');
		$$('.contactSearchList ul').html("");
		$$('.contactContent').css('display', 'block');
		$$('.infinite-scroll.contactSearch').css('display', 'none');
		$$('.chooseBtnRow').css('display', 'none');
		$$('.sendTo').css('display', 'block');
		$$('.contactsPeopleSearchBar .searchbar-clear').css('opacity', '0');
		$$('.contactsNotFound').css('display', 'none');
	}

	/**
	 * 输入文字时 
	 */
	function keyupContent() {
//		var searchContent = $$('#contactsPeopleSearch').val();
		
//		if(!searchContent) {
//			oldContent = '';
//			$$('.contactsPeopleSearchBar .searchbar-clear').css('opacity', '0');
//			$$('.contactSearchList ul').html("");
//		} else {
//			$$('.contactsPeopleSearchBar .searchbar-clear').css('opacity', '1');
//		}
		if($("#contactsId").val() == 0){
			var searchContent = $$('#contactName').val();
			searchPeople(searchContent, false);
		}else{
			var searchContent = $$('#deptName').val();
			searchDept(searchContent, false);
		}
	}

	/**
	 * 清空输入框 
	 */
	function clearContent() {
		oldContent = '';
		loading = true;
		pageNo = 1;
		loading1 = true;
		pageNo1 = 1;
		$$(this).css('opacity', '0');
		$$('.contactSearchList ul').html("");
		$$('#contactsPeopleSearch').val("");
	}

	/**
	 * 搜索人员 
	 * @param {Object} content 输入的关键字
	 */
	function searchPeople(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
		}
		$$('.contactsNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(searchDeptPeoplePath, {
			// deptId: app.user.deptId,
			// userName: content,
			// pageNo: pageNo,
			// userId: app.userId,
			// type: 0,
			name:content
		}, function(data) {
			var data = data.data;
			if(data.length > 0) {
				if(data.length == 10) {
					loading = false;
				}
				$$('.contactSearchList ul').append(contactsPeopleTemplate(data));
				$$('.contactSearchList ul .item-content').on('click', function() {
					//showPeopleInfo($$(this).data('id'),$$(this).data('username'));
						app.myApp.getCurrentView().loadPage('contactsUserInfo.html?userId=' + $$(this).data('id')+'&userName='+$$(this).data('username'));
				});
			} else if(isLoadMore) {

			} else {
				$$('.contactSearchList ul').html("");
				$$('.contactsNotFound').css('display', 'block');
			}
		});
	}
	
	function searchDept(content, isLoadMore) {
		if(!isLoadMore) {
			content = content.trim();
			if(content != oldContent) {
				oldContent = content;
			} else {
				return;
			}
		}
		$$('.contactsDeptNotFound').css('display', 'none');
		if(!content) {
			return;
		}
		app.ajaxLoadPageContent(findDeptByConditonPath, {
			// query: content,
			// pageNo: pageNo1,
			deptName:content
		}, function(data) {
			if(data.length > 0) {
				if(data.length == 10) {
					loading1 = false;
				}
				$$('.contactSearchList ul').append(contactsDeptTemplate(data));
				$$('.contactSearchList ul .item-content .userBtn img').on('click', function() {
						//e.stopPropagation();
						
						var deptId = $$(this).data('deptId');
						var deptName = $$(this).data('deptName');
						if(deptId) {
							findDeptPeople(deptId, deptName);
						}
				});
				$$('.contactSearchList ul .item-content .infoBtn img').on('click', function() {
						//e.stopPropagation();
						
						var deptId = $$(this).data('deptId');
						var deptName = $$(this).data('deptName');
						var deptType = $$(this).data('deptType');
						var deptCode = $$(this).data('deptCode');
						var parentDeptId = $$($$(this).parent().parent().parent().parent().parent().parent().find('a')[0]).data('deptId');
						var parentDeptName = $$($$(this).parent().parent().parent().parent().parent().parent().find('a')[0])[0].innerText;
						if(deptId) {
							showDeptInfo(deptId, deptName, deptType,parentDeptName,parentDeptId,deptCode);
						}
				});
			} else if(isLoadMore) {

			} else {
				$$('.contactSearchList ul').html("");
				$$('.contactsDeptNotFound').css('display', 'block');
			}
			alreadyGetOtherData = true;
//			getStudyEveryDayData();
		});
		
	}

	/**
	 * 获取部门 
	 */
	function findDept(parentId, elements, currentEle, type) {
		app.ajaxLoadPageContent(findDeptPath, {
			// parentId: -1,
			parentId: parentId,
			// type: type,
			userId: app.userId,
		}, function(data) {
			if(type) {
				deptIdList[parentId] = 1;
			}
			handleDept(data, elements, currentEle,parentId);
		});
	}

	/**
	 * 加载部门 
	 */
	function handleDept(data, elements, currentEle,parentId) {
		if(data.length) {
			handleData(data, elements);
			if(elements) {
				currentEle.click();
			}
		} else if(data.length<=0 && parentId != -1){
			console.log('该单位已经是最后一级');
			// app.myApp.alert('该单位已经是最后一级');
			app.myApp.toast('该单位已经是最后一级', 'none').show(true);
		}
	}

	/**
	 *  处理返回的数据
	 * @param {Object} data 返回的数据
	 * @param {Object} elements 点击的页面元素
	 */
	function handleData(data, elements) {
		var deptData = data;
		console.log('处理返回的数据')
		console.log(data)
		console.log(elements)
		//elements不为空，则为该元素追加数据；否则为主表格追加
		var appendEle = elements || $('.contactMenu');
		if(elements) {
			console.log('elements')
			appendEle.append('<ul>');

			$$.each(deptData, function(index, item) {
				appendEle.find('ul').append(
					
							'<li class="">' +
							'<a href="#" data-deptId="' + item.id + '" data-deptCode="' + item.deptCode + '">' +
							'<span class="contactTitle">' + item.title +
							'</span>' +
							'<span class="userBtn" style="position: relative;float: right;line-height:20px; margin-right: 10px; margin-top: 10px;margin-left: 2px;">' +
							'<img src="img/newIcon/icon_branch_personnel.png" style="width: 22px;padding-top: 2px;padding-left:11px" data-deptId="' + item.id + '" data-deptName="' + item.title + '" data-deptCode="' + item.deptCode + '"/>' +
							'</span>' +
							'<span class="infoBtn" style="position: relative;float: right;margin-right: 3px;margin-top: 7px;">' +
							'<img src="img/newIcon/icon_branch_information.png" style="width: 22px;padding-top: 2px;" data-deptType="' + item.deptType + '" data-deptId="' + item.id + '" data-deptName="' + item.label + '" data-deptCode="' + item.deptCode + '"/>' +
							'</span	>' +
							'</a>' +
							'</li>'
				
				);
			});
		} else {
			console.log('no-elements')
			appendEle.append('<ul style="padding: 0px;margin: 5px;">');
			$$.each(deptData, function(index, item) {
				appendEle.find('ul').append(
					'<div class="card-content">'+
							'<div class="card-content-inner">'+
							'<li class="card">' +
							'<a href="#" data-deptId="' + item.id + '" data-deptCode="' + item.deptCode + '">' +
							'<span class="contactTitle">' + item.title +
							'</span>' +
							'<span class="userBtn" style="position: relative;float: right;margin-top: 6px;margin-right: 10px;margin-left: 2px;">' +
							'<img src="img/newIcon/icon_branch_personnel.png" style="width: 22px;padding-top: 2px;padding-left:11px" data-deptId="' + item.id + '" data-deptName="' + item.title + '" data-deptCode="' + item.deptCode + '"/>' +
							'</span>' +
							'<span class="infoBtn" style="position: relative;float: right;margin-top: 7px;margin-right: 3px;">' +
							'<img src="img/newIcon/icon_branch_information.png" style="width: 22px;padding-top: 2px;" data-deptType="' + item.deptType + '" data-deptId="' + item.id + '" data-deptName="' + item.label + '" data-deptCode="' + item.deptCode + '"/>' +
							'</span	>' +
							'</a>' +
							'</li>'+
							'</div>'+
					'</div>'
					
					
				);
			});
		}
		
		$(".contactMenu").vmenuModule();
		pageDataStorage['dept'] = $$('.contactMenu').html();
		pageDataStorage['appendEle'] = appendEle;
		appendEle.find('a').on('click', function() {
			var deptId = $$(this).data('deptId');
			if(deptId && !deptIdList[deptId]) {
				findDept(deptId, $$($$(this).parent()[0]), $(this), 1);
			}
		});
		appendEle.find('ul').find('.infoBtn img').on('click', function(e) {
			e.stopPropagation();
			var deptId = $$(this).data('deptId');
			var deptName = $$(this).data('deptName');
			var deptType = $$(this).data('deptType');
			var deptCode = $$(this).data('deptCode');
			var parentDeptId = $$($$(this).parent().parent().parent().parent().parent().parent().find('a')[0]).data('deptId');
			var parentDeptName = $$($$(this).parent().parent().parent().parent().parent().parent().find('a')[0])[0].innerText;
			if(deptId) {
				showDeptInfo(deptId, deptName, deptType,parentDeptName,parentDeptId,deptCode);
			}
		});
		appendEle.find('ul').find('.userBtn img').on('click', function(e) {
			e.stopPropagation();
			var deptId = $$(this).data('deptId');
			var deptName = $$(this).data('deptName');
			if(deptId) {
				findDeptPeople(deptId, deptName);
			}
		});
	}

	/**
	 *  选择缴纳的人数
	 * @param {Object} deptId 部门ID
	 */
	function findDeptPeople(deptId, deptName) {
		app.myApp.getCurrentView().loadPage('contactsShowPeople.html?deptName=' + deptName + '&deptId=' + deptId);
		return;
	}

	/**
	 * 判断事业单位类型
	 */
	function showDeptInfo(deptId, deptName, deptType,parentDeptName,parentDeptId,deptCode) {
		if(deptType == 2) {
			app.myApp.alert('该单位暂无简介信息');
			return;
		}
		app.myApp.showPreloader('加载中');
		window.setTimeout(function() {
			app.myApp.getCurrentView().loadPage('partyInfo.html?deptId='+deptId+'&deptName='+deptName+'&deptType='+deptType+'&parentDeptId='+parentDeptId+'&parentDeptName='+parentDeptName+'&deptCode='+deptCode);
			//showInfo(deptId, deptName, deptType);
		}, 500);
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		scroll(function(direction) {
			if(direction == 'up') {
	
			} else {

			} 
		});

		function scroll(fn) {
			if($('.contactSearch')[0]){
				$('.contactSearch')[0].addEventListener("scroll", function() {
					var afterScrollTop = $('.contactSearch')[0].scrollTop;
					if(afterScrollTop>=130){
						if($("#contactsId").val() == 1){
							if(loading1) return;
							loading1 = true;
							pageNo1 += 1;
							//这里写请求
							searchDept(oldContent, true);
						}else{
							if(loading) return;
							loading = true;
							pageNo += 1;
							//这里写请求
							searchPeople(oldContent, true);
						}
					}
				}, false);
			}
			
		}
		loadMoreContent.on('infinite', function() {
			if($("#contactsId").val() == 1){
				if(loading1) return;
				loading1 = true;
				pageNo1 += 1;
				//这里写请求
				searchDept(oldContent, true);
			}else{
				if(loading) return;
				loading = true;
				pageNo += 1;
				//这里写请求
				searchPeople(oldContent, true);
			}
			
		});
	}
	
	/**
	 * 获取每日一学最新一条数据
	 */
	function getStudyEveryDayData(){
		app.ajaxLoadPageContent(studyEveryDayPath+app.userId, {
						// userId:app.userId
				}, function(data) {
					alreadyGetStudyData = true;
					showStudyEveryDayDialog(data.data);
				});
	}
	
	/**
	 * 展示每日一学弹出框
	 */
	function showStudyEveryDayDialog(studyData){
		// var curDay = app.utils.getCurTime().split(" ")[0];
		// if(curDay == localStorage.getItem('lastStudyDay')){
		// 	return;
		// }else if(alreadyGetStudyData && alreadyGetOtherData){
		// 	setTimeout(function(){
		// 		if(studyData != null && studyData != undefined && JSON.stringify(studyData) != "{}"){
		// 			localStorage.setItem('lastStudyDay',curDay);
		// 			app.myApp.alert(studyData.contentTitle, '每日一学',function () {
		// 		       		app.myApp.getCurrentView().loadPage('dailyLearning.html');
		// 			});
		// 		}
		// 	},1000);
		// }else {
		// 	setTimeout(showStudyEveryDayDialog(studyData),1000);
		// }
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