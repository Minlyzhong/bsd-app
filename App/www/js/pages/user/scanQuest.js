define(['app',
  'hbs!js/hbs/satisfy',
  'hbs!js/hbs/operatingUserQuest'
],function(app,template, operatingTem){
  var $$ = Dom7;

  var personDetail = app.basePath + '/mobile/window/getOneById';
  // 提交评分
  var savePath = app.basePath + '/mobile/window';
  // 完结事项
  var overPath = app.basePath + '/mobile/operating/event/end/';

  var SatisfactionList = [{score:0, val:'非常满意'}, {score:1, val:'满意'}, {score:2, val:'一般'}, {score:3, val:'不满意'}, {score:4, val:'差'}, ];
  var qId = 0;
  var remarks = '';
  var score = 0;
  var applicant = '';
  var isChoose = false;
	// var applyCompany = '';
  var typeVal = '';
  var chooseLogType = 0;
  var operator = 0;
  var isoperatorChoose = false;

  function init(page) {

    console.log("init....");
    initData(page.query);
    ajaxLoadContent(page.query);
    clickEvent(page);
   
  }
  
  function initData(query) {
    qId = 0;
    isChoose = false;
    remarks = '';
    applicant = app.user.nickName;
    $$('#applicant').val(applicant);
    score = 0;
    // applyCompany = '';
    chooseLogType = 1;
    operator = 0;
    isoperatorChoose = false;
    $$('.Satisfaction').html(template(SatisfactionList));

  }

  /**
	 * 点击事件
	 */
	function clickEvent(page) {
		
		$$('.submit').on('click', submitContent);
		$$('.holdSubmit').on('click', submitContent);
		$$('.scoreF').on('click', setScore);
		
		
  }
  
   /**
	 * 提交
	 */
  function submitContent(){

    var index = $$(this).data('type') || 0;
    console.log('index');
    console.log(index);
    var str = '是否确认提交?';
    // applicant = $$('#applicant').val();
		// applyCompany = $$('#applyCompany').val();
    remarks = $$('#newsContent').val();
   
    typeVal = $$('#recordType').val();
    console.log(typeVal);

    if(app.selectMemo == false){
      app.myApp.alert('请选择您所办理的服务项目');
      return;
    }else if(app.selectOperating == false){
      app.myApp.alert('请选择您所办理的办事事项');
      return;
    }else if(isChoose == false){
      app.myApp.alert('请对此次的服务进行评分');
      return;
    }else if(isoperatorChoose == false){
      app.myApp.alert('请选择办事员');
      return;
    }else{
      if(index == 0){
        str = '是否确认提交?';
      }else{
        str = '是否确认提交并完结?';
      }
      app.myApp.confirm(str, function() {
        
        var formData={
          winId: qId,
          matId: app.marterId,
          eventId:app.eventId,
          operatingUser: operator,
          scoreType: score,
          rater: applicant,
          raterId: app.userDetail.userId,
          memo: remarks,
          tenantId: app.tenantId,
          applyCompany: app.applyCompany,
          deptId:app.userDetail.deptId,
          deptName:app.userDetail.deptName,
          rankingType:0
        }
        console.log(formData);
        // 暂时return
        // return;
           
        var formDatas= JSON.stringify(formData)
        
            // 提交到后台审核
            $$.ajax({
                url:savePath,
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset:utf-8', 
                data: formDatas,
                cache: false,
                success:function (data) {
            
                  if(data.data == true && data.code == 0){  
                    // $$('#applicant').val('');
                    $$('#newsContent').val('');
                    // $$('#applyCompany').val('');
                    if(index == 1){
                      submitHoldContent();
                    }else{
                      app.selectMemo = false;
                      app.selectOperating = false;
                      app.myApp.toast('提交成功！', 'success').show(true);
                      
                      app.myApp.getCurrentView().back();
                    }
                    
                    // app.myApp.getCurrentView().loadPage('result.html');
                    

                  }else{
              
                    app.myApp.alert(data.msg, );
                    
                  }
                  
                },
                error:function () {
                    app.myApp.alert("网络异常！");
                  
                    
                }
            });
      });
      
    }
   
  }
  
    /**
	 * 完结
	 */
  function submitHoldContent(){

            // 提交到后台审核
            $$.ajax({
                url:overPath+app.eventId,
                method: 'GET',
                dataType: 'json',
                contentType: 'application/json;charset:utf-8', 
                data: '',
                cache: false,
                success:function (data) {
            
                  if(data.data == true && data.code == 0){  
                    app.myApp.toast('该事项完结成功！', 'success').show(true);
                    app.myApp.getCurrentView().back();
                  }else{
                    app.myApp.alert(data.msg, );
                  }
                  
                },
                error:function () {
                    app.myApp.alert("网络异常！");
                                   
                }
            });
	}



  function setScore(){
    score = $$(this).data('score');
    console.log(score)
    $$('.Satisfaction li').removeClass('select');
    $$(this).addClass('select');
    isChoose = true;
  }

  
  
  function ajaxLoadContent(data) {

    console.log('data');
    console.log(data);
    qId = data.id;
    console.log('qId');
    console.log(qId);
    if(qId){
      app.qId = qId;
      app.ajaxLoadPageContent(personDetail,{
        id: qId
      },function(result){
        var detail = result.data;
        console.log(detail);
        if(result.msg == '成功' && result.data != null){
          app.tenantId = detail.tenantId;
         
          $$('.headerTitle').html(detail.winName+'服务满意度评分');

          console.log(detail.operatingPeopleList);

          var operatings = detail.operatingPeopleList;
          
          $$('.operatorList').html(operatingTem(operatings));
          if(operatings.length == 1){
            isoperatorChoose = true;
            $$('.operator').addClass('select');
            operator = operatings[0].userId;
          }

          $$('.operator').on('click', setOperator);

          function setOperator(){
            console.log('111');
            operator = $$(this).data('userId');
            console.log(operator);
            $$('.operatorList li').removeClass('select');
            $$(this).addClass('select');
            isoperatorChoose = true;
          }

        }else{
          app.myApp.alert("没有对应的信息",);
        }

      })
    }
  }



  
  
  return {
    init:init
  }
});