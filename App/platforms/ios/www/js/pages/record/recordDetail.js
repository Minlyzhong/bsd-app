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
	var loadWorkLogDetailPath = app.basePath + 'extWorkLog/loadWorkLogDetail';
	//加载日志评论
	var loadLogCommentPath = app.basePath + 'extWorkLog/loadLogComment';
	//保存日志评论
	var saveLogCommentPath = app.basePath + 'extWorkLog/saveLogComment';
	//删除日志评论
	var deleteLogCommentPath = app.basePath + 'extWorkLog/deleteLogComment';
	//加载日志点赞
	var loadLogLikePath = app.basePath + 'extWorkLog/loadLogLike';
	//修改日志审阅状态
	var changeLogReviewedPath = app.basePath + 'extWorkLog/updateActorState';
	//记录用户读取微动态记录:
	var readWorkLogPath = app.basePath + 'extWorkOver/readWorkLog';
	//加载工作日志图片:
	var loadWorkLogPhotosPath = app.basePath + 'extWorkLog/loadWorkLogPhotos';
	//删除工作日志
	var deleteWorkLogByIdPath = app.basePath + 'extWorkLog/deleteWorkLogById';
	
	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var sendId = '';
	var sendName = '';
	var recordId = '';
	var userId = 0;
	var state = -1;
	var reviewName = '';
	var workType = '';

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
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		app.back2Home();
		photoBrowserPhotos = [];
		photoBrowserPopup = '';
		userId = parseInt(pageData.userId);
		state = parseInt(pageData.state);
		reviewName = pageData.reviewName;
		workType = pageData.workType;
		if(userId == 0) {
			userId = app.userId;
		}
		recordId = pageData.id;
		//记录用户读取微动态记录
		readWorkLog();
		if(state == 0) {
			changeLogReviewed();
		} else {
			loadRecordDetail(recordId);
		}
//		if(userId == app.userId){
//			$$('.icon-dian').css('display','block');
//		}else{
//			$$('.recordDetailDelete').css('display','none');
//		}
	}

	/**
	 *  修改日志审阅状态
	 */
	function changeLogReviewed() {
		app.ajaxLoadPageContent(changeLogReviewedPath, {
			userId: app.userId,
			workId: recordId,
		}, function(result) {
			var data = result;
			console.log(data);
			if(data.success == false) {
				app.myApp.alert('网络出错，请检查网络');
			}
			loadRecordDetail(recordId);
		});
	}
	/**
	 * 记录用户读取微动态记录
	 */
	function readWorkLog(){
		console.log(recordId);
		app.ajaxLoadPageContent(readWorkLogPath,{
			workLogId: recordId,
			userId: app.userId
		},function(result){
			require(['js/pages/appList/appList'], function(app) {
					app.setUnReadRows();
			})
		});
	}
	
	/**
	 * 加载数据 
	 * @param {Object} recordId 日志ID
	 */
	function loadRecordDetail(recordId) {
		console.log(userId);
		app.ajaxLoadPageContent(loadWorkLogDetailPath, {
			workLogId: recordId,
			userId: userId,
			dictCode: 'RZLX',
		}, function(result) {
			var data = result;
			console.log(data);
			console.log(data[0].villageName);
			console.log(data[0].memberType);
			$$('#recDetailTitle').val(data[0].logTitle);
			$$('#recDetailTs').val(data[0].logTime);
			if(data[0].memberType == 1){				
				if($$('.villName').length == 0){
					$$('#recSend').val(reviewName+'(第一书记)');
					var str = '<li class="villName">';
					str += '<div class="item-content">';
					str += '<div class="item-inner">';
					str += '<div class="item-title kp-label">所驻村(社区):</div>';
					str += '<div class="item-input">';
					str += '<input type="text" id="villageName" name="villageName" placeholder="" readonly />';
					str += '</div>';
					str += '</div>';
					str += '</div>';
					str += '</li>';
					$$('.recdeptNameLi').append(str);
					$$('#villageName').val(data[0].villageName);
				}
			}else{
				$$('#recSend').val(reviewName);
			}
			$$('#recType').val(workType);
			$$('#recDetailContent').val(data[0].logContent);
			$$('#recdeptName').html(data[0].deptName);
			$$('#recSendId').val(userId)
			//				$$('.checkList').append(data[0].yesReviewed);
			//				$$('.uncheckList').append(data[0].NotReviewed);
			loadLogPhoto(recordId,userId);
			loadLogComment(recordId);
			loadLogLike(recordId, 0);
		});
	}
	
	/*
	 * 加载工作日志的图片
	 */
	function loadLogPhoto(recordId,userId){
		app.ajaxLoadPageContent(loadWorkLogPhotosPath, {
			workLogId: recordId,
			userId: userId,
		}, function(result) {
			showReadonlyPhotos(result);
		});
	}
	/**
	 * 加载工作日志评论 
	 * @param {Object} recordId 日志ID
	 */
	function loadLogComment(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath, {
			workLogId: recordId,
		}, function(result) {
			var data = result;
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
				app.ajaxLoadPageContent(deleteLogCommentPath, {
					id: comId,
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
			e.stopPropagation();
			sendId = 0;
			sendName = 0;
			$$('.recCommentWindow').css('display', 'block');
			$$('.recCommentWindow textarea').attr('placeholder', '说点评论吧');
			$$('.recCommentWindow textarea').focus();
		});
		$$('.sendBtn').on('click', function(e) {
			e.stopPropagation();
			var comments = $$('.recCommentWindow textarea').val().trim();
			if(!comments) {
				app.myApp.alert('评论不能为空');
				return;
			}
			app.ajaxLoadPageContent(saveLogCommentPath, {
				workLogId: recordId,
				userId: app.userId,
				reviewerId: sendId,
				comment: comments,
			}, function(result) {
				var data = result;
				console.log(data);
				if(data.success == true) {
					var length = parseInt($$('.recCommentTotal').html()) + 1;
					$$('.recCommentTotal').html(length);
//					var commentData = {
//						comment: comments,
//						reviewerId: sendId,
//						userId: userId,
//						reviewerName: sendName,
//						userName: app.user.userName,
//					};
					app.ajaxLoadPageContent(loadLogCommentPath, {
						workLogId: recordId,
					}, function(result) {
						var data = result;
						console.log(data);
						$$('.commentList').append(recordCommentTemplate(data[data.length-1]));
						$$('.comments').on('click', commentClick);
						$$('.recCommentWindow textarea').val("");
						$$('.recCommentWindow textarea').blur();
						$$('.recCommentWindow').css('display', 'none');
					});
//					$$('.commentList').append(recordCommentTemplate(commentData));	
				}
			});
		});
		$$('.recordLike').on('click', function(e) {
			e.stopPropagation();
			loadLogLike(recordId, 1);
		});
		
		$$('.sender').on('click',function() {
			app.myApp.getCurrentView().loadPage('contactsUserInfo.html?userId='+$$('#recSendId').val()+'&userName='+$$('#recSend').val());
		});
		//点击。。。展现删除按钮
		$$('.recordDetailDelete').on('click', function() {
			var clickedLink = this;
			var popoverHTML = '<div class="popover" style="width: 30%;">' +
				'<div class="popover-inner">' +
				'<div class="list-block recordPopover">' +
				'<ul>' +
				'<li class="deleteRecord"><a href="#" class="recordDetailDeleteButton" style="color:red;"><i class="icon icon-delete1" style="margin-right: 7%;"></i>删除</a></li>' +
				'<li><a href="#" class="recordDetailRecommendButton" style="color:red;"><i class="icon icon-recommend" style="margin-right: 7%;"></i>推荐</a></li>' +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</div>'
			var popover = app.myApp.popover(popoverHTML, clickedLink);
			$$('.recordPopover li a').on('click', function() {
				app.myApp.closeModal(popover);
			});
			$$('.recordDetailDeleteButton').on('click',function(){
				app.myApp.confirm('确定要删除吗？', function() {
					deleteWorkLog(recordId);
				});
			});
			if(userId == app.userId){
				$$('.deleteRecord').css('display','block');
			}else{
				$$('.deleteRecord').css('display','none');
			}
		});
	}

	/**
	 * 加载日志点赞 
	 * @param {Object} recordId
	 */
	function loadLogLike(recordId, isClick) {
		app.ajaxLoadPageContent(loadLogLikePath, {
			workLogId: recordId,
			userId: app.userId,
			isClick: isClick,
		}, function(result) {
			var data = result;
			console.log(data);
			if(data.success == true) {
				$$('.recordLike>i').removeClass('icon-noCollect').addClass('icon-collect');
				$$('.likeStatus').html('取消');
			} else {
				$$('.recordLike>i').removeClass('icon-collect').addClass('icon-noCollect');
				$$('.likeStatus').html('赞');
			}
			if(data.likes) {
				$$('.likeList').html('<i class="icon icon-noCollect"></i>' + data.likes + ' 觉得很赞');
				var length = data.likes.split(',').length;
				$$('.recLikeTotal').html(length);
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
			var item = item.photo;
			photoBrowserPhotos.push(app.basePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader').append(
				'<div class="weui_uploader_bd kpiPicture">' +
				'<div class="picContainer" id="img_' + random + '">' +
				'<img src="' + app.basePath + item + '" class="picSize" />' +
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
		app.ajaxLoadPageContent(deleteWorkLogByIdPath, {
			id: recordId,
		}, function(result) {
			if(result.success == true){
				app.myApp.toast('删除成功', 'success').show(true);
				setTimeout(function() {
					//调用
					require(['js/pages/newRecord/newRecord'], function(newRecord) {
						newRecord.refresh();
					});
				}, 1000);
				app.myApp.hidePreloader();
				app.myApp.getCurrentView().back();
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
	}
});