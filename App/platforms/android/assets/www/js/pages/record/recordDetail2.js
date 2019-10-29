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
	var loadWorkLogDetailPath = app.basePath + '/mobile/worklog/detail/';
	//加载日志评论
	var loadLogCommentPath = app.basePath + '/mobile/worklog/comments/';
	//保存日志评论
	var saveLogCommentPath = app.basePath + '/mobile/worklog/comment/';
	//删除日志评论
	var deleteLogCommentPath = app.basePath + '/mobile/worklog/delete/';
	//加载日志点赞
	var loadLogLikePath = app.basePath + '/mobile/worklog/likes/';
	//修改日志审阅状态
	var changeLogReviewedPath = app.basePath + '/mobile/worklog/read/';
	//加载工作日志图片:
	var loadWorkLogPhotosPath = app.basePath + '/mobile/worklog/photos/';

	//新增赞
	var addLikePath = app.basePath + '/political/content/likes';
	//取消点赞
	var cancelLikePath = app.basePath + '/political/content/likes/';

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
	var isOpen1;
	// 点赞
	var likes = false;
	var logTypeId = 0;
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
		isOpen1 = true;
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		app.back2Home();
		photoBrowserPhotos = [];
		photoBrowserPopup = '';
		userId = parseInt(pageData.userId);
		state = pageData.state;
		reviewName = pageData.reviewName;
		workType = pageData.workType;
		logTypeId = 0;
		likesId = 0;
		likes = false;
		
		if(userId == 0) {
			userId = app.userId;
		}
		recordId = pageData.id;
		if(state == false) {
			changeLogReviewed();
		} else {
			loadRecordDetail1(recordId);
		}
	}

	/**
	 *  修改日志审阅状态
	 */
	function changeLogReviewed() {
		app.ajaxLoadPageContent(changeLogReviewedPath+app.userId+'/'+recordId, {
			// userId: app.userId,
			// workId: recordId,
		}, function(result) {
			var data = result.data;
			console.log(data);
			if(data.msg !== "success") {
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
		app.ajaxLoadPageContent(loadWorkLogDetailPath + workType+'/' + recordId, {
			tenantId:app.user.tenantId
			// workLogId: recordId,
			// userId: userId,
			// dictCode: 'RZLX',
		}, function(result) {
			var data = result.data;
			logTypeId = result.data.logTypeId;
			reviewName = data.name;
			console.log(data);
			console.log(data.villageName);
			console.log(data.memberType);
			$$('#recDetailTitle1').val(data.logTitle);
			$$('#recDetailTs1').val(data.createTime);
			if(data.memberType == 1){				
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
					$$('#villageName1').val(data.villageName);
				}
			}else{
				$$('#recSend1').val(reviewName);
			}
			var workTypeVal ;
			if(data.logTypeId == 1){
				workTypeVal = '党员活动';
			}else{
				workTypeVal = '工作日志';
			}
			$$('#recType1').val(workTypeVal);
			$$('#recDetailContent1').val(data.logContent);
			$$('#recdeptName1').html(data.deptName);
			$$('#recSendId1').val(userId)
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
				console.log(likes);
				$$('.recordLike1>i').removeClass('icon-noCollect').addClass('icon-collect');
				$$('.likeStatus1').html('取消');

			}else{
				$$('.recordLike1>i').removeClass('icon-collect').addClass('icon-noCollect');
				$$('.likeStatus1').html('赞');
			}
			//				$$('.checkList').append(data[0].yesReviewed);
			//				$$('.uncheckList').append(data[0].NotReviewed);
			loadLogComment1(recordId);
			loadLogPhoto1(recordId,userId);
			
			loadLogLike1(recordId, 0);
			//showReadonlyPhotos1(data[1]);
		});
	}


	
	/*
	 * 加载工作日志的图片
	 */
	function loadLogPhoto1(recordId,userId){
		app.ajaxLoadPageContent(loadWorkLogPhotosPath+recordId, {
			// workLogId: recordId,
			// userId: userId,
			tenantId:app.tenantId
		}, function(result) {
			showReadonlyPhotos1(result.data);
		});
	}
	
	/**
	 * 加载工作日志评论 
	 * @param {Object} recordId 日志ID
	 */
	function loadLogComment1(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath+app.userId+'/'+recordId, {
			// workLogId: recordId,
			tenantId:app.tenantId
		}, function(result) {
			
			var data = result.data;
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


	/**
	 * 新增/取消点赞 
	 * @param {Object} recordId
	 */
	function addLike(recordId) {
		console.log(likes)
		if(likes){
			
			app.ajaxLoadPageContent(cancelLikePath+likesId, {
				
				// isClick: isClick,
				tenantId: app.user.tenantId
			}, function(result) {
				console.log(result)
				if(result.msg == 'success') {
					$$('.recordLike1>i').removeClass('icon-collect').addClass('icon-noCollect');
					$$('.likeStatus1').html('赞');
					likes = false;
					loadLogLike1(recordId, 1); 
					
				}	
			},{
				type:'DELETE'
			});

		}else{
			console.log(logTypeId);
			var types;
			if(logTypeId == 1){
				types = 7;
			}else if(logTypeId == 2){
				types = 5;
			}else{
				types = 6;
			}
			var params={
				articleId: recordId,
				userId: app.userId,
				userName: app.user.userName,
				type:types
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
						$$('.recordLike1>i').removeClass('icon-noCollect').addClass('icon-collect');
						$$('.likeStatus1').html('取消');
						likes = true;
						likesId = data.data.id;
						loadLogLike1(recordId, 1); 
					} 
					
				},
				error:function () {
				   
				}
			});

			

		}
	}

	function loadLogComment2(recordId) {
		app.ajaxLoadPageContent(loadLogCommentPath+app.userId+''+recordId, {
			// workLogId: recordId,
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
				app.ajaxLoadPageContent(deleteLogCommentPath+comId, {
					// id: comId,
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
			app.ajaxLoadPageContent(saveLogCommentPath+app.userId+'/'+recordId, {
				// workLogId: recordId,
				// userId: app.userId,
				// reviewerId: sendId,
				comment: comments,
			}, function(result) {
				var data = result;
				console.log(data);
				if(data.data == true) {
					var length = parseInt($$('.recCommentTotal').html()) + 1;
					$$('.recCommentTotal1').html(length);
//					var commentData = {
//						comment: comments,
//						reviewerId: sendId,
//						userId: userId,
//						reviewerName: sendName,
//						userName: app.user.userName,
//					};
					app.ajaxLoadPageContent(loadLogCommentPath+ app.userId +'/'+recordId , {
						// workLogId: recordId,
					}, function(result) {
						var data = result.data;
						
						console.log(data);
						$$('.commentList1').prepend(recordCommentTemplate(data[0]));
						$$('.commentList').prepend(recordCommentTemplate(data[0]));
						$$('.comments1').on('click', commentClick);
						$$('.recCommentWindow1 textarea').val("");
						$$('.recCommentWindow1 textarea').blur();
						$$('.recCommentWindow1').css('display', 'none');
					});	
				}
			},{
				type:'POST'
			});
		});
		$$('.recordLike1').on('click', function(e) {
			e.stopPropagation();
			addLike(recordId);
		});
	}

	/**
	 * 加载日志点赞 
	 * @param {Object} recordId
	 */
	function loadLogLike1(recordId, isClick) {
		app.ajaxLoadPageContent(loadLogLikePath+recordId, {
			// workLogId: recordId,
			// userId: app.userId,
			// isClick: isClick,
			tenantId: app.userDetail.tenantId
		}, function(result) {
			var data = result.data;
			console.log(data);
			
			if(data) {
				$$('.likeList1').html('<i class="icon icon-noCollect"></i>' + data + ' 觉得很赞');
				var length = data.split(',').length;
				if(length >= 10){
					$$('.openLike1').css('display','block');
					$$(".likeList1").css('height','100px');
					$$(".likeList1").css('overflow','hidden');
				}
				$$('.recLikeTotal1').html(length);
				$$(".openLike1").click(function(){
					if(isOpen1){
						$$(".likeList1").css('height','auto');
						$$(".likeList1").css('overflow','visible');
						isOpen1=false;
						$$(".openLike1").html('[收起]');
					}else{
						$$(".likeList1").css('height','100px');
						$$(".likeList1").css('overflow','hidden');
						isOpen1=true;
						$$(".openLike1").html('[展开]');
					}
				});
				
			} else {
				$$('.likeList1').html("");
				$$('.recLikeTotal1').html(0);
			}
			
			
			// if(data.success == true) {
			// 	$$('.recordLike1>i').removeClass('icon-noCollect').addClass('icon-collect');
			// 	$$('.likeStatus1').html('取消');
			// } else {
			// 	$$('.recordLike1>i').removeClass('icon-collect').addClass('icon-noCollect');
			// 	$$('.likeStatus1').html('赞');
			// }
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
			var item = item.attPath;
			photoBrowserPhotos.push(app.filePath + item);
			var random = app.utils.generateGUID();
			$$('.weui_uploader1').append(
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