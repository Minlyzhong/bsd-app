define(['app'], function(app) {
	var $$ = Dom7;
	var firstIn = 1;
	var pageDataStorage = {};
	var pageNo = 1;
	var loading = true;
	var imageList = [];
	//获取双签内容
	var findDetailInfoPath = app.basePath + '/mobile/dbSign/';
	//上传签名
	var saveUserReportDetialPath = app.basePath + '/mobile/dbSign/sign';
	//上传附件
	var uploadReportDetialPhotoPath = app.basePath + '/file/upload';
	var signId = -1;
	var deptName = '';
	var SignResult = {};
	var count = 0;
	var imgLength = 0;
	var signPic = [];
	var signPicParam = {};
	var self = false;
	
	/**
	 * 页面初始化 
	 * @param {Object} page 页面内容
	 */
	function init(page) {
//		if(firstIn) {
		app.myApp.onPageBack("doubleSign/doubleSignDetail", function(page){
			page.view.params.swipeBackPage = true;
		});
			initData(page.query);
//		} else {
//			loadStorage();
//		}
		app.back2Home();
		attrDefine(page);

		//点击事件
		clickEvent();
		
		
	}

	/**
	 * 初始化模块变量
	 */
	function initData(pageData) {
		firstIn = 0;
		pageDataStorage = {};
		pageNo = 1;
		loading = true;
		SignResult = {};
		signId = pageData.id;
		imgLength = 0;
		count = 0;
		signPic = [];
		signPicParam = {};
		self = false;
		findDetailInfo();
		
		$$('#reSign').css('display','none');
		
	}
	
	/**
 	 * 读取缓存信息 
	 */
	function loadStorage() {
		
	}
	
	/**
	 * 属性定义（不传参，使用模块变量）
	 */
	function attrDefine(page) {
		
		
		console.log(page.query)
	
		console.log(page.query);
		deptName = page.query.deptName;
		
		
		
	}
	

	/**
	 * 获取签到内容
	 */
	function findDetailInfo() {
		app.ajaxLoadPageContent(findDetailInfoPath + signId, {
			
		}, function(data) {
			if(data.code == 0 && data.data !=null){
				SignResult = data.data;
				// imageList = data.data.images || [];
				var createTime = app.getnowdata(SignResult.createTime).split(' ')[0];
				var time = createTime+', '+ SignResult.week;
				$$('#assessTs').val(time);
				$$('#assessContent').val(SignResult.jobContent);
				$$('#weather').val(SignResult.weather);
				$$('#location').val(SignResult.workingAddress);
				$$('#assessTitle').val(SignResult.contentTitle);
				$$('#assessdeptName').val(deptName);
				if(SignResult.type == 0){
					$$('#signType').val('正常');
				}else{
					$$('#signType').val('请假');
				}
	
				if(SignResult.userId  == app.user.userId){
					$("#sign").css('display','none');
					$(".sumbit").css('display','none');
					self = true;
				}
				
				if(SignResult.villagePersonChargePic){
					self = true;
					$("#villagePerson").parent().css('display','block');
					$("#sign").css('display','none');
					$(".sumbit").css('display','none');
					var i = new Image();
					i.src = app.filePath + SignResult.villagePersonChargePic;
					$(i).appendTo($("#villagePerson")); // append the image (SVG) to DOM.	
					if(SignResult.vpcTime){
						var vTime = app.getnowdata(SignResult.vpcTime)
						$(".villagePersonTime").html(vTime);
					}
					
				}
	
				if(SignResult.groupLeaderSingPic){
					self = true;
					$("#sign").css('display','none');
					$(".sumbit").css('display','none');
					$("#groupLeader").parent().css('display','block')
					var i = new Image();
					i.src = app.filePath + SignResult.groupLeaderSingPic;
					$(i).appendTo($("#groupLeader")); // append the image (SVG) to DOM.	
					// if(SignResult.vpcTime){
					// 	var vTime = app.getnowdata(SignResult.vpcTime)
					// 	$(".groupLeaderTime").html(vTime);
					// }
				}
				if(SignResult.personChargeSignPic){
					self = true;
					$("#sign").css('display','none');
					$(".sumbit").css('display','none');
					$("#personCharge").parent().css('display','block')
					var i = new Image();
					i.src = app.filePath + SignResult.personChargeSignPic;
					$(i).appendTo($("#personCharge")); // append the image (SVG) to DOM.	
					if(SignResult.vpcTime){
						var vTime = app.getnowdata(SignResult.pcsTime)
						$(".personChargeTime").html(vTime);
					}
				}
			}else{
				app.myApp.toast('获取签到信息失败','error').show(true);
			}
			


		});
	}

	/**
	 * 点击事件
	 */
	function clickEvent(){
		$$('#sign').on('click',function(){
			app.myApp.getCurrentView().loadPage('doubleHandSign.html');
		})
		$$('#reSign').on('click',function(){

			app.myApp.getCurrentView().loadPage('doubleHandSign.html');
			var imageList = $$('#someelement img').length;
			console.log(imageList);
			if(imgLength < imageList){

				$("#someelement img")[imageList-1].remove();
			}
			
			
		})
		$$('.assessWorkBack').on('click',function(){
			if(self == true){
				app.myApp.getCurrentView().back();
			}else{
				app.myApp.confirm('是否退出？', function() {
					app.myApp.getCurrentView().back();
				});
			}
			
		});
		$$('.assessWorkHome').on('click',function(){
			
			app.myApp.confirm('是否返回首页？', function() {
				app.back3Home();
			});
		});

		$$('.sumbit').on('click',saveUserReportDetial);
		
    
	}

	    
	/**
	 * 保存签到信息
	 */
	function saveUserReportDetial() {
		
		if(signPic.length != 0){
			//防止数据传输过慢多次上传
			count = count + 1;
			if(count > 0){
				$$('.sumbit').attr('disabled',false);
			}

			// uploadReportDetialPhoto(signPic[1]);
			var str = "data:" + signPic[0] + "," + signPic[1]
			uploadReportDetialPhoto(str);
		}else{
			// app.myApp.alert('没有新的签名状态');
			app.myApp.toast('没有新的签名状态','error').show(true);
			return;
		}
		
		
		
	
	}

	/**
	 * 保存签到图片
	 */
	function savePic(){
		
		var formDatas= JSON.stringify(signPicParam)
		$$.ajax({
            url:saveUserReportDetialPath,
            method: 'POST',
            dataType: 'json',
            // processData: false, // 告诉jQuery不要去处理发送的数据
			// contentType: false, // 告诉jQuery不要去设置Content-Type请求头
			contentType: 'application/json;charset:utf-8',
            data: formDatas,
			cache: false,
			async: false,
            success:function (data) {
			
				if(data.code == 0 && data.data == true){
					app.myApp.toast('保存成功', 'success').show(true);
					$$('.rankSumbit').html('已保存');
					app.myApp.getCurrentView().back();
					
					require(['js/pages/doubleSign/doubleSign.js'], function(doubleSign) {
						doubleSign.refresh(false);
					});
				}else{
					app.myApp.toast(data.msg, 'error').show(true);
				}
				
						
		},
            error:function () {
				app.myApp.alert(app.utils.callbackAjaxError());
            }
        });
	}




	

	/**
	 *  上传图片
	 * @param {Object} photoDatas 相片数组
	 * @param {Object} detailID  考核明细ID
	 */
	function uploadReportDetialPhoto(photo) {
	
		var sum = 0;
		var ft = new FileTransfer();
			var uri = encodeURI(uploadReportDetialPhotoPath);
			var options = new FileUploadOptions();
			options.fileKey = "file";
			options.fileName = app.utils.generateGUID() + ".png";
			options.mimeType = "image/jpeg";
			options.chunkedMode = false;
			options.headers = {
				'Authorization': "bearer " + app.access_token
			}
			var params = {
				filePath: "",
				id: 0,
				name: "",
				type: 0
				
			}
			// options.params = params;
			ft.upload(photo, uri, function(r) {
				var data = JSON.parse(r.response);
				if(data.code == 0 && data.data != null) {
					var result = data.data;
					// params.ext = result.ext;
					params.name = app.user.nickName;
					params.filePath = result.filePath;
					params.id = SignResult.id;
					params.type = SignResult.type;
					// params.length = result.length;
					// imageList.push(params);
					signPicParam = params;
					savePic();
		
				} else {
					ft.abort();
					app.myApp.alert(app.utils.callbackAjaxError()+ '图片');
					return;
				}
			}, function(error) {
				ft.abort();
				app.myApp.alert(app.utils.callbackAjaxError() + '图片');
				return;
			}, options);
	}

	

		/**
	 * 选择签名页面回调 
	 * @param {Object} host 用户列表
	 */
	function addSignBack(picInfo) {
		signPic = picInfo;
		addSignInfoBack();
		$$('#sign').css('display','none');
		$$('#reSign').css('display','block');

	}
	/**
	 * 选择签名的信息显示回调
	 */
	function addSignInfoBack() {
		if(signPic) {
			var i = new Image();
            i.src = "data:" + signPic[0] + "," + signPic[1];
			$(i).appendTo($("#someelement .handSign")); // append the image (SVG) to DOM.	
			$('.mySign').css('display','block');
			// uploadReportDetialPhoto(signPic[1]);
		}else{
			signPic=[];
			$("#someelement").html('');
			$('.mySign').css('display','none');
		}
//		getAbsenteesBack();
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
		addSignBack: addSignBack
	}
});