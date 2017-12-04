(function() {

  const videoPlayer = $('#video-player')[0];
  const $start = $('#start');
  const $stop = $('#stop');
  const $review = $('#review');
  const $msg = $('#msg');

  let recorder;
  let stream;
  let videoURL;

  // init Plyr
  plyr.setup(videoPlayer);

  // generate random file name
  function getFileName(fileExtension) {
    var d = new Date();
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth();
    var date = d.getUTCDate();
    return 'RecordRTC-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
  }

  function getRandomString() {
      if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
          var a = window.crypto.getRandomValues(new Uint32Array(3)),
              token = '';
          for (var i = 0, l = a.length; i < l; i++) {
              token += a[i].toString(36);
          }
          return token;
      } else {
          return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
      }
  }

  function sendVideo(formData, fileName) {
    $.ajax({
      url: 'https://webrtcweb.com/RecordRTC/', // replace with your own server URL
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST',
      success: function(response) { 
          if (response === 'success') {
              $msg.html('successfully uploaded recorded blob');
              // file path on server
              videoURL = 'https://webrtcweb.com/RecordRTC/uploads/' + fileName;
          } else {
              $msg.html(response);
          }
      },
      error: function(error) {
        console.log(error);
      }
    });
  }

  function startRecord() {
    navigator
    .mediaDevices
    .getUserMedia({audio: true, video: true})
    .then((stream) => {
      setSrcObject(stream, videoPlayer);

      const recordConfig = {
        type: 'video'
      }
      recorder = RecordRTC(stream, recordConfig);
      recorder.startRecording();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function stopRecord() {
    recorder.stopRecording(() => {
      // get Blob
      const blob = recorder.getBlob();
      // create name for File
      const fileName = getFileName('test');
      // we can't upload 'Blob', only 'File'
      const fileObject = new File([blob], fileName, {type: 'video/webm'});
      const formData = new FormData();
      // record data
      formData.append('video-blob', fileObject);
      // file name
      formData.append('video-name', fileObject.name);
      console.log(formData);
      // send 
      sendVideo(formData, fileObject.name);
      // reset video
      videoPlayer.srcObject = videoPlayer.src = null;
    });
  }

  function reviewVideo() {
    if (videoURL != undefined) {
      videoPlayer.src = videoURL;
    }
    $msg.html('first, you must record video');
  }


  $start.on('click', () => {
    startRecord();
  });

  $stop.on('click', () => {
    if (recorder != undefined) {
      stopRecord();
    }
  });

  $review.on('click', () => {
    reviewVideo();
  })

})();