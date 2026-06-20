export function extractVideoId(urlString) {
    const validHostNames = ['youtu.be', 'www.youtube.com', 'm.youtube.com' , 'youtube.com']
    let videoId = ''
    const regex = /^[A-Za-z0-9_-]{11}$/  //checks id conatins 11 char
    try {
        const url = new URL(urlString);
        if(validHostNames.includes(url.hostname)){
            if(url.hostname == 'youtu.be') {
                videoId = url.pathname.slice(1)
                return regex.test(videoId) ? videoId : null
            }
            if(url.hostname == 'www.youtube.com'|| url.hostname == 'm.youtube.com' || url.hostname == 'youtube.com') {

                if(url.pathname.split('/')[1] == 'shorts' || url.pathname.split('/')[1] == 'embed' ){
                    videoId = url.pathname.split('/')[2]
                    return regex.test(videoId) ? videoId : null
                }
                videoId = url.searchParams.get('v')
                return regex.test(videoId) ? videoId : null
            }
        }
        return null;
        
        
    } catch (error) {
        return null;
    }
}

