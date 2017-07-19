
 //帐号模式，0-表示独立模式，1-表示托管模式
        var wsCache = new WebStorageCache();
        var users = wsCache.get('users');
        console.log('usersid', users.imId)
        var accountMode = 0;
        var selType = webim.SESSION_TYPE.C2C; //当前聊天类型
       var selToID = null; //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
        var selSess = null; //当前聊天会话对象
         //存放c2c或者群信息（c2c用户：c2c用户id，昵称，头像；群：群id，群名称，群头像）
         var infoMap = {}; //初始化时，可以先拉取我的好友和我的群组信息
         var emotionFlag = false; //是否打开过表情选择框
      //默认好友头像
        var friendHeadUrl ="../assets/img/me.jpg"; //仅demo使用，用于没有设置过头像的好友
        //官方 demo appid,需要开发者自己修改（托管模式）

        var sdkAppID =1400016807;
        var accountType = 7923;
        var imIdentifier = JSON.parse(localStorage.getItem('users'))
        var maxNameLen = 12; //我的好友或群组列表中名称显示最大长度，仅demo用得到
        var maxNameLen = 12; //我的好友或群组列表中名称显示最大长度
        var reqMsgCount = 15; //每次请求的历史消息(c2c获取群)条数
        var getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息
        var reqRecentSessCount = 50; //每次请求的最近会话条数，业务可以自定义
        var recentSessMap = {}; //保存最近会话列表
        //当前用户身份
        var loginInfo = {
            'sdkAppID': sdkAppID, //用户所属应用id,必填  写死值
            'accountType': accountType, //用户所属应用帐号类型，必填   写死值
            'identifier': users.imId, //当前用户ID,必须是否字符串类型，必填  写死值  10002
            'userSig': users.imSig,
            //当前用户身份凭证，必须是字符串类型，必填  'eJxlzkFPgzAYxvE7n6LhqtHSUnAmHgiro8k2olOTeWmgLaxhY9BVHTF*dydqbOJ7-f2T5333AAD*w3x1UQixf2ktt0OnfHANfOif-2HXackLy7GR-1AdO20ULyqrzIgBIQRB6DZaqtbqSv8WJ0UOH2TDx41vDU*McRBO3ETXIy7oY8rSXl5usnxFb2Mx7UlCYdnatOzQU2bMEa7r7Xq3odPniEWJpgnaxkXGelHmYqirfFEvB0Oas-t4mJG72tI5Q7M3ubxiqLlxJq3eqZ*HJjEOI0Tcn1*VOeh9OwYIBiRAGH6d7314n-FxW4U_'
            'identifierNick': "果子", //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
            'headurl': null  //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
        };
        //监听事件
        var listeners = {
            "onMsgNotify": onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
        };

        var isAccessFormalEnv = true; //是否访问正式环境

        if (webim.Tool.getQueryString("isAccessFormalEnv") == "false") {
            isAccessFormalEnv = false; //访问测试环境
        }

        var isLogOn = false; //是否开启sdk在控制台打印日志
       //"onKickedEventCall": onKickedEventCall //被其他登录实例踢下线
        //初始化时，其他对象，选填
        var options = {
            'isAccessFormalEnv': isAccessFormalEnv, //是否访问正式环境，默认访问正式，选填
            'isLogOn': isLogOn //是否开启控制台打印日志,默认开启，选填
        };
        
        
        webimLogin();
