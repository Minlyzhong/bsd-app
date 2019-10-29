define(['app',
	'hbs!js/hbs/recordComment2',
	'js/pages/record/record'
], function(app, recordCommentTemplate,record) {
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
	//加载工作日志图片url:
	var loadWorkLogPhotosPath = app.basePath + 'extWorkLog/loadWorkLogPhotos';

	var photoBrowserPhotos = [];
	var photoBrowserPopup = '';
	var sendId = '';
	var sendName = '';
	var recordId = '';
	var userId = 0;
	var state = -1;
	var reviewName = '';
	var workType = '';
	var id = 0;

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
		if(state == 0) {
			changeLogReviewed();
		} else {
			loadRecordDetail1(recordId);
		}
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
			loadRecordDetail1(recordId);
		});
	}
	
	/**
	 * 加载数据 
	 * @param {Object} recordId 日志ID
	 */
	function loadRecordDetail1(recordId) {
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
			$$('#recDetailTitle1').val(data[0].logTitle);
			$$('#recDetailTs1').val(data[0].logTime);
			if(data[0].memberType == 1){				
				if($$('.villName1').length == 0){
					$$('#recSend1').val(reviewName+'(第一书记)');
					var str = '<li class="villName1">';
					str += '<div class="item-content">';
					str += '<div class="item-inner">';
					str += '<div class="item-title kp-label">所驻村(社区):</div>';
					str += '<div class="item-input">';
					str += '<input type="text" id="villageName1" name="villageName1" placeholder="" readonly />';
					str += '</div>';
					str += '</div>';
					str += '</div>';
					str += '</li>';
					$$('.recdeptNameLi1').append(str);
					$$('#villageName1').val(data[0].villageName);
				}
			}else{
				$$('#recSend1').val(reviewName);
			}
			$$('#recType1').val(workType);
			$$('#recDetailContent1').val(data[0].logContent);
			$$('#recdeptName1').html(data[0].deptName);
			$$('#recSendId1').val(userId)
			//				$$('.checkList').append(data[0].yesReviewed);
			//				$$('.uncheckList').append(data[0].NotReviewed);
			loadLogPhoto1(recordId,userId);
			loadLogComment1(recordId);
			loadLogLike1(recordId, 0);
			//showReadonlyPhotos1(data[1]);
		});
	}
	
	/*
	 * 加载工作日志的图片
	 */
	function loadLogPhoto1(recordId,userId){
		app.ajaxLoadPageContent(loadWorkLogPhotosPath, {
			workLogId: recordId,
			userId: userId,
		}, function(result) {
			showReadonlyPhotos1(result);
		});
	}
	
	/**
	 * 加载工作日志评论 
	 * @param {Object} recordId 日志ID
	 */
	function loadLogComment1(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath, {
			workLogId: recordId,
		}, function(result) {
			var data = result;
			console.log(data);
			if(data.length) {
				$$('.recCommentTotal').html(data.length);
				$$('.commentList1').append(recordCommentTemplate(data));

				$$('.comments1').on('click', commentClick);
			} else {
				$$('.recCommentTotal').html(0);
			}
		});
	}
	function loadLogComment2(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath, {
			workLogId: recordId,
		}, function(result) {
			var data = result;
			id1=data[data.length-1].id;
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
					$$.each($$('.comments1'), function(index, item) {
						if($$(item).data('commentid') == comId) {
							$$(item).remove();
						}
					});
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
			$$('.recCommentWindow1').css('display', 'block');
			$$('.recCommentWindow1 textarea').attr('placeholder', "回复 " + sendName + ': ');
			$$('.recCommentWindow1 textarea').focus();
		}
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$(document).click(function(e) {
			var con = $('.recCommentWindow1 textarea'); // 设置目标区域
			if(!con.is(e.target) && con.has(e.target).length === 0) {
				$$('.recCommentWindow1 textarea').blur();
				$$('.recCommentWindow1').css('display', 'none');
			}
		});
		$$('.recordComment').on('click', function(e) {
			e.stopPropagation();
			sendId = 0;
			sendName = 0;
			$$('.recCommentWindow1').css('display', 'block');
			$$('.recCommentWindow1 textarea').attr('placeholder', '说点评论吧');
			$$('.recCommentWindow1 textarea').focus();
		});
		$$('.sendBtn').on('click', function(e) {
			e.stopPropagation();
			var comments = $$('.recCommentWindow1 textarea').val().trim();
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
					$$('.recCommentTotal1').html(length);
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
						$$('.commentList1').append(recordCommentTemplate(data[data.length-1]));
						$$('.commentList').append(recordCommentTemplate(data[data.length-1]));
						$$('.comments1').on('click', commentClick);
						$$('.recCommentWindow1 textarea').val("");
						$$('.recCommentWindow1 textarea').blur();
						$$('.recCommentWindow1').css('display', 'none');
					});	
				}
			});
		});
		$$('.recordLike1').on('click', function(e) {
			e.stopPropagation();
			loadLogLike1(recordId, 1);
		});
	}

	/**
	 * 加载日志点赞 
	 * @param {Object} recordId
	 */
	function loadLogLike1(recordId, isClick) {
		app.ajaxLoadPageContent(loadLogLikePath, {
			workLogId: recordId,
			userId: app.userId,
			isClick: isClick,
		}, function(result) {
			var data = result;
			console.log(data);
			if(data.success == true) {
				$$('.recordLike1>i').removeClass('icon-noCollect').addClass('icon-collect');
				$$('.likeStatus1').html('取消');
			} else {
				$$('.recordLike1>i').removeClass('icon-collect').addClass('icon-noCollect');
				$$('.likeStatus1').html('赞');
			}
			if(data.likes) {
				$$('.likeList1').html('<i class="icon icon-noCollect"></i>' + data.likes + ' 觉得很赞');
				var length = data.likes.split(',').length;
				$$('.recLikeTotal1').html(length);
			} else {
				$$('.likeList1').html("");
				$$('.recLikeTotal1').html(0);
			}
			
			
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
	function showReadonlyPhotos1(picUrlList) {
		$$.each(picUrlList, function(index, item) {
			var item = item.photo;
			photoBrowserPhotos.push(app.basePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader1').append(
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