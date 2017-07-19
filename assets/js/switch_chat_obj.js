//更新最近会话的未读消息数
function updateSessDiv(sess_type, to_id, name, unread_msg_count) {
    var badgeDiv = document.getElementById("badgeDiv_" + to_id);
    if (badgeDiv && unread_msg_count > 0) {
        if (unread_msg_count >= 100) {
            unread_msg_count = '99+';
        }
        badgeDiv.innerHTML = "<span>" + unread_msg_count + "</span>";
        badgeDiv.style.display = "block";
    } else if (badgeDiv == null) { //没有找到对应的聊天id
        var headUrl;
        if (sess_type == webim.SESSION_TYPE.C2C) {
            headUrl = friendHeadUrl;
        } else {
            headUrl = groupHeadUrl;
        }
        addSess(sess_type, to_id, name, headUrl, unread_msg_count, 'xxim_chatlist');
    }
}

//新增一条最近会话
function addSess(sess_type, to_id, name, face_url, unread_msg_count, sesslist, addPositonType) {
    var sessDivId =to_id;
    var sessDiv =$("#dev"+sessDivId);
    if (sessDiv.length>0) { //先判断是否存在会话DIV，已经存在，则不需要增加
        return;
    }
    var sessList = document.getElementsByClassName("xxim_parentnode")[0];
    var sessUist=document.getElementsByClassName(sesslist)[0];
    if(!sessUist){
         sessUist=document.createElement("ul");//$("<ul class='"+sesslist+"'></ul>");
        sessUist.className = sesslist;
    }
    sessDiv = document.createElement("li");
   // sessDiv['data-id'] = sessDivId;
    sessDiv.className = "xxim_childnode";
    sessDiv.setAttribute("data-id",sessDivId); // 设置
    sessDiv.setAttribute("id","dev"+sessDivId);
    //如果当前选中的用户是最后一个用户
   // sessDiv.className = "sessinfo";


    var option={
        "To_Account":[sessDivId],
        "TagList":
            [
                "Tag_Profile_IM_Nick",
                "Tag_Profile_IM_Image"
            ]
    }
    webim.getProfilePortrait(option, function (resp) {
            console.log(JSON.stringify(resp));
         var userfile= resp==undefined||resp==null?"":resp.UserProfileItem;
            var  ToAccount =userfile[0]==undefined||userfile[0]==null?null:userfile[0].To_Account;
         var  profile =userfile[0]==undefined||userfile[0]==null?"":userfile[0].ProfileItem;
           if(profile&&profile[0].Value&&ToAccount){
               name=profile[0].Value;
               if(document.getElementById("dev"+ToAccount)){
                 var person=  document.getElementById("dev"+ToAccount);
                   person.childNodes[1].innerHTML=name;
               }
           }
            if(profile&&profile[1].Value&&ToAccount){
                face_url=profile[1].Value;
                if(document.getElementById("dev"+ToAccount)){
                    var person=  document.getElementById("dev"+ToAccount);
                    person.childNodes[0].src=face_url;
                }
            }
        },
        function (err) {
            alert(err.ErrorInfo);
        });
    var faceImg = document.createElement("img");
    //faceImg.id = "faceImg_" + to_id;
    faceImg.className = "xxim_oneface";
    faceImg.src = face_url;
    if (name.length > maxNameLen) { //名称过长，截取一部分
        name = name.substr(0, maxNameLen) + "...";
    }

    var nameDiv = document.createElement("span");
    //nameDiv.id = "nameDiv_" + to_id;
    nameDiv.className = "xxim_onename";
    nameDiv.innerHTML = name;
    var badgeDiv = document.createElement("div");
    badgeDiv.id = "badgeDiv_" + to_id;
    badgeDiv.className = "badge";
    if (unread_msg_count > 0) {
        if (unread_msg_count >= 100) {
            unread_msg_count = '99+';
        }
        badgeDiv.innerHTML = "<span>" + unread_msg_count + "</span>";
        badgeDiv.style.display = "block";
    }
    //添加单击用户头像事件
    sessDiv.onclick = function() {
        //if (sessDiv.className == "sessinfo-sel") return;
        // onSelSess(sess_type, to_id);/*  $(".layim_chatbox").remove();
        emotionFlag=false;
        $("body").append(str);
        var dataid= $(this).attr('data-id')
        $(".layim_names").html($(this).find('.xxim_onename').html());
        $(".layim_face").html("<img src="+$(this).find('img').attr('src')+">");
        selToID=to_id;
        //默认好友头像
        friendHeadUrl = $(this).find('dt').html();
        webim.setAutoRead(selSess, false, false);
        $(badgeDiv).css("display","none");
        // webim.syncMsgs();
        getLastC2CHistoryMsgs();
        //getPrePageC2CHistoryMsgs();
    };
    sessDiv.appendChild(faceImg);
    sessDiv.appendChild(nameDiv);
    sessDiv.appendChild(badgeDiv);
    sessUist.appendChild(sessDiv);

    if (!addPositonType || addPositonType == 'TAIL') {
        sessList.appendChild(sessUist); //默认插入尾部
    } else if (addPositonType == 'HEAD') {
        sessList.insertBefore(sessUist); //插入头部
    } else {
        console.log(webim.Log.error('未知addPositonType' + addPositonType));
    }
}

//切换好友或群组聊天对象
function onSelSess(sess_type, to_id) {
    if (selToID != null) {

        //将之前选中用户的样式置为未选中样式
        //setSelSessStyleOff(selToID);

        //设置之前会话的已读消息标记
        webim.setAutoRead(selSess, false, false);

        //保存当前的消息输入框内容到草稿
        //获取消息内容
        var msgtosend = document.getElementsByClassName("layim_write")[0].value;
        var msgLen = webim.Tool.getStrBytes(msgtosend);
        if (msgLen > 0) {
            webim.Tool.setCookie("tmpmsg_" + selToID, msgtosend, 3600);
        }

        //清空聊天界面
        document.getElementsByClassName("layim_chatarea")[0].innerHTML = "";

        selToID = to_id;
        //设置当前选中用户的样式为选中样式
        setSelSessStyleOn(to_id);

        var tmgmsgtosend = webim.Tool.getCookie("tmpmsg_" + selToID);
        if (tmgmsgtosend) {
            $("#layim_write").val(tmgmsgtosend);
        } else {
            $("#layim_write").val('');
        }

        bindScrollHistoryEvent.reset();


        if (sess_type == webim.SESSION_TYPE.GROUP) {
            if (selType == webim.SESSION_TYPE.C2C) {
                selType = webim.SESSION_TYPE.GROUP;
            }
            selSess = null;
            webim.MsgStore.delSessByTypeId(selType, selToID);

            getLastGroupHistoryMsgs(function(msgList) {
                getHistoryMsgCallback(msgList);
                bindScrollHistoryEvent.init();
            }, function(err) {
                alert(err.ErrorInfo);
            });
        } else {
            if (selType == webim.SESSION_TYPE.GROUP) {
                selType = webim.SESSION_TYPE.C2C;
            }

            //如果是管理员账号，则为全员推送，没有历史消息
            if (selToID == AdminAcount) {
                var sess = webim.MsgStore.sessByTypeId(selType, selToID);
                if (sess && sess.msgs() && sess.msgs().length > 0) {
                    getHistoryMsgCallback(sess.msgs());
                } else {
                    getLastC2CHistoryMsgs(function(msgList) {
                        getHistoryMsgCallback(msgList);
                        bindScrollHistoryEvent.init();
                    }, function(err) {
                        alert(err.ErrorInfo);
                    });
                }
                return;
            }

            //拉取漫游消息
            getLastC2CHistoryMsgs(function(msgList) {
                getHistoryMsgCallback(msgList);
                //绑定滚动操作
                bindScrollHistoryEvent.init();
            }, function(err) {
                alert(err.ErrorInfo);
            });
        }
    }
}

//删除会话
function deleteSessDiv(sess_type, to_id) {
    var sessDiv = document.getElementById("sessDiv_" + to_id);
    sessDiv && sessDiv.parentNode.removeChild(sessDiv);
}


//更新最近会话的名字
function updateSessNameDiv(sess_type, to_id, newName) {

    var nameDivId = "nameDiv_" + to_id;
    var nameDiv = document.getElementById(nameDivId);
    if (nameDiv) {
        if (newName.length > maxNameLen) { //帐号或昵称过长，截取一部分
            newName = newName.substr(0, maxNameLen) + "...";
        }
        nameDiv.innerHTML = webim.Tool.formatText2Html(newName);
    }
}

//更新最近会话的头像
function updateSessImageDiv(sess_type, to_id, newImageUrl) {
    if (!newImageUrl) {
        return;
    }
    var faceImageId = "faceImg_" + to_id;
    var faceImage = document.getElementById(faceImageId);
    if (faceImage) {
        nameDiv.innerHTML = webim.Tool.formatText2Html(newName);
    }
}

function setSelSessStyleOn(newSelToID) {

    var selSessDiv = document.getElementById("sessDiv_" + newSelToID);
    if (selSessDiv) {
        selSessDiv.className = "sessinfo-sel"; //设置当前选中用户的样式为选中样式
    } else {
        webim.Log.warn("不存在selSessDiv: selSessDivId=" + "sessDiv_" + newSelToID);
    }

    var selBadgeDiv = document.getElementById("badgeDiv_" + newSelToID);
    if (selBadgeDiv) {
        selBadgeDiv.style.display = "none";
    } else {
        webim.Log.warn("不存在selBadgeDiv: selBadgeDivId=" + "badgeDiv_" + selToID);
    }
}

function setSelSessStyleOff(preSelToId) {
    var preSessDiv = document.getElementById("sessDiv_" + preSelToId);
    if (preSessDiv) {
        preSessDiv.className = "sessinfo"; //将之前选中用户的样式置为未选中样式
    } else {
        webim.Log.warn("不存在preSessDiv: selSessDivId=" + "sessDiv_" + preSelToId);
    }
}