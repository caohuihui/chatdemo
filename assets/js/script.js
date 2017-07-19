/**
 * Created by DXZ-Hui.Cao on 2017/6/12.
 */
var str;
;(function ($) {
    var str1='<div id="xximmm" class="xxim_main">'
        +'<div class="xxim_top" id="xxim_top">'
        +'  <div class="xxim_search"><i class="fa fa-search"></i><input id="xxim_searchkey" /><span id="xxim_closesearch">×</span></div>'

        +'  <ul class="xxim_list" style="display:block">'
        +'<li data-id="1" class="xxim_parentnode">'
        +'<h5>'
        +'<i class="fa fa-caret-right">'
        +'<span class="xxim_parentname">最近联系人</span>'
        + '</i>'
        + '</h5>'
        + '</li>'
        + '</ul>'
        +'  <ul class="xxim_list"></ul>'
        +'  <ul class="xxim_list"></ul>'
        +'  <ul class="xxim_list xxim_searchmain" id="xxim_searchmain"></ul>'
        +'</div>'
        +'<ul class="xxim_bottom" id="xxim_bottom">'
        +'<li class="xxim_online" id="xxim_online">'
        +'<i class="xxim_nowstate fa fa-check-circle"></i><span id="xxim_onlinetex">在线</span>'
        +'<div class="xxim_setonline">'
        +'<span><i class="fa fa-check-circle"></i>在线</span>'
        +'<span class="xxim_setoffline"><i class="fa fa-check-circle"></i>隐身</span>'
        +'</div>'
        +'</li>'
        +'<li class="xxim_mymsg" id="xxim_mymsg" title="我的私信"><i class="fa fa-comment"></i>' +
       // '<a href="'+ config.msgurl +'" target="_blank"></a>' +
        '</li>'
        +'<li class="xxim_seter" id="xxim_seter" title="设置">'
        +'<i class="fa fa-gear"></i>'
        +'<div>'

        +'</div>'
        +'</li>'
        +'<li class="xxim_hide" id="xxim_hide"><i class="fa fa-exchange"></i></li>'
        +'<div class="layim_min" id="layim_min"></div>'
        +'</ul>'
        +'<div id="xxim_on" class="xxim_icon xxim_on fa fa-ellipsis-v"></div>'
        +'</div>';
    $("body").append(str1);
     str= '<div class="layim_chatbox" id="layim_chatbox">'
        +'<h6>'
        +'<span class="layim_move"></span>'
       // +'    <a href="'+ param.url +'" class="layim_face" target="_blank"><img src="'+ param.face +'" ></a>'
       // +'    <a href="'+ param.url +'" class="layim_names" target="_blank">'+ param.name +'</a>'
            +'<a href="#"  class="layim_face"></a>'
          +' <a href="#"  class="layim_names"></a>'
        +'    <span class="layim_rightbtn">'
        +'        <i class="layer_setmin">—</i>'
        +'        <i class="layim_close">&times;</i>'
        +'    </span>'
        +'</h6>'
        +'<div class="layim_chatmore" id="layim_chatmore">'
        +'    <ul class="layim_chatlist"></ul>'
        +'</div>'
        +'<div class="layim_groups" id="layim_groups"></div>'
        +'<div class="layim_chat">'
        +'    <div class="layim_chatarea" id="layim_chatarea">'
      //  +'        <ul class="layim_chatview layim_chatthis"  id="layim_area'+ param.type + param.id +'"></ul>'
        +'    </div>'
            +' <div id="wl_faces_box" class="wl_faces_box">'
        +'<div class="wl_faces_content">'
        +'<div class="title">'
        +'<ul>'
        +'<li class="title_name">常用表情</li>'
        +'<li class="wl_faces_close"><span>&nbsp;</span></li>'
        +'</ul>'
        +'</div>'
        +'<div id="wl_faces_main" class="wl_faces_main">'
        +'<ul id="emotionUL">'
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</div>'
        +'    <div class="layim_tool">'
        +'        <i class="layim_addface fa fa-meh-o" title="发送表情"></i>'
        +'        <a href="javascript:;"><i class="layim_addimage fa fa-picture-o" title="上传图片"></i></a>'
        +'<input type="file" id="upd_pic" title="上传图片" accept="gif,png,jpg">'

        +'        <a href="javascript:;"><i class="layim_addfile fa fa-paperclip" title="上传附件"></i></a>'
        +'<input type="file" id="upd_file" title="上传附件">'
        +'        <a href="" target="_blank" class="layim_seechatlog"><i class="fa fa-comment-o"></i>聊天记录</a>'
        +'    </div>'
        +'    <textarea class="layim_write" id="layim_write"></textarea>'
        +'    <div class="layim_send">'
        +'        <div class="layim_sendbtn" id="layim_sendbtn">发送<span class="layim_enter" id="layim_enter"><em class="layim_zero"></em></span></div>'
        +'        <div class="layim_sendtype" id="layim_sendtype">'
        +'            <span><i>√</i>按Enter键发送</span>'
        +'            <span><i></i>按Ctrl+Enter键发送</span>'
        +'        </div>'
        +'    </div>'
        +'</div>'
        +'</div>';
    //点击页面老师 弹出聊天框
    $(".teacher-data").each(function(){
       $(this).click(function(){
            $(".layim_chatbox").remove();
            emotionFlag=false;
               $("body").append(str);
           var dataid= $(this).attr('data-id')
           $(".layim_names").html($(this).find('dd').html());
           $(".layim_face").html($(this).find('dt').html());
           //最近联系人列表追加联系人
          var newul=$('.xxim_chatlist').length === 0 ?
              $("<ul class='xxim_chatlist'></ul>") : $('.xxim_chatlist');
           newul.appendTo($(".xxim_parentnode"))
           var friendlist=$("<li class='xxim_childnode' id='dev"+dataid+"'  data-id="+dataid+"></li>");
           var newsrc=$(this).find('img').attr('src')
           var friendpic=$("<img class='xxim_oneface' src="+newsrc+">")
           var friendname=$("<span class='xxim_onename'>"+$(this).find('dd').html()+"</span>")
           var badgeDiv=$('<div id="badgeDiv_2" class="badge"></div>')

           friendpic.appendTo(friendlist);
           friendname.appendTo(friendlist);
           badgeDiv.appendTo(friendlist);
           var length = $(".xxim_childnode").length;
           var isExist = false;
           if(length === 0) {
               friendlist.appendTo(newul)
           } else {
               for(var i=0;i<length;i++){
                   if($(".xxim_childnode").eq(i).attr('data-id')==dataid){
                       isExist = true;
                   }
               }
               if(!isExist) {
                   friendlist.appendTo(newul)
               }
           }
           //当前聊天的老师id
           selToID=$(this).attr("data-id");
            console.log('selToId', selToID)
           //默认好友头像
          friendHeadUrl = $(this).find('dt').html();
           webim.setAutoRead(selSess, false, false);
           var badgeDiv = document.getElementById("badgeDiv_" + selToID);
           if(badgeDiv){
               $(badgeDiv).css("display","none");
           }
           // webim.syncMsgs();
           getLastC2CHistoryMsgs();
           //getPrePageC2CHistoryMsgs();
       })
    })
    //单击聊天关闭按钮
    $(document).on("click",'.layim_close',function(){
        $(this).parents('.layim_chatbox').remove();
        webim.setAutoRead(selSess, false, false);
        selSess=null;
        selToID=null;
        emotionFlag=false;
    })
    //单击发送
    $(document).on("click","#layim_sendbtn",function(){
        onSendMsg();
    })

    //点击发送表情图标
   $(document).on("click",".layim_addface",function(){
       showEmotionDialog();

   })
    //选中表情
    $(document).on("click",".layim_addface li",function(){
        convertFaceMsgToHtml()

    })
    //关闭表情框
    $(document).on("click",".wl_faces_close",function(){
        turnoffFaces_box()
    })
   //单击最近联系人列表中的联系人
    $(document).on("click",".xxim_childnode",function(){
        $(".layim_chatbox").remove();
        emotionFlag=false;
        $("body").append(str);
        var dataid= $(this).attr('data-id')
        $(".layim_names").html($(this).find('.xxim_onename').html());
        $(".layim_face").html("<img src="+$(this).find('img').attr('src')+">");
        selToID=$(this).attr("data-id");
        //默认好友头像
        friendHeadUrl = $(this).find('dt').html();
        webim.setAutoRead(selSess, false, false);
        var badgeDiv = document.getElementById("badgeDiv_" + selToID);
        if(badgeDiv){
            $(badgeDiv).css("display","none");
        }
        // webim.syncMsgs();
        getLastC2CHistoryMsgs();
        //getPrePageC2CHistoryMsgs();
    })
    //最近联系人显示隐藏效果
    $(document).on('click','#xxim_on, .xxim_hide',function(){
        $('#xximmm').toggleClass('sss');
        $('.xxim_bottom').toggleClass('ddd');
    });
    $(document).on("change","#upd_pic",function(){
        uploadPic()
    })
    $(document).on("change","#upd_file",function(){
        uploadFile()
    })
    $(document).on("click","#xxim_seter",function(){
      // $("#set_profile_portrait_dialog").css({"display":"block","opacity":1,"top":"100px"})
        setProfilePortraitClick();
    })
    $(document).on("click",".btn",function(){
        $("#set_profile_portrait_dialog").css({"display":"none"})
    })
})(jQuery)




