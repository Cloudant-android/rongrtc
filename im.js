function initIM(params, callbacks) {
    var appkey = params.appkey;
    var token = params.token;

    var navi = "http://47.105.222.211:8082";
    var config = {};

    //私有云切换navi导航，私有云格式 '120.92.10.214:8888'
    if(navi !== ""){
        config.navi = navi;
    }

    //私有云切换api,私有云格式 '172.20.210.38:81:8888'
    var api = "http://47.105.222.211:8081";
    if(api !== ""){
        config.api = api;
    }

    //support protobuf url + function
    // if(protobuf != null){
    //     config.protobuf = protobuf;
    // };

    var dataProvider = null;
    var imClient = params.imClient;
    if (imClient) {
        dataProvider = new RongIMLib.VCDataProvider(imClient);
    }
    RongIMClient.init(appkey, dataProvider, config);
    RongIMClient.setConnectionStatusListener({
      onChanged: function (status) {
        switch (status) {
          case RongIMLib.ConnectionStatus.CONNECTING:
            break;
          case RongIMLib.ConnectionStatus.DISCONNECTED:
            callbacks.disconnectd(status);
          break;
          case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
          case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
          case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
          callbacks.error(status);
            break;
        }
      }
    });
    RongIMClient.setOnReceiveMessageListener({
      onReceived: function (message) {
        console.log(message);
      }
    });
    RongIMClient.connect(token, {
      onSuccess: function (userId) {
        callbacks.connected(RongIMClient.getInstance(), { id: userId });
      },
      onTokenIncorrect: function () {
        callbacks.onTokenIncorrect()
      },
      onError: function (code) {
        callbacks.disconnectd(status);
      }
    });
  }
