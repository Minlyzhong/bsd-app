define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//加载试题
	var loadQuestionPath = app.basePath + '/mobile/education/exam/subject/';
	//提交试卷
	var finishSubjectPath = app.basePath + '/mobile/education/exam/submit/';
	//查询用户答错的所有题目
	//var findWrongPath = app.basePath + 'question/findWrongQuestionIds';
	var findWrongPath = app.basePath + '/mobile/education/exam/err/';
	//查询用户答错的某一道题题干及答案选项
	var findWrongQuestionsPath = app.basePath + '/mobile/education/exam/err/question/';
	var autoJump = 0;
	var examNumber = 0;
	var examShipWidth = 0.0;
	var id = 0;
	var examLength = 0;
	var examData = [];
	var chooseData = [];
	var falseData = [];
	var timer = null;
	var pageContent = '';
	var times = 0;
	var falseExam = 0;
	var count = 0;
//	var subId = 0;;
	var str = '';
	var flag = true;

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		//设置页面不能滑动返回
		page.view.params.swipeBackPage = false;
		app.myApp.onPageBack("exam/examAnswer", function(page){
			page.view.params.swipeBackPage = true;
		});
		
		//重置falseExam变量
		falseExam = 0;
		//重置时间
		window.clearInterval(timer);
		//重置点击次数  防止用户过多点击
		count = 0;
		str = '';
		flag = true;
		//arguments[1]是获取init方法的第二个参数
		var isFalse;
		var isFalse = arguments[1] ? 1 : 0;
		if(isFalse == 1) {
			falseExam = 1;
		}
		console.log(isFalse);
		console.log(falseExam);
		pageContent = page;
		initData(page.query);

		app.back2Home();
		
		attrDefine(page);
		clickEvent(page);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		console.log('初始化模块变量')
		console.log(pageData)
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		autoJump = 0;
		examNumber = 0;
		examShipWidth = 0.0;
		//获取试卷Id
//		subId = parseInt(pageData.subId);
		id = pageData.id;
		console.log(id);
		if(falseExam != 1) {
			if(parseInt(pageData.falseExam) == 1) {
				falseExam = 1;
			} else {
				falseExam = 0;
			}
		}
		console.log('falseExam');
		console.log(falseExam);
		examData = [];
		examLength = 0;
		chooseData = [];
		falseData = [];
		timer = null;
		times = 0;
		if(!falseExam) {
			
			ajaxLoadContent(pageData.time);
		} else {
			
			ajaxLoadFalse();
		}
	}

	/**
	 * 读取缓存数据 
	 */
	function loadStorage() {

	}

	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		if(falseExam) {
			//$$('.examA .pageTitle').html('错题集');
			$$('.examA .pageTitle').html('我的答题');
			//$$('.examAnswerHead').html('<span><span style="color:red">红色选项：错误答案</span><br/><span style="color:#3DA600">绿色选项：正确答案</span><br/>如果没有红色选项，则表示该题没选择答案</span>');
			$$('.examAnswerHead').html('<span><span style="color:red">红色选项：错误答案</span><br/><span style="color:#3DA600">绿色选项：正确答案</span></span>');
		} else {
			$$('.examA .pageTitle').html('开始答卷');
			$$('.examRest').html('');
		}
		$$('.examAnswerName').html(page.query.name);
		//屏幕宽度
		var clientWidth = $(document.body).width() + 'px';
		$$('.examAnswerTopic').css('width', clientWidth);
		//试题标签宽度
		var width = ($(document.body).width() - 10) / 6 - 8;
		examShipWidth = width;
		var size = parseInt(localStorage.getItem('examSettingFontSize')) || 0;
		var auto = parseInt(localStorage.getItem('examSettingAutoJump')) || 0;
		$$('.examSlide input').val(size);
		$$('.examSwitch input')[0].checked = auto;
		$$('.examAnswerBox').css('font-size', (size + 15) + 'px');
		autoJump = auto;
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		if(falseExam) {
			$$('.examBack').off('click', pageBack);
			$$('.examBack').on('click', falsePageBack);
		} else {
			$$('.examBack').off('click', falsePageBack);
			$$('.examBack').on('click', pageBack);
			$$('.examAnswerHeadSubmit').on('click', function() {
				submitExam('继续');
			});
		}
		$$('.examAnswerCover').on('click', closeCover);
		$$('.examAnswerBottom .pick').on('click', pickExam);
		$$('.examSetting').on('click', examSetting);
		$$('.examSlide input').on('touchmove change', changeFontSize);
		$$('.examSwitch input').on('change', changeAuto);
		$$('.examAnswerBottomHead .pre').on('click', preExam);
		$$('.examAnswerBottomHead .next').on('click', nextExam);
	}

	/**
	 * 返回页面 
	 */
	function pageBack() {
		app.myApp.confirm('您还在答题中，返回将作废本次作答，确认返回？', function() {
			app.myApp.getCurrentView().back();
		});
	}

	/**
	 * 错题返回页面 
	 */
	function falsePageBack() {
		app.myApp.getCurrentView().back();
	}

	/**
	 * 考试设置 
	 */
	function examSetting() {
		openCover();
		$('.examAnswerSetting').fadeIn(200);
	}

	/**
	 * 展开考试题目 
	 */
	function pickExam() {
		if($$('.examAnswerBottomPick').css('display') == 'none') {
			$$('.examPickNumber').removeClass('active');
			$$($$('.examPickNumber')[examNumber]).addClass('active');
			$('.examAnswerBottomPick').slideDown(200);
			var scrollWidth = parseInt(examNumber / 6) * (examShipWidth + 9);
			$$('.examAnswerBottomPick').scrollTop(scrollWidth);
			openCover();
		} else {
			$('.examAnswerBottomPick').slideUp(200);
			closeCover();
		}
	}

	/**
	 * 开启遮蔽框
	 */
	function openCover() {
		$('.examAnswerCover').css('display', 'block');
	}

	/**
	 * 关闭遮蔽框
	 */
	function closeCover() {
		$('.examAnswerBottomPick').slideUp(200);
		$('.examAnswerSetting').fadeOut(200);
		$$('.examAnswerCover').css('display', 'none');
	}

	/**
	 * 选择答案 
	 */
	function contentClick() {
		$$('.examAnswerContent').removeClass('active');
		$$(this).addClass('active');
		chooseData[examNumber].pick = $$(this).index();
		chooseData[examNumber].id = $$(this).data('id');
		if(autoJump == 1) {
			nextExam();
		}
	}

	/**
	 * 改变字体大小
	 */
	function changeFontSize() {
		var size = parseInt($$(this).val()) + 15;
		localStorage.setItem('examSettingFontSize', parseInt($$(this).val()));
		$$('.examAnswerBox').css('font-size', size + 'px');
	}

	/**
	 * 
	 */
	function changeAuto() {
		var auto = $$(this)[0].checked;
		if(auto == true) {
			auto = 1;
		} else {
			auto = 0;
		}
		autoJump = auto;
		localStorage.setItem('examSettingAutoJump', auto);
	}

	/**
	 * 异步请求试题数据 
	 */
	function ajaxLoadContent(time) {
		app.ajaxLoadPageContent(loadQuestionPath+id, {
			// id: id,
		}, function(data) {
			console.log(data);
			examData = data.data;
			examLength = data.data.length;
			if(examLength == 1) {
				$$('.examAnswerBottomHead .next').html('提交');
			}
			initExamPick();
			handleExamAnswer(1);
			$$('.examAnswerContent').on('click', contentClick);
			startTimer(time);
		});
	}

	/**
	 * 异步请求错题数据
	 */
	function ajaxLoadFalse() {
//		require(['js/pages/exam/examDetail'], function(examDetail) {
//			examDetail.ajaxLoadContent(subId);
//		});
		app.ajaxLoadPageContent(findWrongPath+id+'/'+app.userId, {
			// subjectId: id,
			// userId: app.userId,
		}, function(result) {
			console.log(result.data);
			examData = result.data;
			examLength = examData.length;
			
			// for(var i=0; i<examData.length; i++){
			// 	if(examData[i].isRight == false){
			// 		flag = false;
			// 		break;
			// 	}
			// }

			if(examLength == 0) {
				console.log('examLength1')//能打印
				app.myApp.alert('您本次试卷已得满分，没有错题', function() {
					//为啥这里打印不出来....
					console.log('examLength2')
					
					app.myApp.getCurrentView().back();

				});
				console.log('examLength3')//能打印
			} else {
				
				if(examLength == 1) {
					
					$$('.examAnswerBottomHead .next').html('没有了');
				}else{
					$$('.examAnswerBottomHead .next').html('下一题');
				}
				//initExamPick();
				
				initExamWrongPick();
			}
		});
	}

	/**
	 *  异步请求试题数据
	 * @param {Object} qid 试题ID
	 */
	// {id}/{subjectId}/{userId}
	function ajaxLoadFalseContent(qid) {
		app.ajaxLoadPageContent(findWrongQuestionsPath+qid+'/'+id+'/'+app.userId, {
			// subjectId: id,
			// userId: app.userId,
			// questionId: qid
		}, function(result) {
			console.log(result.data);
			falseData[examNumber] = result.data;
			if(examNumber) {
			
				changeExam('right');
			} else {
				
				handleFalse(1);
			}
		}, {
			async: false,
		});
	}

	/**
	 *  初始化选择器 
	 */
	function initExamPick() {
		$$('.examAnswerBottomPick').html('');
		for(var i = 0; i < examLength; i++) {
			console.log(examData);
			// var questionId = examData[i].questionId || 0;
			var questionId = examData[i].id || 0;
			$$('.examAnswerBottomPick').append('<span class="examPickNumber" data-id="' + questionId + '" style="width: ' + examShipWidth + 'px; height: ' + examShipWidth + 'px; line-height: ' + examShipWidth + 'px;">' + (i + 1) + '</span>');
			if(!falseExam) {
				chooseData[i] = {
					'pick': 0,
					'id': 0,
					'topicId': examData[i].id,
				};
			}
		}
		if(falseExam) {
			var qid = examData[0].questionId;
			ajaxLoadFalseContent(qid);
		}
		$$($$('.examPickNumber')[0]).addClass('active');
		$('.examPickNumber').click(pickNumber);
		//		$$('.examPickNumber').on('click', pickNumber);
	}
	
	/**
	 *  初始化错题选择器 
	 */
	function initExamWrongPick() {
		$$('.examAnswerBottomPick').html('');
		for(var i = 0; i < examLength; i++) {
			var questionId = examData[i].questionId || 0;
			var isRight = examData[i].isRight;
			//console.log(isRight == true);
			if(isRight){
				$$('.examAnswerBottomPick').append('<span class="examPickNumber" data-id="' + questionId + '" style="color:green;width: ' + examShipWidth + 'px; height: ' + examShipWidth + 'px; line-height: ' + examShipWidth + 'px;">' + (i + 1) + '</span>');
			}else{
				$$('.examAnswerBottomPick').append('<span class="examPickNumber" data-id="' + questionId + '" style="color:red;width: ' + examShipWidth + 'px; height: ' + examShipWidth + 'px; line-height: ' + examShipWidth + 'px;">' + (i + 1) + '</span>');
			}
			
			if(!falseExam) {
				chooseData[i] = {
					'pick': 0,
					'id': 0,
					'topicId': examData[i].id,
				};
			}
		}
		if(falseExam) {
			var qid = examData[0].questionId;
			ajaxLoadFalseContent(qid);
		}
		$$($$('.examPickNumber')[0]).addClass('active');
		$('.examPickNumber').click(pickNumber);
		//		$$('.examPickNumber').on('click', pickNumber);
	}

	/**
	 * 处理考试题目 
	 */
	function handleExamAnswer() {
		
		var display = arguments[0] == 1 ? 'block' : 'none';
		$$('.examAnswerBottom .pick').html((examNumber + 1) + '/' + examLength);
		var width = $(document.body).width() + 'px';
		var data = examData[examNumber];
		console.log('处理考试题目')
		console.log(data)
		var html = '<div data-id="' + data.id + '" class="examAnswerTopic" style="margin-bottom: 50px; position: absolute; display: ' +
			display + '; width: ' + width + ';">' + '<div class="examAnswerTitle">' +
			(examNumber + 1) + '、' + data.question + '（' + data.score + '分）</div>';
		var dataDetail = examData[examNumber].allAnswers;
		$$.each(dataDetail, function(index, item){
			if(item.memo || item.memo != undefined) {
			html += '<div data-id="' + item.id + '" class="examAnswerContent"><div></div><span> '+item.answer +'. '+ item.memo + '</span></div>';
		}
		})
		// if(data.A || data.A != undefined) {
		// 	html += '<div data-id="' + data.AID + '" class="examAnswerContent"><div></div><span>A. ' + data.A + '</span></div>';
		// }
		// if(data.B || data.B != undefined) {
		// 	html += '<div data-id="' + data.BID + '" class="examAnswerContent"><div></div><span>B. ' + data.B + '</span></div>';
		// }
		// if(data.C || data.C != undefined) {
		// 	html += '<div data-id="' + data.CID + '" class="examAnswerContent"><div></div><span>C. ' + data.C + '</span></div>';
		// }
		// if(data.D || data.D != undefined) {
		// 	html += '<div data-id="' + data.DID + '" class="examAnswerContent"><div></div><span>D. ' + data.D + '</span></div>';
		// }
		html += '</div>';
		$$('.examAnswerBox').append(html);
	}

	/**
	 * 查看错题集 
	 */
	function handleFalse() {
		var display = arguments[0] == 1 ? 'block' : 'none';
		$$('.examAnswerBottom .pick').html((examNumber + 1) + '/' + examLength);
		var width = $(document.body).width() + 'px';
		var data = falseData[examNumber];
		console.log(data);
		var html = '<div data-id="' + data.answerOptions[0].questionId + '" class="examAnswerTopic" style="margin-bottom: 50px; position: absolute; display: ' +
			display + '; width: ' + width + ';">' + '<div class="examAnswerTitle">' +
			(examNumber + 1) + '、' + data.question + '（' + data.score + '分）</div>';
			
		if(data.myAnswerIds){
			if(data.myAnswerIds[0] == 0){
				var uDoneStr = '<span style="color:red;position:absolute;right:20px;top:0px;">（您此题未作答）</span>';
				html += uDoneStr;
			}
		}
		$$.each(data.answerOptions, function(index, item) {
			var isFalse = '';
			console.log(data.myAnswerIds[0] == data.rightAnswerIds[0]);
			console.log(data.myAnswerIds[0]);
			console.log(data.rightAnswerIds[0]);
			if($.inArray(item.id, data.myAnswerIds) != -1 && data.myAnswerIds[0] !== data.rightAnswerIds[0]) {
				console.log('1')
				isFalse = 'false';
			}
			else if(($.inArray(item.id, data.rightAnswerIds) != -1) || (data.myAnswerIds[0] == data.rightAnswerIds[0] && ($.inArray(item.id, data.rightAnswerIds) != -1))){
				console.log('2')
				isFalse = 'true';
			}
			html += '<div data-id="' + item.id + '" class="examAnswerContent ' + isFalse + '"><span>' + item.answer + '. ' + item.memo + '</span></div>';
		});
		html += '</div>';
		$$('.examAnswerBox').append(html);
	}

	/**
	 * 开始倒计时
	 */
	function startTimer(time) {
		var t = parseInt(time) * 60;
		//console.log(t)
		$$('.examRest').html(app.utils.formatTimeBySecond(t));
		timer = window.setInterval(function() {
			t = t - 1;
			times = times + 1;
			if(t == 0) {
				window.clearInterval(timer);
				submitExam('重新');
			}
			$$('.examRest').html(app.utils.formatTimeBySecond(t));
		}, 1000);
	}

	/**
	 * 提交试卷 
	 */
	function submitExam(submitType) {
		var done = 0;
		var index = 0;
		for(var i = 0; i < examLength; i++) {
			if(!chooseData[i].pick) {
				done += 1;
				if(!index) {
					index = i + 1;
				}
			}
		}
		done = done != 0 ? '还有第' + index + '题等' + done + '道题没完成' : '已经做完试题';
		if(!index) {
			app.myApp.confirm('您' + done + '<br />请确认提交', saveExam);
			return;
		}
		var btns = [{
				text: '取消',
			},
			{
				text: submitType + '考试',
				onClick: function() {
					if(submitType == '继续') {
						app.myApp.confirm('是否跳到未做题目?', function() {
							$($('.examPickNumber')[index - 1]).click();
						});
					} else {
						firstIn = 1;
						$$('.examAnswerBox').html('');
						init(pageContent);
					}
				}
			},
			{
				text: '确认交卷',
				bold: true,
				onClick: saveExam,
			},
		];
		if(submitType == '重新') {
			btns.shift();
		}
		app.myApp.modal({
			text: '您' + done + '<br />请选择提交试卷或者' + submitType + '考试',
			buttons: btns,
		});
	}

	/**
	 * 上传试卷 
	 */
	function saveExam() {
		window.clearInterval(timer);
		app.myApp.showPreloader('上传成绩中...');
		count = count + 1;
		if(count>=1){
			//隐藏提交按钮
			$$(".examAnswerHeadSubmit").css('display','none');
		}
		var ans = [];
		for(var i = 0; i < examLength; i++) {
			var cid = chooseData[i].id;
			var tid = chooseData[i].topicId;
			var obj = {};
			obj[tid] = parseInt(cid);
			ans.push(obj);
		}

		app.ajaxLoadPageContent(finishSubjectPath+id+'/'+app.userId, {
			// userId: app.userId,
			// subjectId: id,
			questionId: JSON.stringify(ans),
			// useTime: app.utils.formatTimeStrBySecond(times),
			useTime: times,
		}, function(data) {
			console.log(data);
			
//			if(!data.success) {
//				html = '您已经考过本试卷，本次作答无效';
//			} else {
				str = '您的作答已批改完毕！<br />用时：' + app.utils.formatTimeStrBySecond(times) + '<br />答对了' + data.data.rightTotal +
					'题<br />答错了' + (examLength - data.data.rightTotal) + '题<br />试卷得分: ' + data.data.rightScore + '分';
//			}
			completeTheExam(str);
		},{
			type:'POST'
		});
	}
	/*
	 * 考试成绩
	 */
	function completeTheExam(str){
		console.log(str);
		var btns = [{
					text: '返回',
					onClick: function() {
						app.myApp.getCurrentView().back();
						require(['js/pages/exam/examDetail'], function(examDetail) {
							examDetail.ajaxLoadContent(id);
						});
						
					}
				},
				{
					text: '查看错题',
					onClick: function() {
						firstIn = 1;
						$$('.examAnswerBox').html('');
						//falseExam = 1;
						require(['js/pages/exam/examDetail'], function(examDetail) {
							examDetail.ajaxLoadContent(id);
						});
						init(pageContent, 1);
					}
				}
			];
//			setTimeout(function(){
//				app.myApp.hidePreloader();
				app.myApp.modal({
				text: str,
				buttons: btns,
				});			
//			},1000);
	}
	
	
	/**
	 * 选择题目
	 */
	function pickNumber() {
		$('.examAnswerBottomPick').slideUp(200);
		closeCover();
		if($$(this).index() == examNumber) {
			console.log('选择相同题号，跳出函数');
			return;
		}
		$$('.examPickNumber').removeClass('active');
		$$(this).addClass('active');
		var positions = $$(this).index() > examNumber ? 'right' : 'left';
		examNumber = $$(this).index();
		if(examNumber == 0) {
			$$('.examAnswerBottomHead .pre').css('color', '#999999');
		} else {
			$$('.examAnswerBottomHead .pre').css('color', 'black');
		}
		if(examNumber == examLength - 1) {
			if(falseExam) {
				$$('.examAnswerBottomHead .next').html('没有了');
			} else {
				$$('.examAnswerBottomHead .next').html('提交');
			}
		} else {
			$$('.examAnswerBottomHead .next').html('下一题');
		}
		changeExam(positions);
	}

	/**
	 * 上一题 
	 */
	function preExam() {
		if(examNumber == 0) {
			return;
		}
		$$('.examAnswerBottomHead .next').html('下一题');
		$('.examAnswerBottomPick').slideUp(200);
		closeCover();
		examNumber = examNumber - 1;
		if(examNumber == 0) {
			$$('.examAnswerBottomHead .pre').css('color', '#999999');
		} else {
			$$('.examAnswerBottomHead .pre').css('color', 'black');
		}
		changeExam('left');
	}

	/**
	 * 下一题 
	 */
	function nextExam() {
		$('.examAnswerBottomPick').slideUp(200);
		closeCover();
		if($$('.examAnswerBottomHead .next').html() == '下一题') {
			examNumber = examNumber + 1;
			if(examNumber == 0) {
				$$('.examAnswerBottomHead .pre').css('color', '#999999');
			} else {
				$$('.examAnswerBottomHead .pre').css('color', 'black');
			}
			if(examNumber == examLength - 1) {
				if(falseExam) {
					$$('.examAnswerBottomHead .next').html('没有了');
				} else {
					$$('.examAnswerBottomHead .next').html('提交');
				}

			} else {
				$$('.examAnswerBottomHead .next').html('下一题');
			}
			changeExam('right');
		} else if(falseExam) {

		} else {
			submitExam('继续');
		}
	}

	/**
	 * 变换试题
	 */
	function changeExam(positions) {
		if(!falseExam) {
			handleExamAnswer();
		} else {
			if(falseData[examNumber]) {
				handleFalse();
			} else {
				var questionId = parseInt($$($$('.examPickNumber')[examNumber]).data('id'));
				ajaxLoadFalseContent(questionId);
			}
		}
		var width = $(document.body).width() + 'px';
		if(positions == 'left') {
			$($(".examAnswerTopic")[0]).animate({
				'left': width
			}, 200, function() {
				$(this).remove();
			});
		} else {
			$($(".examAnswerTopic")[0]).animate({
				'right': width
			}, 200, function() {
				$(this).remove();
			});
		}
		$$('.examAnswerContent').off('click', contentClick);
		$$('.examAnswerBottomHead .pre').off('click', preExam);
		$$('.examAnswerBottomHead .next').off('click', nextExam);
		//$(".examAnswerTopic").css('display', 'block');
		$(".examAnswerTopic").fadeIn(400, function() {
			if(!falseExam) {
				var obj = chooseData[examNumber];
				if(obj.pick) {
					$$($$('.examAnswerContent')[(obj.pick - 1)]).addClass('active');
				}
				$$('.examAnswerContent').on('click', contentClick);
			}
			$$('.examAnswerBottomHead .pre').on('click', preExam);
			$$('.examAnswerBottomHead .next').on('click', nextExam);
		});
	}

	/**
	 * 重置firstIn变量 
	 */
	function resetFirstIn() {
		firstIn = 1;
		window.clearInterval(timer);
	}

	return {
		init: init,
		resetFirstIn: resetFirstIn,
	}
});