import React, { useContext } from 'react';
import '../styles.css';
import { SocketContext } from '../SocketContext';

const VideoPlayer = () => {
    const context = useContext(SocketContext);

    return (
        <>
            <div>
                <audio playsInline autoPlay ref={context.userVideo} id="video" className='Video'> </audio>
            </div>
        </>
    )
}
export default VideoPlayer