
// Packages
const 
  Discord = require('discord.js-selfbot') 
  Music = require('./Functions/Music.js')
  ConfigEditor = require('./Functions/ConfigEditor.js')

// Config Check 
if (Config===null){return}

// Declarations 
const 
  Client = new Discord.Client()
  Commands = []

// Load Commands 
for (i of Object.keys(Music)){Commands[i] = Music[i]}
for (i of Object.keys(ConfigEditor)){Commands[i] = ConfigEditor[i]}

// Events 
Client.on('ready', ()=> {
  console.log('Aux Connected')
  Client.user.setActivity('ya grandma', {type: 'WATCHING'})
})

Client.on('message', (Message)=> {
  if (Message.content.startsWith(Config.PREFIX) && Config.WHITELISTED.includes(Message.author.id)){
    const [Command, ...Args] = Message.content.split(Config.PREFIX)[1].split(' ')
    const [Channel,Voice,Author] = [Message.channel, Message.member.voice.channel, Message.author]

    // Command Handler 
    if (Commands[Command]){
      Commands[Command]({
        Message: Message,
        Author:Author,
        Args:Args,
        Channel:Channel,
        Voice:Voice
      })
    }else{
      Channel.send("**Command doesn't exist.**")
    }
    
  }
})

// Login 
Client.login(Config.TOKEN)
