
// Packages
const Discord = require('discord.js-selfbot') 
const Fs = require('fs')

// Config Loader 
if (!Fs.existsSync('./config.cfg')){return console.log("Config doesn't exist. (▀̿Ĺ̯▀̿ ̿)")}
global.Config = JSON.parse(Fs.readFileSync('./config.cfg'))

// Declarations 
const Client = new Discord.Client()
const Commands = []
const Load_Command_Set = (Export) => {for (i of Object.keys(Export)){Commands[i] = Export[i]}}

// Load Commands 
Fs.readdir(__dirname+'\\Functions', (Error,Files) => {
  Files.forEach((File) => {
    Load_Command_Set(require(__dirname+'\\Functions\\'+File))
  })
})

// Events 
Client.on('ready', () => {
  console.log('Connected')
  Client.user.setActivity('ya grandma', {type: 'WATCHING'})
})

Client.on('message', (Message) => {
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
