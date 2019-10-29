var conn = new WebIM.connection({
	https: WebIM.config.https,
	url: WebIM.config.xmppURL,
	isAutoLogin: WebIM.config.isAutoLogin,
	isMultiLoginSessions: WebIM.config.isMultiLoginSessions
});

conn.listen({
	onOpened: function(message) { //连接成功回调
		console.log('连接成功回调:');
		console.log(message);
		//如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
		conn.setPresence();
	},
	onClosed: function(message) {
		console.log('连接关闭回调:' + message);
		console.log(message);
	}, //连接关闭回调
	onTextMessage: function(message) {
		console.log('收到文本消息:' + message);
		console.log(message);
	}, //收到文本消息
	onEmojiMessage: function(message) {}, //收到表情消息
	onPictureMessage: function(message) {}, //收到图片消息
	onCmdMessage: function(message) {}, //收到命令消息
	onAudioMessage: function(message) {}, //收到音频消息
	onLocationMessage: function(message) {}, //收到位置消息
	onFileMessage: function(message) {}, //收到文件消息
	onVideoMessage: function(message) {}, //收到视频消息
	onPresence: function(message) {}, //收到联系人订阅请求、处理群组、聊天室被踢解散等消息
	onRoster: function(message) {}, //处理好友申请
	onInviteMessage: function(message) {
		console.log('处理群组邀请:' + message);
		console.log(message);
	}, //处理群组邀请
	onOnline: function(message) {
		console.log('本机网络连接成功:' + message);
		console.log(message);
	}, //本机网络连接成功
	onOffline: function(message) {
		console.log('本机网络掉线:' + message);
		console.log(message);
	}, //本机网络掉线
	onError: function(message) {
			console.log('失败回调:' + message);
			console.log(message);
		} //失败回调
});