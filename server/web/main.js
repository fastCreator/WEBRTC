// 建立一个 RTCPeerConnection 实例，这里设置了 STUN 或 TURN 服务器
var servers = {
  'iceServers': [
    {
      'url': 'stun:turn.mywebrtc.com'
    },
    {
      'url': 'turn:turn.mywebrtc.com',
      'credential': 'siEFid93lsd1nF129C4o',
      'username': 'webrtcuser'
    }
  ]
};
peerConnection = new RTCPeerConnection(servers);

// 交换 ICE 候选，通过 WebSocket 发送
peerConnection.onicecandidate = function (e) {
  if (e.candidate) {
    console.log(['ICE candidate', e.candidate]);
    socket.emit('message', roomToken, {
      'candidate': e.candidate
    });
  }
};

// 接收到对方添加的视频流时，显示在本地的 <video> 标签中
peerConnection.onaddstream = function (e) {
  remoteMediaStream = e.stream;
  // remoteVideo.src = URL.createObjectURL(remoteMediaStream);
  remoteVideo.srcObject = remoteMediaStream
};

// 在这里添加上一篇文章中获取到的本地视频流
peerConnection.addStream(localMediaStream);

// 包装一个 Offer
peerConnection.createOffer(gotLocalDescription, handleError);

// 有了 Offer，通过 WebSocket 发送给对方
function gotLocalDescription(desc) {
  peerConnection.setLocalDescription(desc);
  socket.emit('message', roomToken, {
    'sdp': desc
  });
}

// 在 WebSocket 中接收到信息时
socket.on('message', function (message, socketId) {
if (message.sdp) {
    // 接收到 Offer 时，创建 Answer 并发送
    var desc = new RTCSessionDescription(message.sdp);
    peerConnection.setRemoteDescription(desc, function () {
      peerConnection.createAnswer(gotLocalDescription, handleError);
    }, handleError);
  } else {
    // 接收到 ICE 候选时，让 RTCPeerConnection 收集它，稍后它将在这些候选方式中挑选最佳者建立连接
    // 注意：RTCPeerConnection 要在 setLocalDescription 后才能开始收集 ICE 候选
    peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
  }
});