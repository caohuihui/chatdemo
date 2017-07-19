/**
 * Created by DXZ-Weijiu.Wang on 2017/6/22.
 */
//IE9(��)����������õ���jsonp�ص�����
function jsonpCallback(rspData) {
  //���ýӿڷ��ص�����
  webim.setJsonpLastRspData(rspData);
}

//������Ⱥ����Ϣ����ͨ�����ޣ���ʾ�������
function onBigGroupMsgNotify(msgList) {
  for (var i = msgList.length - 1; i >= 0; i--) {//������Ϣ������ʱ��Ӻ���ǰ
    var msg = msgList[i];
    //console.warn(msg);
    webim.Log.warn('receive a new avchatroom group msg: ' + msg.getFromAccountNick());
    //��ʾ�յ�����Ϣ
    showMsg(msg);
  }
}

//��������Ϣ(˽��(������ͨ��Ϣ��ȫԱ������Ϣ)����ͨȺ(��ֱ��������)��Ϣ)�¼�
//newMsgList Ϊ����Ϣ���飬�ṹΪ[Msg]
function onMsgNotify(newMsgList) {
  var newMsg;
  for (var j in newMsgList) {//��������Ϣ
    newMsg = newMsgList[j];
    handlderMsg(newMsg);//��������Ϣ
  }
}

//������Ϣ��˽��(������ͨ��Ϣ��ȫԱ������Ϣ)����ͨȺ(��ֱ��������)��Ϣ��
function handlderMsg(msg) {
  var fromAccount, fromAccountNick, sessType, subType, contentHtml;

  fromAccount = msg.getFromAccount();
  if (!fromAccount) {
    fromAccount = '';
  }
  fromAccountNick = msg.getFromAccountNick();
  if (!fromAccountNick) {
    fromAccountNick = fromAccount;
  }

  //������Ϣ
  //��ȡ�Ự����
  //webim.SESSION_TYPE.GROUP-Ⱥ�ģ�
  //webim.SESSION_TYPE.C2C-˽�ģ�
  sessType = msg.getSession().type();
  //��ȡ��Ϣ������
  //�Ự����ΪȺ��ʱ��������Ϊ��webim.GROUP_MSG_SUB_TYPE
  //�Ự����Ϊ˽��ʱ��������Ϊ��webim.C2C_MSG_SUB_TYPE
  subType = msg.getSubType();

  switch (sessType) {
    case webim.SESSION_TYPE.C2C://˽����Ϣ
      switch (subType) {
        case webim.C2C_MSG_SUB_TYPE.COMMON://c2c��ͨ��Ϣ
          //ҵ����Ը��ݷ������ʺ�fromAccount�Ƿ�Ϊapp����Ա�ʺţ����ж�c2c��Ϣ�Ƿ�ΪȫԱ������Ϣ��������ͨ������Ϣ
          //����ҵ���ڷ���ȫԱ������Ϣʱ�������Զ�������(webim.MSG_ELEMENT_TYPE.CUSTOM,��TIMCustomElem)����Ϣ������������һ���ֶ�����ʶ��Ϣ�Ƿ�Ϊ������Ϣ
          contentHtml = convertMsgtoHtml(msg);
          webim.Log.warn('receive a new c2c msg: fromAccountNick=' + fromAccountNick + ", content=" + contentHtml);
          //c2c��Ϣһ��Ҫ�����Ѷ��ϱ��ӿ�
          var opts = {
            'To_Account': fromAccount,//�����ʺ�
            'LastedMsgTime': msg.getTime()//��Ϣʱ���
          };
          webim.c2CMsgReaded(opts);
          alert('�յ�һ��c2c��Ϣ(������Ϣ����ȫԱ������Ϣ): ������=' + fromAccountNick + ", ����=" + contentHtml);
          break;
      }
      break;
    case webim.SESSION_TYPE.GROUP://��ͨȺ��Ϣ������ֱ�������ҳ���������Ҫ������
      break;
  }
}

//sdk��¼
function sdkLogin() {
  //web sdk ��¼
  webim.login(loginInfo, listeners, options,
    function (identifierNick) {
      //identifierNickΪ��¼�û��ǳ�(û������ʱ��Ϊ�ʺ�)���޵�¼̬ʱΪ��
      webim.Log.info('webim��¼�ɹ�');
      applyJoinBigGroup(avChatRoomId);//�����Ⱥ
      hideDiscussForm();//�������۱�
      initEmotionUL();//��ʼ������
    },
    function (err) {
      alert(err.ErrorInfo);
    }
  );//
}

//�����Ⱥ
function applyJoinBigGroup(groupId) {
  var options = {
    'GroupId': groupId//Ⱥid
  };
  webim.applyJoinBigGroup(
    options,
    function (resp) {
      //JoinedSuccess:����ɹ�; WaitAdminApproval:�ȴ�����Ա����
      if (resp.JoinedStatus && resp.JoinedStatus == 'JoinedSuccess') {
        webim.Log.info('��Ⱥ�ɹ�');
        selToID = groupId;
      } else {
        alert('��Ⱥʧ��');
      }
    },
    function (err) {
      alert(err.ErrorInfo);
    }
  );
}

//��ʾ��Ϣ��Ⱥ��ͨ+����+��ʾ+�����
function showMsg(msg) {
  var isSelfSend, fromAccount, fromAccountNick, sessType, subType;
  var ul, li, paneDiv, textDiv, nickNameSpan, contentSpan;

  fromAccount = msg.getFromAccount();
  if (!fromAccount) {
    fromAccount = '';
  }
  fromAccountNick = msg.getFromAccountNick();
  if (!fromAccountNick) {
    fromAccountNick = 'δ֪�û�';
  }
  ul = document.getElementById("video_sms_list");
  var maxDisplayMsgCount = 4;
  //var opacityStep=(1.0/4).toFixed(2);
  var opacityStep = 0.2;
  var opacity;
  var childrenLiList = $("#video_sms_list").children();
  if (childrenLiList.length == maxDisplayMsgCount) {
    $("#video_sms_list").children(":first").remove();
    for (var i = 0; i < maxDisplayMsgCount; i++) {
      opacity = opacityStep * (i + 1) + 0.2;
      $('#video_sms_list').children().eq(i).css("opacity", opacity);
    }
  }
  li = document.createElement("li");
  paneDiv = document.createElement("div");
  paneDiv.setAttribute('class', 'video-sms-pane');
  textDiv = document.createElement("div");
  textDiv.setAttribute('class', 'video-sms-text');
  nickNameSpan = document.createElement("span");

  var colorList = ['red', 'green', 'blue', 'org'];
  var index = Math.round(fromAccount.length % colorList.length);
  var color = colorList[index];
  nickNameSpan.setAttribute('class', 'user-name-' + color);
  nickNameSpan.innerHTML = webim.Tool.formatText2Html(""+fromAccountNick + "");
  contentSpan = document.createElement("span");

  //������Ϣ
  //��ȡ�Ự���ͣ�Ŀǰֻ֧��Ⱥ��
  //webim.SESSION_TYPE.GROUP-Ⱥ�ģ�
  //webim.SESSION_TYPE.C2C-˽�ģ�
  sessType = msg.getSession().type();
  //��ȡ��Ϣ������
  //�Ự����ΪȺ��ʱ��������Ϊ��webim.GROUP_MSG_SUB_TYPE
  //�Ự����Ϊ˽��ʱ��������Ϊ��webim.C2C_MSG_SUB_TYPE
  subType = msg.getSubType();

  isSelfSend = msg.getIsSend();//��Ϣ�Ƿ�Ϊ�Լ�����

  switch (subType) {

    case webim.GROUP_MSG_SUB_TYPE.COMMON://Ⱥ��ͨ��Ϣ
      contentSpan.innerHTML = convertMsgtoHtml(msg);
      break;
    case webim.GROUP_MSG_SUB_TYPE.REDPACKET://Ⱥ�����Ϣ
      contentSpan.innerHTML = "[Ⱥ�����Ϣ]" + convertMsgtoHtml(msg);
      break;
    case webim.GROUP_MSG_SUB_TYPE.LOVEMSG://Ⱥ������Ϣ
      //ҵ���Լ����������߼�������չʾ���޶���Ч��
      contentSpan.innerHTML = "[Ⱥ������Ϣ]" + convertMsgtoHtml(msg);
      //չʾ���޶���
      showLoveMsgAnimation();
      break;
    case webim.GROUP_MSG_SUB_TYPE.TIP://Ⱥ��ʾ��Ϣ
      contentSpan.innerHTML = "[Ⱥ��ʾ��Ϣ]" + convertMsgtoHtml(msg);
      break;
  }
  textDiv.appendChild(nickNameSpan);
  textDiv.appendChild(contentSpan);

  paneDiv.appendChild(textDiv);
  li.appendChild(paneDiv);
  ul.appendChild(li);
}

//����Ϣת����Html
function convertMsgtoHtml(msg) {
  var html = "", elems, elem, type, content;
  elems = msg.getElems();//��ȡ��Ϣ������Ԫ������
  for (var i in elems) {
    elem = elems[i];
    type = elem.getType();//��ȡԪ������
    content = elem.getContent();//��ȡԪ�ض���
    switch (type) {
      case webim.MSG_ELEMENT_TYPE.TEXT:
        html += convertTextMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.FACE:
        html += convertFaceMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.IMAGE:
        html += convertImageMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.SOUND:
        html += convertSoundMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.FILE:
        html += convertFileMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.LOCATION://�ݲ�֧�ֵ���λ��
        //html += convertLocationMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.CUSTOM:
        html += convertCustomMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
        html += convertGroupTipMsgToHtml(content);
        break;
      default:
        webim.Log.error('δ֪��ϢԪ������: elemType=' + type);
        break;
    }
  }
  return webim.Tool.formatHtml2Text(html);
}

//�����ı���ϢԪ��
function convertTextMsgToHtml(content) {
  return content.getText();
}
//����������ϢԪ��
function convertFaceMsgToHtml(content) {
  var faceUrl = null;
  var data = content.getData();
  var index = webim.EmotionDataIndexs[data];

  var emotion = webim.Emotions[index];
  if (emotion && emotion[1]) {
    faceUrl = emotion[1];
  }
  if (faceUrl) {
    return "<img src='" + faceUrl + "'/>";
  } else {
    return data;
  }
}
//����ͼƬ��ϢԪ��
function convertImageMsgToHtml(content) {
  var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL);//Сͼ
  var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE);//��ͼ
  var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN);//ԭͼ
  if (!bigImage) {
    bigImage = smallImage;
  }
  if (!oriImage) {
    oriImage = smallImage;
  }
  return "<img src='" + smallImage.getUrl() + "#" + bigImage.getUrl() + "#" + oriImage.getUrl() + "' style='CURSOR: hand' id='" + content.getImageId() + "' bigImgUrl='" + bigImage.getUrl() + "' onclick='imageClick(this)' />";
}
//����������ϢԪ��
function convertSoundMsgToHtml(content) {
  var second = content.getSecond();//��ȡ����ʱ��
  var downUrl = content.getDownUrl();
  if (webim.BROWSER_INFO.type == 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
    return '[����һ��������Ϣ]demo�ݲ�֧��ie8(��)�����������������,����URL:' + downUrl;
  }
  return '<audio src="' + downUrl + '" controls="controls" onplay="onChangePlayAudio(this)" preload="none"></audio>';
}
//�����ļ���ϢԪ��
function convertFileMsgToHtml(content) {
  var fileSize = Math.round(content.getSize() / 1024);
  return '<a href="' + content.getDownUrl() + '" title="��������ļ�" ><i class="glyphicon glyphicon-file">&nbsp;' + content.getName() + '(' + fileSize + 'KB)</i></a>';

}
//����λ����ϢԪ��
function convertLocationMsgToHtml(content) {
  return '����=' + content.getLongitude() + ',γ��=' + content.getLatitude() + ',����=' + content.getDesc();
}
//�����Զ�����ϢԪ��
function convertCustomMsgToHtml(content) {
  var data = content.getData();
  var desc = content.getDesc();
  var ext = content.getExt();
  return "data=" + data + ", desc=" + desc + ", ext=" + ext;
}
//����Ⱥ��ʾ��ϢԪ��
function convertGroupTipMsgToHtml(content) {
  var WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
  var text = "";
  var maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
  var opType, opUserId, userIdList;
  var memberCount;
  opType = content.getOpType();//Ⱥ��ʾ��Ϣ���ͣ��������ͣ�
  opUserId = content.getOpUserId();//������id
  switch (opType) {
    case webim.GROUP_TIP_TYPE.JOIN://����Ⱥ
      userIdList = content.getUserIdList();
      //text += opUserId + "������";
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "��" + userIdList.length + "��";
          break;
        }
      }
      text = text.substring(0, text.length - 1);
      text += "���뷿��";
      //�����Ա����1
      memberCount = $('#user-icon-fans').html();
      $('#user-icon-fans').html(parseInt(memberCount) + 1);
      break;
    case webim.GROUP_TIP_TYPE.QUIT://�˳�Ⱥ
      text += opUserId + "�뿪����";
      //�����Ա����1
      memberCount = parseInt($('#user-icon-fans').html());
      if (memberCount > 0) {
        $('#user-icon-fans').html(memberCount - 1);
      }
      break;
    case webim.GROUP_TIP_TYPE.KICK://�߳�Ⱥ
      text += opUserId + "��";
      userIdList = content.getUserIdList();
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "��" + userIdList.length + "��";
          break;
        }
      }
      text += "�߳���Ⱥ";
      break;
    case webim.GROUP_TIP_TYPE.SET_ADMIN://���ù���Ա
      text += opUserId + "��";
      userIdList = content.getUserIdList();
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "��" + userIdList.length + "��";
          break;
        }
      }
      text += "��Ϊ����Ա";
      break;
    case webim.GROUP_TIP_TYPE.CANCEL_ADMIN://ȡ������Ա
      text += opUserId + "ȡ��";
      userIdList = content.getUserIdList();
      for (var m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "��" + userIdList.length + "��";
          break;
        }
      }
      text += "�Ĺ���Ա�ʸ�";
      break;

    case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO://Ⱥ���ϱ��
      text += opUserId + "�޸���Ⱥ���ϣ�";
      var groupInfoList = content.getGroupInfoList();
      var type, value;
      for (var m in groupInfoList) {
        type = groupInfoList[m].getType();
        value = groupInfoList[m].getValue();
        switch (type) {
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
            text += "Ⱥͷ��Ϊ" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
            text += "Ⱥ����Ϊ" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
            text += "Ⱥ��Ϊ" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
            text += "Ⱥ����Ϊ" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
            text += "Ⱥ���Ϊ" + value + "; ";
            break;
          default:
            text += "δ֪��ϢΪ:type=" + type + ",value=" + value + "; ";
            break;
        }
      }
      break;

    case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO://Ⱥ��Ա���ϱ��(����ʱ��)
      text += opUserId + "�޸���Ⱥ��Ա����:";
      var memberInfoList = content.getMemberInfoList();
      var userId, shutupTime;
      for (var m in memberInfoList) {
        userId = memberInfoList[m].getUserId();
        shutupTime = memberInfoList[m].getShutupTime();
        text += userId + ": ";
        if (shutupTime != null && shutupTime !== undefined) {
          if (shutupTime == 0) {
            text += "ȡ������; ";
          } else {
            text += "����" + shutupTime + "��; ";
          }
        } else {
          text += " shutupTimeΪ��";
        }
        if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m == maxIndex) {
          text += "��" + memberInfoList.length + "��";
          break;
        }
      }
      break;
    default:
      text += "δ֪Ⱥ��ʾ��Ϣ���ͣ�type=" + opType;
      break;
  }
  return text;
}

//tls��¼
function tlsLogin() {
  //��ת��TLS��¼ҳ��
  TLSHelper.goLogin({
    sdkappid: loginInfo.sdkAppID,
    acctype: loginInfo.accountType,
    url: window.location.href
  });
}
//������Ӧ����Ҫʵ��������������������õ�UserSig
function tlsGetUserSig(res) {
  //�ɹ��õ�ƾ֤
  if (res.ErrorCode == webim.TLS_ERROR_CODE.OK) {
    //�ӵ�ǰURL�л�ȡ����Ϊidentifier��ֵ
    loginInfo.identifier = webim.Tool.getQueryString("identifier");
    //�õ���ʽ���ƾ֤
    loginInfo.userSig = res.UserSig;
    //�ӵ�ǰURL�л�ȡ����Ϊsdkappid��ֵ
    loginInfo.sdkAppID = loginInfo.appIDAt3rd = Number(webim.Tool.getQueryString("sdkappid"));
    //��cookie��ȡaccountType
    var accountType = webim.Tool.getCookie('accountType');
    if (accountType) {
      loginInfo.accountType = accountType;
      sdkLogin();//sdk��¼
    } else {
      location.href = location.href.replace(/\?.*$/gi,"");
    }
  } else {
    //ǩ�����ڣ���Ҫ���µ�¼
    if (res.ErrorCode == webim.TLS_ERROR_CODE.SIGNATURE_EXPIRATION) {
      tlsLogin();
    } else {
      alert("[" + res.ErrorCode + "]" + res.ErrorInfo);
    }
  }
}

//����ͼƬ�¼�
function imageClick(imgObj) {
  var imgUrls = imgObj.src;
  var imgUrlArr = imgUrls.split("#"); //�ַ��ָ�
  var smallImgUrl = imgUrlArr[0];//Сͼ
  var bigImgUrl = imgUrlArr[1];//��ͼ
  var oriImgUrl = imgUrlArr[2];//ԭͼ
  webim.Log.info("Сͼurl:" + smallImgUrl);
  webim.Log.info("��ͼurl:" + bigImgUrl);
  webim.Log.info("ԭͼurl:" + oriImgUrl);
}


//�л�����audio����
function onChangePlayAudio(obj) {
  if (curPlayAudio) {//������ڲ�������
    if (curPlayAudio != obj) {//Ҫ���ŵ���������ǰ���ŵ�������һ��
      curPlayAudio.currentTime = 0;
      curPlayAudio.pause();
      curPlayAudio = obj;
    }
  } else {
    curPlayAudio = obj;//��¼��ǰ���ŵ�����
  }
}

//��������ͼƬ
function smsPicClick() {
  if (!loginInfo.identifier) {//δ��¼
    if (accountMode == 1) {//�й�ģʽ
      //��account_type���浽cookie��,��Ч����1��
      webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
      //����tls��¼����
      tlsLogin();
    } else {//����ģʽ
      alert('����д�ʺź�Ʊ��');
    }
    return;
  } else {
    hideDiscussTool();//�������۹�����
    showDiscussForm();//��ʾ���۱�
  }
}

//������Ϣ(��ͨ��Ϣ)
function onSendMsg() {

  if (!loginInfo.identifier) {//δ��¼
    if (accountMode == 1) {//�й�ģʽ
      //��account_type���浽cookie��,��Ч����1��
      webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
      //����tls��¼����
      tlsLogin();
    } else {//����ģʽ
      alert('����д�ʺź�Ʊ��');
    }
    return;
  }

  if (!selToID) {
    alert("����û�н��뷿�䣬�ݲ�������");
    $("#send_msg_text").val('');
    return;
  }
  //��ȡ��Ϣ����
  var msgtosend = $("#send_msg_text").val();
  var msgLen = webim.Tool.getStrBytes(msgtosend);

  if (msgtosend.length < 1) {
    alert("���͵���Ϣ����Ϊ��!");
    return;
  }

  var maxLen, errInfo;
  if (selType == webim.SESSION_TYPE.GROUP) {
    maxLen = webim.MSG_MAX_LENGTH.GROUP;
    errInfo = "��Ϣ���ȳ�������(���" + Math.round(maxLen / 3) + "����)";
  } else {
    maxLen = webim.MSG_MAX_LENGTH.C2C;
    errInfo = "��Ϣ���ȳ�������(���" + Math.round(maxLen / 3) + "����)";
  }
  if (msgLen > maxLen) {
    alert(errInfo);
    return;
  }

  if (!selSess) {
    selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
  }
  var isSend = true;//�Ƿ�Ϊ�Լ�����
  var seq = -1;//��Ϣ���У�-1��ʾsdk�Զ����ɣ�����ȥ��
  var random = Math.round(Math.random() * 4294967296);//��Ϣ�����������ȥ��
  var msgTime = Math.round(new Date().getTime() / 1000);//��Ϣʱ���
  var subType;//��Ϣ������
  if (selType == webim.SESSION_TYPE.GROUP) {
    //Ⱥ��Ϣ���������£�
    //webim.GROUP_MSG_SUB_TYPE.COMMON-��ͨ��Ϣ,
    //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-������Ϣ�����ȼ����
    //webim.GROUP_MSG_SUB_TYPE.TIP-��ʾ��Ϣ(��֧�ַ��ͣ���������Ⱥ��Ϣ������)��
    //webim.GROUP_MSG_SUB_TYPE.REDPACKET-�����Ϣ�����ȼ����
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;

  } else {
    //C2C��Ϣ���������£�
    //webim.C2C_MSG_SUB_TYPE.COMMON-��ͨ��Ϣ,
    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
  }
  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
  //�����ı��ͱ���
  var expr = /\[[^[\]]{1,3}\]/mg;
  var emotions = msgtosend.match(expr);
  var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
  if (!emotions || emotions.length < 1) {
    text_obj = new webim.Msg.Elem.Text(msgtosend);
    msg.addText(text_obj);
  } else {//�б���

    for (var i = 0; i < emotions.length; i++) {
      tmsg = msgtosend.substring(0, msgtosend.indexOf(emotions[i]));
      if (tmsg) {
        text_obj = new webim.Msg.Elem.Text(tmsg);
        msg.addText(text_obj);
      }
      emotionIndex = webim.EmotionDataIndexs[emotions[i]];
      emotion = webim.Emotions[emotionIndex];
      if (emotion) {
        face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
        msg.addFace(face_obj);
      } else {
        text_obj = new webim.Msg.Elem.Text(emotions[i]);
        msg.addText(text_obj);
      }
      restMsgIndex = msgtosend.indexOf(emotions[i]) + emotions[i].length;
      msgtosend = msgtosend.substring(restMsgIndex);
    }
    if (msgtosend) {
      text_obj = new webim.Msg.Elem.Text(msgtosend);
      msg.addText(text_obj);
    }
  }
  webim.sendMsg(msg, function (resp) {
    if (selType == webim.SESSION_TYPE.C2C) {//˽��ʱ�������촰���ֶ����һ��������Ϣ��Ⱥ��ʱ������ѯ�ӿڻ᷵���Լ�������Ϣ
      showMsg(msg);
    }
    webim.Log.info("����Ϣ�ɹ�");
    $("#send_msg_text").val('');

    hideDiscussForm();//�������۱�
    showDiscussTool();//��ʾ���۹�����
    hideDiscussEmotion();//���ر���
  }, function (err) {
    webim.Log.error("����Ϣʧ��:" + err.ErrorInfo);
    alert("����Ϣʧ��:" + err.ErrorInfo);
  });
}

//������Ϣ(Ⱥ������Ϣ)
function sendGroupLoveMsg() {

  if (!loginInfo.identifier) {//δ��¼
    if (accountMode == 1) {//�й�ģʽ
      //��account_type���浽cookie��,��Ч����1��
      webim.Tool.setCookie('accountType', loginInfo.accountType, 3600 * 24);
      //����tls��¼����
      tlsLogin();
    } else {//����ģʽ
      alert('����д�ʺź�Ʊ��');
    }
    return;
  }

  if (!selToID) {
    alert("����û�н��뷿�䣬�ݲ��ܵ���");
    return;
  }

  if (!selSess) {
    selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
  }
  var isSend = true;//�Ƿ�Ϊ�Լ�����
  var seq = -1;//��Ϣ���У�-1��ʾsdk�Զ����ɣ�����ȥ��
  var random = Math.round(Math.random() * 4294967296);//��Ϣ�����������ȥ��
  var msgTime = Math.round(new Date().getTime() / 1000);//��Ϣʱ���
  //Ⱥ��Ϣ���������£�
  //webim.GROUP_MSG_SUB_TYPE.COMMON-��ͨ��Ϣ,
  //webim.GROUP_MSG_SUB_TYPE.LOVEMSG-������Ϣ�����ȼ����
  //webim.GROUP_MSG_SUB_TYPE.TIP-��ʾ��Ϣ(��֧�ַ��ͣ���������Ⱥ��Ϣ������)��
  //webim.GROUP_MSG_SUB_TYPE.REDPACKET-�����Ϣ�����ȼ����
  var subType = webim.GROUP_MSG_SUB_TYPE.LOVEMSG;

  var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
  var msgtosend = 'love_msg';
  var text_obj = new webim.Msg.Elem.Text(msgtosend);
  msg.addText(text_obj);

  webim.sendMsg(msg, function (resp) {
    if (selType == webim.SESSION_TYPE.C2C) {//˽��ʱ�������촰���ֶ����һ��������Ϣ��Ⱥ��ʱ������ѯ�ӿڻ᷵���Լ�������Ϣ
      showMsg(msg);
    }
    webim.Log.info("���޳ɹ�");
  }, function (err) {
    webim.Log.error("���͵�����Ϣʧ��:" + err.ErrorInfo);
    alert("���͵�����Ϣʧ��:" + err.ErrorInfo);
  });
}
//���������ı���
function hideDiscussForm() {
  $(".video-discuss-form").hide();
}
//��ʾ�����ı���
function showDiscussForm() {
  $(".video-discuss-form").show();
}
//�������۹�����
function hideDiscussTool() {
  $(".video-discuss-tool").hide();
}
//��ʾ���۹�����
function showDiscussTool() {
  $(".video-discuss-tool").show();
}
//���ر����
function hideDiscussEmotion() {
  $(".video-discuss-emotion").hide();
  //$(".video-discuss-emotion").fadeOut("slow");
}
//��ʾ�����
function showDiscussEmotion() {
  $(".video-discuss-emotion").show();
  //$(".video-discuss-emotion").fadeIn("slow");

}
//չʾ���޶���
function showLoveMsgAnimation() {
  //��������1
  var loveCount = $('#user-icon-like').html();
  $('#user-icon-like').html(parseInt(loveCount) + 1);
  var toolDiv = document.getElementById("video-discuss-tool");
  var loveSpan = document.createElement("span");
  var colorList = ['red', 'green', 'blue'];
  var max = colorList.length - 1;
  var min = 0;
  var index = parseInt(Math.random() * (max - min + 1) + min, max + 1);
  var color = colorList[index];
  loveSpan.setAttribute('class', 'like-icon zoomIn ' + color);
  toolDiv.appendChild(loveSpan);
}

//��ʼ������
function initEmotionUL() {
  for (var index in webim.Emotions) {
    var emotions = $('<img>').attr({
      "id": webim.Emotions[index][0],
      "src": webim.Emotions[index][1],
      "style": "cursor:pointer;"
    }).click(function () {
      selectEmotionImg(this);
    });
    $('<li>').append(emotions).appendTo($('#emotionUL'));
  }
}

//�򿪻���ʾ����
function showEmotionDialog() {
  if (openEmotionFlag) {//����Ѿ���
    openEmotionFlag = false;
    hideDiscussEmotion();//�ر�
  } else {//���δ��
    openEmotionFlag = true;
    showDiscussEmotion();//��
  }
}
//ѡ�б���
function selectEmotionImg(selImg) {
  $("#send_msg_text").val($("#send_msg_text").val() + selImg.id);
}

//�˳���Ⱥ
function quitBigGroup() {
  var options = {
    'GroupId': avChatRoomId//Ⱥid
  };
  webim.quitBigGroup(
    options,
    function (resp) {

      webim.Log.info('��Ⱥ�ɹ�');
      $("#video_sms_list").find("li").remove();
      //webim.Log.error('������һ����Ⱥ:'+avChatRoomId2);
      //applyJoinBigGroup(avChatRoomId2);//�����Ⱥ
    },
    function (err) {
      alert(err.ErrorInfo);
    }
  );
}

//�ǳ�
function logout() {
  //�ǳ�
  webim.logout(
    function (resp) {
      webim.Log.info('�ǳ��ɹ�');
      loginInfo.identifier = null;
      loginInfo.userSig = null;
      $("#video_sms_list").find("li").remove();
      var indexUrl = window.location.href;
      var pos = indexUrl.indexOf('?');
      if (pos >= 0) {
        indexUrl = indexUrl.substring(0, pos);
      }
      window.location.href = indexUrl;
    }
  );
}