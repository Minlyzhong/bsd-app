define(['app',
	'hbs!js/hbs/recordComment',
	'js/pages/record/record'
], function(app, recordCommentTemplate, record) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载工作日志详情
	var loadWorkLogDetailPath = app.basePath + '/mobile/worklog/detail/';
	//加载日志评论
	var loadLogCommentPath = app.basePath + '/mobile/worklog/comments/';
	//保存日志评论
	var saveLogCommentPath = app.basePath + '/mobile/worklog/comment/';
	//删除日志评论
	var deleteLogCommentPath = app.basePath + '/mobile/worklog/delete/';
	//加载日志点赞
	var loadLogLikePath = app.basePath + '/mobile/worklog/likes/';
	//新增赞
	var addLikePath = app.basePath + '/political/content/likes';
	//取消点赞
	var cancelLikePath = app.basePath + '/political/content/likes/';
	//修改日志审阅状态
	var changeLogReviewedPath = app.basePath + '/mobile/worklog/read/';
	//记录用户读取微动态记录:
	// var readWorkLogPath = app.basePath + '/mobile/worklog/read/';
	//加载工作日志图片:
	var loadWorkLogPhotosPath = app.basePath + '/mobile/worklog/photos/';
	//删除工作日志
	var deleteWorkLogByIdPath = app.basePath + '/mobile/worklog/remove/';
	//推荐(取消)工作日志
	var loadLogRecommendPath = app.basePath + '/mobile/worklog/recommend/';
	//查看推荐(取消)工作日志状态
	var checkRecommendPath = app.basePath + '/mobile/worklog/recommend/';
	//参数
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var sendId = '';
	var sendName = '';
	var recordId = '';
	var userId = 0;
	var state = -1;
	var reviewName = '';
	var workType = '';
	var isRecommend = 3;
	//判断是否符合本周时间
	var isRecordTime;
	var isOpen;
	// 点赞
	var likes = false;
	var likesId = 0;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		isOpen = true;
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		isRecommend = 3;
		app.back2Home();
		photoBrowserPhotos = [];
		photoBrowserPopup = '';
		isRecordTime = false;
		userId = parseInt(pageData.userId);
		state = pageData.state;
		reviewName = pageData.reviewName;
		workType = pageData.workType;
		likes = false;
		likesId = 0;
		if(pageData.logTypeId){
			logTypeId = pageData.logTypeId
		}else{
			logTypeId = 2
		}
		if(userId == 0) {
			userId = app.userId;
		}
		recordId = pageData.id;
		// 记录用户读取微动态记录
		// readWorkLog();
		console.log('state')
		console.log(state)
		console.log(workType)
		if(state == 'false') {
			changeLogReviewed();
		} else {
			loadRecordDetail(recordId);
		}
		if(app.userId != -1){
			checkRecommend();
		}	
		
	}

	/**
	 *  修改日志审阅状态
	 */
	function changeLogReviewed() {
		console.log('修改日志审阅状态')
		app.ajaxLoadPageContent(changeLogReviewedPath+app.userId+'/'+recordId, {
			// userId: app.userId,
			// workId: recordId,
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(data.msg !== 'success') {
				app.myApp.alert('网络出错，请检查网络');
			}
			loadRecordDetail(recordId);
			checkRecommend();
			require(['js/pages/appList/appList'], function(app) {
				app.setUnReadRows();
		})
		},{
			type:'POST'
		});
	}
	/**
	 * 记录用户读取微动态记录
	 */
	function readWorkLog(){
		console.log(recordId);
		app.ajaxLoadPageContent(changeLogReviewedPath+app.userId+'/'+recordId,{
			// workLogId: recordId,
			// userId: app.userId
		},function(result){
			require(['js/pages/appList/appList'], function(app) {
					app.setUnReadRows();
			})
		},{
			type:'POST'
		});
	}

	/**
	 * 查看推荐(取消)工作日志状态
	 */
	function checkRecommend(){
		console.log(recordId);
		app.ajaxLoadPageContent(checkRecommendPath+app.userId+'/'+recordId,{
			
		},function(result){
			isRecommend = result.data;
			if(isRecommend == false){
				$$('.recommendRecord').css('display','block');
				$$('.cancelRecord').css('display','none');
			}else{
				$$('.cancelRecord').css('display','block');
				$$('.recommendRecord').css('display','none');
			}

		});
	}
	
	/**
	 * 加载数据 
	 * @param {Object} recordId 日志ID
	 */
	function loadRecordDetail(recordId) {
		app.myApp.showPreloader('加载中...');
		console.log(userId);
		photoBrowserPhotos = [];
		photoBrowserPopup = '';
		$$('.weui_uploader .kpiPicture').remove();
		app.ajaxLoadPageContent(loadWorkLogDetailPath+logTypeId+'/'+recordId, {
			// workLogId: recordId,
			// userId: userId,
			// dictCode: 'RZLX',,
			tenantId:app.userDetail.tenantId
		}, function(result) {
			app.myApp.hidePreloader();
			var data = result.data;
			reviewName = data.name;
			console.log(data);
			isEditId = data.id;
			var likesArr = data.likes

			if(likesArr){
				for(var i=0; i<likesArr.length;i++){
					console.log(likesArr[i])
					if(likesArr[i].userId == app.userId){
						likesId = likesArr[i].id;
						likes = true;
						break;
					}
				}
				
			}

			console.log(likes)
			
			if(likes){
				$$('.recordLike>i').removeClass('icon-noCollect').addClass('icon-collect');
				$$('.likeStatus').html('取消');
			}else{
				$$('.recordLike>i').removeClass('icon-collect').addClass('icon-noCollect');
				$$('.likeStatus').html('赞');
			}
			$$('#recDetailTitle').val(data.logTitle);
			$$('#recDetailTs').val(data.createTime);
			console.log(data.memberType)
			if(data.memberType == '第一书记'){				
				if($$('.villName').length == 0){
					$$('#recSend').val(reviewName+'(第一书记)');
					var str = '<li class="villName">';
					str += '<div class="item-content">';
					str += '<div class="item-inner">';
					str += '<div class="item-title kp-label recordReview">所驻村(社区):</div>';
					str += '<div class="item-input">';
					str += '<input type="text" id="villageName" name="villageName" placeholder="" readonly />';
					str += '</div>';
					str += '</div>';
					str += '</div>';
					str += '</li>';
					$$('.recdeptNameLi').append(str);
					$$('#villageName').val(data.villageName);
				}
			}else{
				$$('#recSend').val(reviewName);
			}
			$$('#recType').val(workType);
			var detailContent = data.logContent;
			var reg=new RegExp("<br/>","g");
			detailContent = detailContent.replace(reg,'\r\n');
			$$('#recDetailContent').val(detailContent);
			$$('#recdeptName').html(data.deptName);
			$$('#recSendId').val(userId);
			//判断发送日志的时间是否属于本周
			var myDate = new Date();
			
			console.log('加载评论')
			//加载评论
			loadLogComment(recordId);
			//加载图片
			loadLogPhoto(recordId,userId);
			
			//加载点赞
			loadLogLike(recordId, 0);
			// 查看推荐(取消)工作日志状态
			checkRecommend();
			if(myDate.getDate() > 1){
				isRecordTime = app.isWeek(app.getTime(0),app.getTime(-6),data.logTime.split(' ')[0]);
			}else{
				isRecordTime = app.isWeek(app.getTime(6),app.getTime(0),data.logTime.split(' ')[0]);
			}
			
		});
	}
	
	/*
	 * 加载工作日志的图片
	 */
	function loadLogPhoto(recordId,userId){
		app.ajaxLoadPageContent(loadWorkLogPhotosPath+recordId, {
			// workLogId: recordId,
			// userId: userId,
			tenantId:app.tenantId
		}, function(result) {
			showReadonlyPhotos(result.data);
		});
	}
	/**
	 * 加载工作日志评论 
	 * @param {Object} recordId 日志ID
	 */
	function loadLogComment(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath+app.userId+'/'+recordId, {
			// workLogId: recordId,
			tenantId:app.tenantId
		}, function(result) {
			var data = result.data;
			console.log(data);
			console.log($$(".comments").length);
			if(data.length) {
				$$('.recCommentTotal').html(data.length);
				$$('.commentList').append(recordCommentTemplate(data));
				$$('.comments').on('click', commentClick);
			} else {
				$$('.recCommentTotal').html(0);
			}
		});
	}

	/**
	 * 评论点击事件
	 */
	function commentClick(e) {
		e.stopPropagation();
		var oneId = $$(this).find('.one').data('id');
		var comId = $$(this).data('commentid');

		if(oneId == app.userId) {
			app.myApp.confirm('是否删除此评论', function() {
				app.ajaxLoadPageContent(deleteLogCommentPath+comId, {
					// id: comId,
				}, function(result) {
					var data = result;
					console.log(data);
					$$.each($$('.comments'), function(index, item) {
						if($$(item).data('commentid') == comId) {
							$$(item).remove();
						}
					});
					var length = parseInt($$('.recCommentTotal').html()) - 1;
					$$('.recCommentTotal').html(length);
				});
			});
		} else {
			sendId = oneId;
			sendName = $$(this).find('.one').html();
			$$('.recCommentWindow').css('display', 'block');
			$$('.recCommentWindow textarea').attr('placeholder', "回复 " + sendName + ': ');
			$$('.recCommentWindow textarea').focus();
		}
	}

	/*
	 * 判断本日志时候被该用户推荐
	 */
	// function judgmentIsRecommend(){
	// 	//判断本日志是否被该用户推荐
	// 	app.ajaxLoadPageContent1(loadLogRecommendPath+app.userId+'/'+recordId, {
	// 		// workLogId:recordId,
	// 		// userId:app.userId,
	// 		// tenantId:
	// 		// isClick:0
			
	// 		tenantId: app.user.tenantId
	// 	}, function(result) {
	// 		console.log(result);
			
	// 	},{
	// 		type:'POST'
	// 	});
	// }
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$(document).click(function(e) {
			var con = $('.recCommentWindow textarea'); // 设置目标区域
			if(!con.is(e.target) && con.has(e.target).length === 0) {
				$$('.recCommentWindow textarea').blur();
				$$('.recCommentWindow').css('display', 'none');
			}
		});
		$$('.recordComment').on('click', function(e) {
			console.log('123');
			e.stopPropagation();
			sendId = 0;
			sendName = 0;
			$$('.recCommentWindow').css('display', 'block');
			$$('.recCommentWindow textarea').attr('placeholder', '说点评论吧(不少于10字)！');
			$$('.recCommentWindow textarea').focus();
		});
		$$('.sendBtn').on('click', function(e) {
			e.stopPropagation();
			var comments = $$('.recCommentWindow textarea').val().trim();
			if(!comments) {
				app.myApp.alert('评论不能为空');
				return;
			}
			if(comments.length < 10) {
				app.myApp.alert('评论内容不能少于10字！');
				return;
			}
			app.ajaxLoadPageContent(saveLogCommentPath+app.userId+'/'+recordId, {
				// workLogId: recordId,
				// userId: app.userId,
				// reviewerId: sendId,
				comment: comments,
			}, function(result) {
				var data = result;
				console.log(data);
				if(data.data == true) {
					console.log('1')
					var length = parseInt($$('.recCommentTotal').html()) + 1;
					$$('.recCommentTotal').html(length);
					app.ajaxLoadPageContent(loadLogCommentPath+app.userId+'/'+recordId, {
						// workLogId: recordId,
					}, function(result) {
						var data = result.data;
						console.log(data);
						console.log(data[0]);
						$$('.commentList').prepend(recordCommentTemplate(data[0]));
						$$('.comments').on('click', commentClick);
						$$('.recCommentWindow textarea').val("");
						$$('.recCommentWindow textarea').blur();
						$$('.recCommentWindow').css('display', 'none');
					});
				}
			},{
				type:'POST'
			});
		});
		$$('.recordLike').on('click', function(e) {
			e.stopPropagation();
			addLike(recordId);
		});
		$$('.sender').on('click',function() {
			app.myApp.getCurrentView().loadPage('contactsUserInfo.html?userId='+$$('#recSendId').val()+'&userName='+$$('#recSend').val());
		});
		//点击。。。展现按钮
		$$('.recordDetailDelete').on('click', function() {
			var clickedLink = this;
			var popoverHTML = '<div class="popover" style="width: 40%;">' +
				'<div class="popover-inner">' +
				'<div class="list-block recordPopover">' +
				'<ul>' +
				'<li class="recommendRecord"><a href="#" class="recordDetailRecommendButton" style="color:red;"><div><i class="icon icon-recommend" style="margin-right: 7%;"></i><span>推荐日志</span></div></a></li>' +
				'<li class="cancelRecord"><a href="#" class="recordDetailCancelButton" style="color:red;"><div><i class="icon icon-recommend" style="margin-right: 7%;"></i><span>取消推荐</span></div></a></li>' +
				'<li class="editRecord" style="display:none;"><a href="#" class="recordDetailEditButton" style="color:red;"><div><i class="icon icon-edit" style="margin-right: 7%;"></i><span>修改日志</span></div></a></li>' +
				'<li class="deleteRecord"><a href="#" class="recordDetailDeleteButton" style="color:red;"><i class="icon icon-delete2" style="margin-right: 7%;"></i>删除日志</a></li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>'
			var popover = app.myApp.popover(popoverHTML, clickedLink);
			$$('.recordPopover li a').on('click', function() {
				app.myApp.closeModal(popover);
			});
			//点击删除按钮
			$$('.recordDetailDeleteButton').on('click',function(){
				app.myApp.confirm('确定要删除吗？', function() {
					deleteWorkLog(recordId);
				});
			});
			//点击推荐日志按钮
			$$('.recordDetailRecommendButton').on('click',function(){
				if(app.userDetail.roleId != 4){
					app.myApp.toast('该账户没有推荐权限', 'error').show(true);
					return;
				}
				recommendRecord(recordId);
			});
			//点击取消推荐日志按钮
			$$('.recordDetailCancelButton').on('click',function(){
				if(app.userDetail.roleId != 4){
					app.myApp.toast('该账户没有取消推荐权限', 'error').show(true);
					return;
				}
				app.myApp.confirm('确定要取消推荐此日志吗？', function() {
					cancelRecord(recordId);
				});
			});
			//点击修改日志按钮
			$$('.recordDetailEditButton').on('click',function(){
				console.log(reviewName);
				app.myApp.getCurrentView().loadPage('recordEditDetail.html?recordId='+recordId+'&reviewName='+reviewName+'&workType='+workType);
			});
			//判断时候被推荐
			console.log(isRecommend);
			if(isRecommend == false){
				$$('.recommendRecord').css('display','block');
				$$('.cancelRecord').css('display','none');
			}else if(isRecommend == true){
				$$('.cancelRecord').css('display','block');
				$$('.recommendRecord').css('display','none');
			}
			//判断如果此日志userId不等于用户userId,则不显示删除按钮
			if(userId == app.userId){
				$$('.deleteRecord').css('display','block');
				//判断是否可以修改
				if(isRecordTime){
					$$('.editRecord').css('display','block');
				}
			}else{
				$$('.deleteRecord').css('display','none');
			}
		});
	}

	/*
	 * 推荐日志
	 */
	function recommendRecord(recordId){
		app.ajaxLoadPageContent1(loadLogRecommendPath+app.userId+'/'+recordId, {
			// workLogId:recordId,
			// userId:app.userId,
			// isClick:1
			tenantId: app.user.tenantId
		}, function(result) {
			if(result.code == 0 && result.data == true){
				console.log(result);
				app.myApp.toast('推荐成功', 'success').show(true);
				// isRecommend = result.data;
				checkRecommend();
			}else{
				app.myApp.toast('推荐失败,请稍后再试', 'error').show(true);
			}
			
		},{
			type:'POST'
		});
	}
	/*
	 * 取消推荐日志
	 */
	function cancelRecord(recordId){
		app.ajaxLoadPageContent1(loadLogRecommendPath+app.userId+'/'+ recordId, {
			// workLogId:recordId,
			// userId:app.userId,
			// isClick:1
			tenantId: app.user.tenantId
		}, function(result) {

			if(result.code == 0 && result.data == true){
				console.log(result);
				app.myApp.toast('取消成功', 'success').show(true);
				isRecommend = result.data;
				if(isRecommend == false){
					$$('.recommendRecord').css('display','block');
					$$('.cancelRecord').css('display','none');
				}else{
					$$('.cancelRecord').css('display','block');
					$$('.recommendRecord').css('display','none');
				}
				checkRecommend();
			}else{
				app.myApp.toast('取消失败,请稍后再试', 'error').show(true);
			}
		},{
			type:'POST'
		});
	}

	/**
	 * 新增/取消点赞 
	 * @param {Object} recordId
	 */
	function addLike(recordId) {
		console.log(likes)
		if(likes){
			
			app.ajaxLoadPageContent(cancelLikePath+likesId, {
				
				tenantId: app.user.tenantId
			}, function(result) {
				console.log(result)
				if(result.msg == 'success') {
					$$('.recordLike>i').removeClass('icon-collect').addClass('icon-noCollect');
					$$('.likeStatus').html('赞');
					likes = false;
					loadLogLike(recordId, 1) 
				}	
			},{
				type:'DELETE'
			});

		}else{
			// var types;
			// if(logTypeId == 1){
			// 	types = 7;
			// }else if(logTypeId == 2){
			// 	types = 5;
			// }else{
			// 	types = 6;
			// }
			// type:6 微动态,5工作日志
			var params={
				articleId: recordId,
				userId: app.userId,
				userName: app.user.userName,
				type:6
			}
			var formDatas= JSON.stringify(params)
			$$.ajax({
				url:addLikePath,
				method: 'POST',
				dataType: 'json',
				contentType: 'application/json;charset:utf-8',
				data: formDatas,
				cache: false,
				success:function (data) {
					if(data.msg == 'success') {
						$$('.recordLike>i').removeClass('icon-noCollect').addClass('icon-collect');
						$$('.likeStatus').html('取消');
						likes = true;
						likesId = data.data.id;
						loadLogLike(recordId, 1) 
					} 
					
				},
				error:function () {
				   
				}
			});

			

		}
	}




	/**
	 * 加载日志点赞 
	 * @param {Object} recordId
	 */
	function loadLogLike(recordId, isClick) {
		console.log(isClick);
		app.ajaxLoadPageContent(loadLogLikePath+recordId, {
			// workLogId: recordId,
			// userId: app.userId,
			// isClick: isClick,
			tenantId: app.user.tenantId
		}, function(result) {
			var data = result;
			console.log(data);
			
			if(data.data) {
				$$('.likeList').html('<i class="icon icon-noCollect"></i>' + data.data + ' 觉得很赞');
				var length = data.data.split(',').length;
				if(length >= 10){
					$$('.openLike').css('display','block');
					$$(".likeList").css('height','100px');
					$$(".likeList").css('overflow','hidden');
				}
				$$('.recLikeTotal').html(length);
				$$(".openLike").click(function(){
					if(isOpen){
						$$(".likeList").css('height','auto');
						$$(".likeList").css('overflow','visible');
						isOpen=false;
						$$(".openLike").html('[收起]');
					}else{
						$$(".likeList").css('height','100px');
						$$(".likeList").css('overflow','hidden');
						isOpen=true;
						$$(".openLike").html('[展开]');
					}
				});
			} else {
				$$('.likeList').html("");
				$$('.recLikeTotal').html(0);
			}
		});
	}

	/**
	 * 显示已读相片
	 * @param {Object} picUrlList 需要显示的图片数组
	 */
	function showReadonlyPhotos(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			var item = item.attPath;
			photoBrowserPhotos.push(app.filePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.filePath + item + '" class="picSize" />' +
				'</div>' +
				'</div>');
			$$('#img_' + random).on('click', function(e) {
				e.stopPropagation();
				var picIndex = $$(this).parent().index();
				photoBrowserPopup = app.myApp.photoBrowser({
					photos: photoBrowserPhotos,
					theme: 'dark',
					backLinkText: '关闭',
					ofText: '/',
					type: 'popup',
				});
				photoBrowserPopup.open(picIndex - 1);
			});
		});
	}

	/*
	 * 删除工作日志 
	 */
	function deleteWorkLog(recordId){
		app.ajaxLoadPageContent(deleteWorkLogByIdPath+recordId, {
			// id: recordId,
		}, function(result) {
			if(result.msg == 'success'){
				app.myApp.toast('删除成功', 'success').show(true);
				setTimeout(function() {
					//调用
					require(['js/pages/newRecord/newRecord'], function(newRecord) {
						newRecord.refresh();
					});
				}, 1000);
				setTimeout(function() {
					//调用
					require(['js/pages/record/record'], function(record) {
						record.refresh();
					});
				}, 1000);
				app.myApp.hidePreloader();
				app.myApp.getCurrentView().back();
			}
		},{
			type:'DELETE'
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
		loadRecordDetail:loadRecordDetail,
		resetFirstIn: resetFirstIn,
	}
});