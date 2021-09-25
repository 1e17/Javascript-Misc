
// Packages
const 
  Discord = require('discord.js-selfbot') 
  Fs = require('fs')
  Music = require('./Functions/Music.js')
  ConfigEditor = require('./Functions/ConfigEditor.js')
  Miscellaneous = require('./Functions/Misc.js')

// Config Check 
if (Config===null){return}

// Declarations 
const 
  Client = new Discord.Client()
  Commands = []

// Load Commands 
for (i of Object.keys(Music)){Commands[i] = Music[i]}
for (i of Object.keys(ConfigEditor)){Commands[i] = ConfigEditor[i]}
for (i of Object.keys(Miscellaneous)){Commands[i] = Miscellaneous[i]}
Commands.loadpackage = (Data) => {
  const [Args,Channel] = [Data.Args,Data.Channel]
  if(!Args[0]){return Channel.send('**No package provided.**')}
  if (!Fs.existsSync('./Functions/'+Args[0])){return Channel.send("**Package doesn't exist.** (▀̿Ĺ̯▀̿ ̿)")}
  const Export = require('./Functions/'+Args[0])
  for (i of Object.keys(Export)){
    Commands[i] = Export[i]
    Channel.send('**Command Loaded: **'+'``'+Config.PREFIX+i+'``')
  }
}

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
