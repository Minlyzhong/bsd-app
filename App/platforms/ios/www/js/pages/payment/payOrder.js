define(['app',
'hbs!js/hbs/recordRmLeader'], function(app, recordRmLeaderTemplate) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	//获取所选人需要缴纳的费用
	var payMoneyByPeoplePath = app.basePath + 'payment/payMoneyByPeople';
	var leaderList = [];
	var payOwn = 0;
	var chooseOpen = 0;
	var chooseMonth = [];

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		app.pageStorageClear('payment/payOrder', [
//			'payment/payPeople',
//			'payment/payDeal'
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
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		chooseOpen = 0;
		leaderList = [];
		var monthDate = [new Date().getFullYear() + '', ("0" + (new Date().getMonth() + 1)).slice(-2)];
		chooseMonth = [];
		chooseMonth.push(monthDate);
		chooseMonth.push(monthDate);
		payOwn = pageData.payOwn || 0;
		if(payOwn == 1) {
			var owner = {
				deptName: app.user.deptName,
				userId: app.userId,
				userName: app.user.userName
			};
			leaderList = [owner];
		}
		addLeaderBack(leaderList);
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
		monthPicker('payBeginMonth', chooseMonth[0]);
		monthPicker('payEndMonth', chooseMonth[1]);
	}
	
	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.createOrder').on('click', createOrder);
		$$('.rmPayPeople').on('click', recordRemoveLeader);
		$$('.addPayPeople').on('click', payPeople);
	}
	
		/**
	 *  选择缴纳人
	 */
	function payPeople() {
		app.myApp.getCurrentView().loadPage('payPeople.html?leaderList=' + JSON.stringify(leaderList));
	}

	/**
	 * 生成订单 
	 */
	function createOrder() {
		if(chooseOpen == 1) {
			return;
		}
		if(!$$('#payPeople').val() || !$$('#payBeginMonth').val() || !$$('#payEndMonth').val()) {
			app.myApp.alert('请补全缴纳信息');
			return;
		}
		var userIdArr = [];
		$$.each(leaderList, function(index, item) {
			userIdArr.push(item.userId);
		});
		payCalculate(userIdArr);
	}

	/**
	 * 计算费用 
	 */
	function payCalculate(userIdArr) {
		app.myApp.showPreloader('生成订单列表...');
		setTimeout(function() {
			app.ajaxLoadPageContent(payMoneyByPeoplePath, {
				beginDate: $$('#payBeginMonth').val(),
				endDate: $$('#payEndMonth').val(),
				userId: JSON.stringify(userIdArr),
			}, function(data) {
				app.myApp.hidePreloader();
				//				列表条数 不为0才显示表格
				var orderNum = 0;
				var paySum = 0;
				var tableHtml = '<tr><th>姓名</th><td>月份</td><td>应交</td></tr>';
				console.log(data);
				$$.each(data, function(_, item) {
					if(item.months == "") {
						return true;
					}
					var monthArr = item.months.split(",");
					$$.each(monthArr, function(index, month) {
						item.money = parseFloat(item.money);
						tableHtml += '<tr>';
						if(index == 0) {
							tableHtml += '<th rowspan=' + monthArr.length + '>' + item.userName + '</th>';
						}
						tableHtml += '<td>' + month + '</td><td>' + item.money + '</td></tr>';
						orderNum++;
						paySum += item.money;
					})
				});
				paySum = app.utils.getDecimal(paySum, 2);
				if(orderNum) {
					showPayOrderTable(tableHtml, paySum, data, $$('#payBeginMonth').val(), $$('#payEndMonth').val());
				} else {
					app.myApp.alert('所选缴款人在所选月份已经缴款，无需再次缴纳');
				}
			});
		}, 500);
	}

	/**
	 * 跳转到订单表格 
	 * @param {Object} tableHtml 填充到订单表格的HTML
	 * @param {Object} paySum 订单总额
	 * @param {Object} payPeopleList 订单总额
	 * @param {Object} beginDate 开始日期
	 * @param {Object} endDate 结束日期
	 */
	function showPayOrderTable(tableHtml, paySum, payPeopleList, beginDate, endDate) {
		var payPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">党费缴纳订单</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="payInfo">' +
			'<div style="padding: 10px;">' +
			'<table border="0" cellspacing="0" cellpadding="10" id="payOrderTable" class="payOrderTable">' +
			'</table>' +
			'</div>' +
			'<div class="m-t-10">' +
			'<ul style="padding: 0px;">' +
			'<li>' +
			'<a href="#" class="button payOrder">总计：<span class="paySum"></span>元，前往支付</a>' +
			'</li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.payOrderTable').html(tableHtml);
		$$('.paySum').html(paySum);
		$$('.payOrder').on('click', function() {
			app.myApp.getCurrentView().loadPage('payDeal.html?paySum=' + paySum + '&payPeopleList=' + JSON.stringify(payPeopleList) + '&beginDate=' + beginDate + '&endDate=' + endDate);
			app.myApp.closeModal(payPopup);
		});
	}

	/**
	 *  跳转移除发送到的用户
	 */
	function recordRemoveLeader() {
		var myPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left close-popup"><a href="#" class="link icon-only"><i class="icon icon-eback"></i></a></div>' +
			'<div class="center">需要发送的用户</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="deptBtnRow removeBtnRow">' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill allChoose">全选/反选</a></p>' +
			'<p style="margin: 0 10px;"><a href="#" class="button button-fill color-red rmLeader">移除</a></p>' +
			'</div>' +
			'<div class="list-block removeLeaderList searchbar-found" style="margin: 0;">' +
			'<ul>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.removeLeaderList ul').append(recordRmLeaderTemplate(leaderList));
		//全选反选
		$$('.removeBtnRow .allChoose').on('click', function() {
			$$.each($$('.removeLeaderList').find('input[name="payBox"]'), function(index, item) {
				if(!$$(item)[0].checked) {
					$$(item)[0].checked = true;
				} else {
					$$(item)[0].checked = false;
				}
			});
		});
		//移除人员
		$$('.removeBtnRow .rmLeader').on('click', function() {
			var search = $$('.removeLeaderList').find('input[name="payBox"]:checked');
			if(search.length == 0) {
				app.myApp.alert('请选择用户');
			} else {
				for(var i = search.length - 1; i >= 0; i--) {
					var id = $$(search[i]).val();
					for(var j = leaderList.length - 1; j >= 0; j--) {
						if(id == leaderList[j].userId) {
							leaderList.splice(j, 1);
						}
					}
				}
				app.myApp.closeModal(myPopup);
				addLeaderBack(leaderList);
			}
		});
	}

	/**
	 * 支付回调 
	 */
	function payCallback(title, result) {
		imgSrc = '';
		if(result) {
			imgSrc = 'img/paySuccess.png';
		} else {
			imgSrc = 'img/payError.png';
		}
		var payPopup = app.myApp.popup(
			'<div class="popup">' +
			'<div class="navbar">' +
			'<div class="navbar-inner">' +
			'<div class="left"></div>' +
			'<div class="center">支付结果</div>' +
			'<div class="right"></div>' +
			'</div>' +
			'</div>' +
			'<div class="page-content">' +
			'<div class="payCallback">' +
			'<img src="' + imgSrc + '" />' +
			'<div class="title">' + title + '</div>' +
			'</div>' +
			'<div class="m-t-10">' +
			'<ul style="padding: 0px;">' +
			'<li>' +
			'<a href="#" class="button payBack close-popup">返回</a>' +
			'</li>' +
			'</ul>' +
			'</div>' +
			'</div>' +
			'</div>'
		);
		$$('.close-popup').on('click', function() {
			var payment = require('js/pages/payment/payment');
			payment.loadPaymentStatus();
			app.myApp.closeModal(payPopup);
			app.myApp.getCurrentView().back();
		});
	}

	/**
	 *  月选择器初始化
	 */
	function monthPicker(content, monthDate) {
		var yearArr = [];
		var currentYear = new Date().getFullYear();
		for(var i = 0; i < 2; i++) {
			yearArr.push(currentYear - i);
		}
		var monthPick = app.myApp.picker({
			input: '#' + content,
			rotateEffect: true,
			toolbarTemplate: '<div class="toolbar">' +
				'<div class="toolbar-inner">' +
				'<div class="left">' +
				'<a href="#" class="link"></a>' +
				'</div>' +
				'<div class="right">' +
				'<a href="#" class="link close-picker" style="padding-right: 10px;">完成</a>' +
				'</div>' +
				'</div>' +
				'</div>',
			formatValue: function(p, values, displayValues) {
				//				console.log(values[0]);
				return values[0] + '-' + values[1];
			},
			value: [monthDate[0], monthDate[1]],
			cols: [{
				values: yearArr
			}, {
				divider: true,
				content: '年',
				width: 50,
			}, {
				values: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
				width: 100,
				textAlign: 'right'
			}, {
				divider: true,
				content: '月',
				width: 50,
			}, ],
			onOpen: function(picker) {
				chooseOpen = 1;
			},
			onClose: function(picker) {
				var beginDate = $$('#payBeginMonth').val();
				var endDate = $$('#payEndMonth').val();
				var nowDate = new Date().getFullYear() + '-' +("0" + (new Date().getMonth() + 1)).slice(-2);
				if(endDate > nowDate) {
					app.myApp.alert('请选择正确的缴纳区间<br />温馨提示：只支持当月缴纳或补缴<br />不支持提前缴纳');
					picker.setValue(monthDate);
				}
				if(beginDate > endDate) {
					app.myApp.alert('请选择正确的缴纳区间<br />温馨提示：只支持当月缴纳或补缴<br />不支持提前缴纳');
					$$('#payBeginMonth').val(endDate);
				}
				chooseOpen = 0;
				chooseMonth[0] = $$('#payBeginMonth').val().split('-');
				chooseMonth[1] = $$('#payEndMonth').val().split('-');
				console.log(chooseMonth);
			}
		});
	}

	/**
	 * 选择发送到的用户页面回调 
	 * @param {Object} content 用户列表
	 */
	function addLeaderBack(content) {
		leaderList = content;
		var leaderHtml = '';
		if(leaderList.length > 0) {
			try {
				$$.each(leaderList, function(index, item) {
					if(index > 1) {
						throw(' ');
					}
					leaderHtml += item.userName + '，';
				});
				$$('#payPeople').val(leaderHtml);
			} catch(e) {
				$$('#payPeople').val(leaderHtml + '等' + leaderList.length + '人');
				return; //在这里return  
			}
		} else {
			$$('#payPeople').val("");
		}
	}

	/**
	 * 上下拉操作 
	 */
	function pushAndPull(page) {
		//下拉刷新
		var ptrContent = $$(page.container).find('.pull-to-refresh-content');
		ptrContent.on('refresh', function(e) {
			setTimeout(function() {
				pageNo = 1;
				loading = true;
				//这里写请求
				app.myApp.pullToRefreshDone();
			}, 500);
		});

		//加载更多
		var loadMoreContent = $$(page.container).find('.infinite-scroll');
		loadMoreContent.on('infinite', function() {
			if(loading) return;
			loading = true;
			pageNo += 1;
			//这里写请求
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
		addLeaderBack: addLeaderBack,
		payCallback: payCallback,
		resetFirstIn: resetFirstIn,
	}
});