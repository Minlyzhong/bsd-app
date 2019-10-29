define(['app',
	'hbs!js/hbs/userRegistered'
//	,'hbs!js/hbs/userDeptEdit',
//	'hbs!js/hbs/userInfo',
//	'hbs!js/hbs/userDeptInfo'
], function(app, editTemplate 
//	,deptTemplate, userInfoTemplate, deptInfoTemplate
) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	// 查询'党组织类型'选项值
	var findPT = app.basePath + '/mobile/biDictValue/findPartyType';
	// 查询'人员分类'选项值
	var findRYFL = app.basePath + '/mobile/biDictValue/findRYFL';
	// 查询'人员编制'选项值
	var findRYBZ = app.basePath + '/mobile/biDictValue/findRYBZ';
	// 查询'职业分类'选项值
	var findZY = app.basePath + '/mobile/biDictValue/findZYFL';
	// 查询'在职状态'选项值
	var findZZ = app.basePath + '/mobile/biDictValue/findZZZT';
	// 查询'行政职务'选项值
	var findXZ = app.basePath + '/mobile/biDictValue/findXZZW';
	// 查询'职务级别'选项值
	var findZW = app.basePath + '/mobile/biDictValue/findZWJB';
	// 查询'性别'选项值
	var findS = app.basePath + '/mobile/biDictValue/findSex';
	// 查询'政治面貌'选项值
	var findZM = app.basePath + '/mobile/biDictValue/findZZMM';
	// 查询'学历'选项值
	var findXL = app.basePath + '/mobile/biDictValue/findXL';
	// 查询'婚姻状况'选项值
	var findHY = app.basePath + '/mobile/biDictValue/findHYZK';
	// 查询'民族'选项值
	var findMZ = app.basePath + '/mobile/biDictValue/findMZ';
	//提交个人信息
	var saveEditPath = app.basePath + '/mobile/user';
	//提交支部信息
	var saveDeptPath = app.basePath + 'orgDept/update4Mobile';
	//流动党员注册接口
	var partyMembersReg = app.basePath + '/mobile/user';
	//验证手机格式对错
	var checkphone; 
	//验证身份证格式对错
	var checkID;
	var userData = {};

	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
		initData(page.query);
		app.back2Home();
		app.myApp.showPreloader('加载中...');
		window.setTimeout(function() {
			attrDefine(page);
			clickEvent(page);
		}, 500);
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		checkphone = false; 
		checkID = false;
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
		ajaxUserLoad();
		$$('.editList ul').html(editTemplate(userData));
		addCalendar('partyTime');
		addCalendar('birthday');
		addCalendar('workTime');
		app.myApp.hidePreloader();
	}

	/**
	 * 点击事件
	 */
	function clickEvent(page) {
		$$('.editSave').on('click', editSave);
		//检查手机号码是否符合
		$$("#userPhone").on('keyup',function(){
			checkCellphone($$("#userPhone").val());
			if(checkphone){
				$$('.phoneNum').css('background-image','url(img/newIcon/right.png)');
			}else{
				$$('.phoneNum').css('background-image','url(img/newIcon/wrong.png)');
			}
		});
		//检查身份证号码是否符合
		$$("#cardNo").on('keyup',function(){
			checkIDCard($$("#cardNo").val());
			if(checkID){
				$$('.identityReg').css('background-image','url(img/newIcon/right.png)');
			}else{
				$$('.identityReg').css('background-image','url(img/newIcon/wrong.png)');
			}
		});
	}
	/*
	 * 检验手机号时候正确
	 */
	function checkCellphone(cellphone) {
		 var regex = new RegExp('^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8}$');
		 checkphone = regex.test(cellphone);
	}
	/*
	 * 检验身份证号是否正确
	 */
	function checkIDCard(Identity){
		var Identityregex = new RegExp('^(\\d{6})(19|20)(\\d{2})(1[0-2]|0[1-9])(0[1-9]|[1-2][0-9]|3[0-1])(\\d{3})(\\d|X|x)?$');
		checkID = Identityregex.test(Identity);
	}

	/**
	 * 保存修改 
	 */
	function editSave() {
//		app.myApp.alert($$('#userNameReg').val());
//		app.myApp.alert($$('#userPhone').val());
//		app.myApp.alert($$('#userDept').val());
//		app.myApp.alert($$('#officerName').val());
//		app.myApp.alert($$('#cardNo').val());
//		app.myApp.alert($$('#partyTime').val());
//		app.myApp.alert($$('#birthday').val());
//		app.myApp.alert($$('#workTime').val());
//		app.myApp.alert($$('#sex').val());
//		app.myApp.alert($$('#politics').val());
//		app.myApp.alert($$('#minority').val());
//		app.myApp.alert($$('#education').val());
//		app.myApp.alert($$('#marital').val());
//		app.myApp.alert($$('#ryfl').val());
//		app.myApp.alert($$('#rybz').val());
//		app.myApp.alert($$('#zyfl').val());
//		app.myApp.alert($$('#zzzt').val());
//		app.myApp.alert($$('#xzzw').val());
//		app.myApp.alert($$('#zwjb').val());
		if($$('#userNameReg').val() == ''){
			app.myApp.alert('请输入姓名！');
			return false;
		}
		if($$('#userPhone').val() == ''){
			app.myApp.alert('请输入手机号码！');
			return false;
		}
		if($$('#userDept').val() == ''){
			app.myApp.alert('请输入所属组织！');
			return false;
		}
		if($$('#officerName').val() == ''){
			app.myApp.alert('请输入职务！');
			return false;
		}
		if($$('#cardNo').val() == ''){
			app.myApp.alert('请输入身份证！');
			return false;
		}
		if($$('#partyTime').val() == ''){
			app.myApp.alert('请输入入党时间！');
			return false;
		}
		if($$('#birthday').val() == ''){
			app.myApp.alert('请输入出生日期！');
			return false;
		}
		if($$('#workTime').val() == ''){
			app.myApp.alert('请选择参加工作时间！');
			return false;
		}
		if($$('#sex').val() == -999){
			app.myApp.alert('请选择性别！');
			return false;
		}
		if($$('#politics').val() == -999){
			app.myApp.alert('请选择政治面貌！');
			return false;
		}
		if($$('#minority').val() == -999){
			app.myApp.alert('请选择民族！');
			return false;
		}
		if($$('#education').val() == -999){
			app.myApp.alert('请选择学历！');
			return false;
		}
		if($$('#marital').val() == -999){
			app.myApp.alert('请选择婚姻状况！');
			return false;
		}
		if($$('#ryfl').val() == -999){
			app.myApp.alert('请选择人员分类！');
			return false;
		}
		if($$('#rybz').val() == -999){
			app.myApp.alert('请选择人员编制！');
			return false;
		}
		if($$('#zyfl').val() == -999){
			app.myApp.alert('请选择职业分类！');
			return false;
		}
		if($$('#zzzt').val() == -999){
			app.myApp.alert('请选择在职状态！');
			return false;
		}
		if($$('#xzzw').val() == -999){
			app.myApp.alert('请选择行政职务！');
			return false;
		}
		if($$('#zwjb').val() == -999){
			app.myApp.alert('请选择职务级别！');
			return false;
		}	
		if(!checkphone){
			app.myApp.alert('手机号码格式错误！');
			return false;
		}
		if(!checkID){
			app.myApp.alert('身份证格式错误！');
			return false;
		}
		app.myApp.showPreloader('保存中...');


		var params={
			userNameReg:$$('#userNameReg').val(),
			userPhone:$$('#userPhone').val(),
			userDept:$$('#userDept').val(),
			officerName:$$('#officerName').val(),
			cardNo:$$('#cardNo').val(),
			partyTime:$$('#partyTime').val(),
			birthday:$$('#birthday').val(),
			workTime:$$('#workTime').val(),
			sex:$$('#sex').val(),
			politics:$$('#politics').val(),
			minority:$$('#minority').val(),
			education:$$('#education').val(),
			marital:$$('#marital').val(),
			ryfl:$$('#ryfl').val(),
			rybz:$$('#rybz').val(),
			zyfl:$$('#zyfl').val(),
			zzzt:$$('#zzzt').val(),
			xzzw:$$('#xzzw').val(),
			zwjb:$$('#zwjb').val(),
		}
		var formDatas= JSON.stringify(params)
		$$.ajax({
            url:saveRecordPath+'2'+'/'+'save',
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
            cache: false,
            success:function (data) {
            app.myApp.hidePreloader();
			app.myApp.toast("保存成功！", 'success').show(true);
            },
            error:function () {
               
            }
        });


	}
		

	/**
	 * 异步请求用户数据 
	 */
	function ajaxUserLoad() {
		ajaxLoadPageContent(findS, function(data) {
			userData['sexArr'] = data.data;
		});
		ajaxLoadPageContent(findZM, function(data) {
			userData['politicsArr'] = data;
		});
		ajaxLoadPageContent(findMZ, function(data) {
			userData['minorityArr'] = data;
		});
		ajaxLoadPageContent(findXL, function(data) {
			userData['educationArr'] = data;
		});
		ajaxLoadPageContent(findHY, function(data) {
			userData['maritalArr'] = data;
		});
		ajaxLoadPageContent(findRYFL, function(data) {
			userData['ryflArr'] = data;
		});
		ajaxLoadPageContent(findRYBZ, function(data) {
			userData['rybzArr'] = data;
		});
		ajaxLoadPageContent(findZY, function(data) {
			userData['zyflArr'] = data;
		});
		ajaxLoadPageContent(findZZ, function(data) {
			userData['zzztArr'] = data;
		});
		ajaxLoadPageContent(findXZ, function(data) {
			userData['xzzwArr'] = data;
		});
		ajaxLoadPageContent(findZW, function(data) {
			userData['zwjbArr'] = data;
		});
	}

	/**
	 * 异步请求支部数据
	 */
	function ajaxDeptLoad() {
		ajaxLoadPageContent(findPT, function(data) {
			userData['partyTypeArr'] = data;
		});
	}

	/**
	 * 异步请求 
	 * @param {Object} path  接口
	 * @param {Object} callback  回调方法
	 */
	function ajaxLoadPageContent(path, callback) {
		app.ajaxLoadPageContent(path, {

		}, function(data) {
			callback(data.data);
		}, {
			async: false,
		});
	}

	//初始化日历
	function addCalendar(contentID) {
		calID = app.myApp.calendar({
			input: '#' + contentID,
			toolbarCloseText: '完成',
			headerPlaceholder: '选择的日期',
			monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
			dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dayNamesShort: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
			dateFormat: 'yyyy-mm-dd',
			closeOnSelect: true,
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