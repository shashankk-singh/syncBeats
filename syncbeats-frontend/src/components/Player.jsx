import React, { useEffect, useRef, useState } from 'react'

function Player({ videoId, socket }) {
    const playerContainerRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const ignoreNextChange = useRef(false)  
    function stateChange(event) {
        if(event.data !== 1 && event.data !== 2){return}
        if(ignoreNextChange.current == true){
            ignoreNextChange.current = false
            return
        }
        
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
        if (!socket) return
        socket.on('play', (data) => {
            if (!player) return
            ignoreNextChange.current = true
            player.seekTo(data.timestamp)
            player.playVideo()
        })
        socket.on('pause', (data) => {
            if (!player) return
            ignoreNextChange.current = true
            player.seekTo(data.timestamp)
            player.pauseVideo()
            
        })


    window.onYouTubeIframeAPIReady = function() {
        console.log('Player creating with videoId:', videoId)
        setPlayer(new YT.Player(playerContainerRef.current, {
            height: '100%',
            width: '100%',
            videoId : videoId,
            events: {
                onStateChange: stateChange
            }
        })) 
    }

    return () => {
        socket.off('play')
        socket.off('pause')
    }
    
    }, [socket,player]);

    return (
      <div className="bg-zinc-900 rounded-xl overflow-hidden aspect-video w-full">
        <div ref={playerContainerRef} className="w-full h-full" />
      </div>
    );
}

export default Player;


/**ignore nextt is a flip switch to ignore next incoming request like User A clicks play
 * User A clicks play
  → stateChange fires → emits 'play' to server
    → server broadcasts 'play' to User B
      → User B's incoming listener calls player.playVideo()
        → User B's stateChange ALSO fires (data === 1)
          → User B emits 'play' back to server
            → server broadcasts to User A and User C... */ 