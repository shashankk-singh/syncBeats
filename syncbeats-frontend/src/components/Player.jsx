import React, { useEffect, useRef, useState } from 'react'

function Player({ videoId, socket }) {
    const playerContainerRef = useRef(null);
    const prevVideoId = useRef(undefined);
    const [player, setPlayer] = useState(null);
    const ignoreNextChange = useRef(0); 
    const socketRef = useRef(null)
    function stateChange(event) {
        if(event.data !== 1 && event.data !== 2){return}
        if (ignoreNextChange.current > Date.now()) return
        
        if (!socketRef.current) return
        const timestamp = event.target.getCurrentTime()
        const data = event.data
        if(data === 1){
            socketRef.current.emit('play', {isPlaying: true, timestamp})
        }
        if(data === 2){
            socketRef.current.emit('pause', {isPlaying: false, timestamp})
        }
    }
    useEffect(() => {
    socketRef.current = socket
    }, [socket])

    useEffect(() => {
    function createPlayer() {
        new YT.Player(playerContainerRef.current, {
            height: '100%',
            width: '100%',
            events: {
                onReady: (e) => setPlayer(e.target),
                onStateChange: stateChange
            }
})
    }

    if (!window.YT) {
        const tag = document.createElement('script')
        tag.src = "https://www.youtube.com/iframe_api"
        document.body.append(tag)
        window.onYouTubeIframeAPIReady = createPlayer
    } else {
        createPlayer()
    }
    }, [])

    useEffect(() => {
        if(!player){return}
        if(prevVideoId.current !== videoId){
            player.loadVideoById(videoId)
            prevVideoId.current = videoId
        }
        
    }, [videoId, player])

    
    

    useEffect(() => {
    if (!socket) return
    socket.on('play', (data) => {
        if (!player) return
        ignoreNextChange.current = Date.now() + 1000 //1sec
        player.seekTo(data.timestamp)
        player.playVideo()
    })
    socket.on('pause', (data) => {

        if (!player) return
        ignoreNextChange.current = Date.now() + 1000 
        player.seekTo(data.timestamp)
        player.pauseVideo()
    })
    return () => {
        socket.off('play')
        socket.off('pause')
    }
}, [socket, player])

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

/**
 * Effect 1 — [] (runs once on mount):
 *   Creates the YT.Player instance. Empty deps because we NEVER want this to re-run —
 *   re-running would try to create a second player on the same div, destroying the first.
 *   Two paths: if YT script not loaded yet → append script tag + set onYouTubeIframeAPIReady callback.
 *   If YT script already loaded (e.g. user navigated away and back) → call createPlayer() directly,
 *   because onYouTubeIframeAPIReady only ever fires once per script load and won't fire again.
 *   Player is created WITHOUT a videoId on purpose — passing videoId here would crash with
 *   "Invalid video id" if the queue is empty when the player first mounts (which it usually is,
 *   since sync-state arrives over the socket slightly after the component renders). Video loading
 *   is delegated entirely to Effect 2.
 *
 * Effect 2 — [videoId, player]:
 *   Calls player.loadVideoById(videoId) whenever the front of the queue changes.
 *   Needs both deps: player (null until Effect 1 finishes async) and videoId (undefined until
 *   queue populates via sync-state). Effect re-runs whenever either changes, so whichever
 *   arrives last naturally triggers the load. prevVideoId ref prevents re-loading the same
 *   video on unrelated re-renders.
 *
 * Effect 3 — [socket, player]:
 *   Registers incoming socket listeners (play/pause). Needs to re-run when player changes
 *   so the callbacks close over the real player instance, not the initial null.
 *   Cleanup (socket.off) runs before each re-run to prevent duplicate listeners stacking up.
 */