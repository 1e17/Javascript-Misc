
// Packages
const 
  Ytdl = require('ytdl-core')
  YtSearch = require('yt-search')

// Music Functions
const 
  Singer = {
    Singing: false,
    Queue: []
  }

  Play = async ()=>{
    const Song = Singer.Queue[0]
    Singer.Singing = true 

    Song.Voice.join().then(function(Dispatcher){
      Song.Channel.send(`🎶 Now playing: **${Song.Title}**. Requested by: **${Song.Asker.username}.**`)
      Singer.Queue[0] = {Constructor: Song, Dispatcher: Dispatcher.play(Song.Audio).on('finish', function(){
        Singer.Queue.shift()
        if (Singer.Queue.length > 0){Play()} else {Singer.Singing = false}
      })}
    })
  }

  Get_Info = async (Song) => {
    if (Ytdl.validateURL(Song)) {
      return await Ytdl.getInfo(Song)
    } else {
      const Result = await YtSearch(Song)
      if (Result.videos.length > 0) {
        return await Ytdl.getInfo(Result.videos[0].url)
      } else {
        console.log('Videos not found.')
      }
    }
  }

  Queue_Song = async (SongData) => {
    const VideoInfo = await Get_Info(SongData.Song)
    const Audio = Ytdl(VideoInfo.videoDetails.video_url, {filter: 'audioonly'})
    const Constructor = {
      Audio: Audio,
      Channel: SongData.Channel,
      Asker: SongData.Author,
      Voice: SongData.Voice,
      Title: VideoInfo.videoDetails.title,
    }

    SongData.Channel.send(`Added **${Constructor.Title}** to queue.`)
    Singer.Queue.push(Constructor)
    if (!Singer.Singing) {Play().catch((Fuck) => {console.log('Play Function: ' + Fuck)})}
  }

  Shuffle_Array = (array) => { 
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
  }
  
// Exports
module.exports = {
  play: async (Data) => {
    const 
      Song = Data.Args.join(' ')
      Channel = Data.Channel
      VoiceChannel = Data.Voice

    if (!Song){return Channel.send('**No song provided.**')} 
    if (!VoiceChannel){return Channel.send('**Not in voice channel.**')} 

    Queue_Song({
      Song: Song,
      Author: Data.Author,
      Voice: VoiceChannel,
      Channel: Channel
    })
  },
  
  skip: async () => {
    Singer.Queue[0].Constructor.Channel.send('**Skipped.**')
    Singer.Queue[0].Dispatcher.end()
  },

  shuffle: async () => {
    if (Singer.Queue.length > 0){          
      const Current = Singer.Queue.shift()
      Singer.Queue = Shuffle_Array(Singer.Queue)
      Singer.Queue.unshift(Current)
      Data.Channel.send('**Shuffled.**')
    } else {
      Data.Channel.send('**No songs to shuffle.**ww')
    }
  },

  queue: async () => {
    if (Singer.Queue.length > 0){
      let QueueString = ""
      for (let i=1;i<Singer.Queue.length;++i){
        QueueString = QueueString + (`${i}. ${Singer.Queue[i].Title} \n`)
      };QueueString = '```\n' + QueueString + '```'
      Data.Channel.send(QueueString)
    } else {
      Data.Channel.send('**No songs in queue.**')
    }
  }
}
