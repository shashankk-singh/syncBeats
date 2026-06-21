import React, { useEffect, useRef, useState } from 'react'

function Player({ videoId, socket }) {
    const playerContainerRef = useRef(null);
    const [player, setPlayer] = useState(null);

    function stateChange(event) {
        if (!socket) return
        const timestamp = event.target.getCurrentTime() //target refers to the video playing in player 
        const data = event.data
        if(data === 1){
            socket.emit('play', {isPlaying: true, timestamp})
        }
        if(data === 2){
            socket.emit('pause', {isPlaying: false, timestamp})
        }
    }

    useEffect(() => {
        if(!window.YT){
        const tag = document.createElement('script')
        tag.src = "https://www.youtube.com/iframe_api"
        document.body.append(tag)
    }

    window.onYouTubeIframeAPIReady = function() {
        setPlayer(new YT.Player(playerContainerRef.current, {
            height: '100%',
            width: '100%',
            videoId : videoId,
            events: {
                onStateChange: stateChange
            }
        })) 
    }
    
    }, [socket]);

    return (
      <div className="bg-zinc-900 rounded-xl overflow-hidden aspect-video w-full">
        <div ref={playerContainerRef} className="w-full h-full" />
      </div>
    );
}

export default Player;