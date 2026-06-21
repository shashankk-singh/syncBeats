export async function fetchVideoMetadata(videoId) {
    const urlString = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    try{
        const response = await fetch(urlString)
        if (!response.ok) {return null} 
        const data = await response.json()
        const metaData = {title: data.title, thumbnail: data.thumbnail_url}
        return metaData
    }catch(error){
        return null
    }
}

