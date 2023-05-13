import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../SocketContext';
import './home.css'
import Timer from './Timer';
import { useParams } from 'react-router';
import VideoPlayer from './VideoPlayer';

import endCallback from '../images/endCall.png'
import mute from '../images/mute.png'
import gspeaker from '../images/gspeaker.png'
import gmute from '../images/gmute.png';
import speaker from '../images/speaker.png';
import close from '../images/close.png'

const Options = () => {

    const [muted, setMuted] = useState(true);
    const [speak, setSpeaker] = useState(false);
    const [name, setName] = useState('');
    const [fcmToken, setFcmToken] = useState(null);
    const [text, setText] = useState('Student is Online');
    const [content, setContent] = useState();

    const [startCall, setStartCall] = useState(false)
    const context = useContext(SocketContext);
    const params = useParams();

    const getId = async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        var device = devices.filter(device => device.kind === 'audioinput');
        return device
    }

    useEffect(() => {
        if (params.member === 'student') {
            context.setRemoteID(params.id);
            context.setStudent(true);
        }
        else if (params.member === 'mentor') {
            setName(params.name);
            setFcmToken(params.fcm)
        }
    }, [])

    useEffect(() => {
        const start = async () => {
            if (speak) {
                var array = await getId();
                setContent(<ChangeAudio array={array} context={context} setSpeaker={setSpeaker} />);
            }
        }
        start()
    }, [speak])

    return (
        <>

            {
                <div  className='card' style={{ transform: `translateY(${speak ? '0rem' : '-200rem'})` }}>
                    {content}
                </div>
            }
            
            <div className="home" >
                <div>
                    <h1 className="h1">RankBoost</h1>
                    {/* <h1 className="h1">{context.yourID}</h1> */}
                    <h1 className="h2">{params.member === 'mentor' ? name : 'Mentor'}</h1>
                    {
                        params.member === 'mentor' ?
                            (context.mentorCallReady ?
                                <Timer />
                                :
                                context.studentJoined ?
                                    <h1 className="h3">{text}</h1>
                                    :
                                    <h1 className="h3">Ringing</h1>
                            )
                            :
                            (startCall ?
                                <Timer />
                                :
                                context.mentorReady ?
                                    ''
                                    :
                                    <h1 className="h3">Please wait...</h1>
                            )
                    }
                </div>
                <VideoPlayer />
                {
                    params.member === 'mentor' ?

                        (context.mentorCallReady ?
                            ''
                            :
                            context.studentJoined ?
                                startCall ?
                                    ''
                                    :
                                    <h1 className="btn" onClick={() => { context.callUser(); setStartCall(true); setText('Waiting for the response') }}>Join the Call</h1>
                                :
                                ''
                        )
                        :
                        (startCall ?
                            ''
                            :
                            context.mentorReady ?
                                <h1 className="btn" onClick={() => { context.answerCall(); setStartCall(true) }}>Join the Call</h1>
                                :
                                ''
                        )
                }
                <div className="one">
                    {
                        context.mentorCallReady || startCall ?
                            <div className="two">
                                <img alt="rankboost" src={!muted ? gmute : mute} onClick={() => { context.muteMic(!muted); setMuted(!muted) }} className="img2" />
                                <img alt="rankboost" src={speak ? gspeaker : speaker} onClick={() => { setSpeaker(!speak) }} className="img2" />
                            </div>
                            :
                            ''
                    }
                    <div>
                        <img alt="rankboost" src={endCallback} onClick={() => { context.leaveCall() }} className="img" />
                    </div>
                </div>
            </div >
            
        </>
    )
}

const ChangeAudio = (props) => {

    var array = props.array;
    const [list, setList] = useState();

    useEffect(() => {
        setList(array.map((item) => {
            return (
                <h1 className='card_text' onClick={() => { props.context.changed(item.deviceId); props.setSpeaker(false) }}>
                    {item.label}
                </h1>
            )
        }))
    }, [props]);

    return (
        <div className='card'>
            {list}
            <img alt="rankboost" src={close} onClick={() => { props.setSpeaker(false) }} className="img2" />
        </div>
    )
}
export default Options;