
// Packages
const 
  Discord = require('discord.js-selfbot')
  Axios = require('axios')
  Ytdl = require('ytdl-core')
  YtSearch = require('yt-search')
  Fs = require('fs')

// Config Loader 
if (!Fs.existsSync('config.cfg')){return console.log("Config doesn't exist. (▀̿Ĺ̯▀̿ ̿)")}
let Config = JSON.parse(Fs.readFileSync('config.cfg'))

// Declarations 
const 
  Client = new Discord.Client()
  Singer = {
    Singing: false,
    Queue: []
  }

// Functions 
const 
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

  Get_Info = async function(Song){
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

  Queue_Song = async function(SongData){
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

// Events 
Client.on('ready', ()=>{
  console.log('Aux Connected')
})

Client.on('message', (Message)=>{
  if (Message.content.startsWith(Config.PREFIX)){
    const [Command, ...Args] = Message.content.split(Config.PREFIX)[1].split(' ')

    switch(Command){
      case 'play':
        const 
          Song = Args.join(' ')
          VoiceChannel = Message.member.voice.channel

        if (!Song){return Message.channel.send('No song provided.')} 
        if (!VoiceChannel){return Message.Channel.send('Not in voice channel.')} 

        Queue_Song({
          Song: Song,
          Author: Message.author,
          Voice: VoiceChannel,
          Channel: Message.channel
        })
      break
      case 'skip':
        Singer.Queue[0].Constructor.Channel.send('**Skipped**')
        Singer.Queue[0].Dispatcher.end()
        break
    }
  }
})


// Login 
Client.login(Config.TOKEN)
