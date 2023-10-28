import React from 'react';
import logo from './logo.svg';
import './App.css';
import RecordRTC from 'recordrtc';
const hasGetUserMedia = !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia || navigator.msGetUserMedia);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.localVideoRef = React.createRef();
    this.recordedVideoRef = React.createRef();
    this.state = {
      recordVideo: null,
      src: null,
      uploadSuccess: null,
      uploading: false
    };

    this.requestUserMedia = this.requestUserMedia.bind(this);
    this.startRecord = this.startRecord.bind(this);
    this.stopRecord = this.stopRecord.bind(this);
    this.saveVideo = this.saveVideo.bind(this);
  }
  componentDidMount() {
    if (!hasGetUserMedia) {
      alert("Your browser cannot stream from your webcam. Please switch to Chrome or Firefox.");
      return;
    }
    this.requestUserMedia();
  }
  requestUserMedia() {
    console.log('requestUserMedia');
    const constraints = { video: true };
    const success = (stream) => {
      console.log("Now streaming")
      this.localVideoRef.current.srcObject = stream;
    }
    const failure = (e) => {
      console.log("getUserMedia Error: ", e);
    }
    navigator.mediaDevices.getUserMedia(constraints)
      .then(success)
      .catch(failure)
  }
  startRecord() {
    console.log("Starting recording...");
    this.setState({ recordVideo: RecordRTC(this.localVideoRef.current.srcObject, { type: 'video' }) }, () => {
      this.state.recordVideo.startRecording();
    })
  }
  stopRecord() {
    console.log("Stop recording....");
    this.state.recordVideo.stopRecording(() => {
      let params = {
        type: 'video/webm',
        data: this.state.recordVideo.blob,
        id: Math.floor(Math.random() * 90000) + 10000
      }
      console.log("this.state.recordVideo==", this.state.recordVideo);
      console.log("this.state.recordVideo.getDataURL()==", this.state.recordVideo.toURL());
      //this.recordedVideoRef.srcObject = this.state.recordVideo.blob
      this.setState({ uploading: true });
    })
  }
  saveVideo() {
    this.state.recordVideo.save();
  }
  render() {
    return (
      <div>
        <video ref={this.localVideoRef} autoPlay></video>
        {/*this.state.uploading ? <video src={() => this.state.recordVideo.toURL()} autoPlay /> : null*/}
        <div><button onClick={this.startRecord}>Start Record</button></div>
        <div><button onClick={this.stopRecord}>Stop Record</button></div>
        {this.state.uploading ? <button onClick={this.saveVideo}>Save</button> : null}
      </div>
    );
  }
}

export default App;
