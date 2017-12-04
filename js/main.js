(function() {

  const $videoPlayer = $('#video-player');
  const $error = $('.error-msg');

  const config = {
    audio: true,
    video: true,
  }

  navigator.mediaDevices.getUserMedia(config)
    .then((stream) => {
      // get video/audio streams
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();

      console.log(`Using video device: ${videoTracks[0].label}`);

      stream.onended = () => console.log(`Stream ended`);
      $videoPlayer.srcObject = stream;
    })
    .catch((error) => {
      console.log(error);
    });
})();