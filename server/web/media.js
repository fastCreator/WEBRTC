var localVideo = document.querySelector("video.local");
var localMediaStream = null;
var localMediaURL = null;

//访问用户媒体设备的兼容方法
function getUserMedia(constrains, success, error) {
  if (navigator.mediaDevices.getUserMedia) {
    //最新标准API
    navigator.mediaDevices.getUserMedia(constrains).then(success).catch(error);
  } else if (navigator.webkitGetUserMedia) {
    //webkit内核浏览器
    navigator.webkitGetUserMedia(constrains).then(success).catch(error);
  } else if (navigator.mozGetUserMedia) {
    //Firefox浏览器
    navagator.mozGetUserMedia(constrains).then(success).catch(error);
  } else if (navigator.getUserMedia) {
    //旧版API
    navigator.getUserMedia(constrains).then(success).catch(error);
  }
}

getUserMedia(getMediaConstraints(), function (stream) {
  localMediaStream = stream;
  // localVideo.srcObject = stream
  // localVideo.src = localMediaURL = URL.createObjectURL(localMediaStream);
}, (err) => { alert(err) });

function getMediaConstraints() {
  if (navigator.webkitGetUserMedia) {
    // Chrome
    return {
      video: {
        mandatory: { minWidth: 640, minHeight: 480 },
        optional: [{ minWidth: 1280 }, { minHeight: 720 }, { facingMode: "user" }]
      },
      audio: true
    };
  }
  // Firefox
  return {
    video: {
      width: { min: 640, ideal: 1280 },
      height: { min: 480, ideal: 720 },
      facingMode: "user"
    },
    audio: true
  };
}