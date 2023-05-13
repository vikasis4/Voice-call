import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// var socketUrl = 'https://rankboost.onrender.com'
var socketUrl = 'https://192.168.101.76:8000'

const ContextProvider = ({ children }) => {
  const [yourID, setYourID] = useState(null);
  const [remoteID, setRemoteID] = useState(null)
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [audioDevices, setAudioDevices] = useState([]);
  const [student, setStudent] = useState(false);
  const [sdp, setSdp] = useState(null);
  const [studentJoined, setStudentJoined] = useState(false);
  const [mentorReady, setMentorReady] = useState(false);
  const [mentorCallReady, setMentorCallReady] = useState(false);

  const userVideo = useRef();
  const myVideo = useRef();
  const connectionRef = useRef();
  const socket = useRef();


  const openMic = async (deviceId) => {

    await navigator.mediaDevices.getUserMedia({ video: false, audio: { 'echoCancellation': true, deviceId: { exact: deviceId } } })
      .then((currentStream) => {
        setStream(currentStream);
      });
  }

  useEffect(() => {
    if (remoteID && yourID && student) {
      socket.current.emit('exchangeID', { from: yourID, to: remoteID });
    }
  }, [remoteID, yourID, student])

  useEffect(() => {
    const startuse = async () => {

      socket.current = io.connect(socketUrl);

      openMic('default')

      socket.current.on("yourID", (id) => {
        setYourID(id);
        console.log('yourID', id);
      });

      socket.current.on("exchangeID", async ({ from }) => {
        setRemoteID(from);
        console.log('Remotva_ID ', from);
        setStudentJoined(true)
      });

      socket.current.on('callUser', ({ signal }) => {
        setSdp(signal);
        console.log('READY', signal);
        setMentorReady(true)
      });

    }
    startuse()
  }, []);

  const answerCall = () => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.current.emit('answerCall', { signal: data, to: remoteID });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(sdp);
    connectionRef.current = peer;
  };

  const callUser = () => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    console.log('CALLING :- ', remoteID);

    peer.on('signal', (data) => {
      socket.current.emit('callUser', { userToCall: remoteID, signalData: data, from: yourID, });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.current.on('callAccepted', (signal) => {
      setMentorCallReady(true)
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.assign('https://rankboost.vercel.app/payment/show')
  };

  function muteMic(value) {
    stream.getAudioTracks().forEach(track => track.enabled = value);
  }

  const changed = async (value) => {

    navigator.mediaDevices.getUserMedia({ audio: { deviceId: { exact: value } } })
      .then(stream => {

        const newMediaStream = new MediaStream([stream.getAudioTracks()[0]]);

        userVideo.current.srcObject.getTracks().forEach(track => {
          track.stop();
          userVideo.current.srcObject.removeTrack(track);
        });

        newMediaStream.getTracks().forEach(track => {
          userVideo.current.srcObject.addTrack(track);
        });

      })
      .catch(error => {
        console.error('Error accessing user media', error);
      });
  }

  return (
    <SocketContext.Provider value={{
      setStudent,
      setRemoteID,
      changed,
      openMic,
      myVideo,
      mentorCallReady,
      studentJoined,
      mentorReady,
      muteMic,
      userVideo,
      callEnded,
      callUser,
      leaveCall,
      answerCall,
      yourID,
      audioDevices,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };