
// Packages
const 
  Discord = require('discord.js-selfbot') 
  Music = require('./Functions/Music.js')
  Fs = require('fs')

// Config Loader 
if (!Fs.existsSync('./config.cfg')){return console.log("Config doesn't exist. (▀̿Ĺ̯▀̿ ̿)")}
let Config = JSON.parse(Fs.readFileSync('./config.cfg'))

// Declarations 
const 
  Client = new Discord.Client()
  Save_Config = ()=>{Fs.writeFileSync('./config.cfg',JSON.stringify(Config,null,2))}

// Functions
const
  Array_Remove = (array,item)=>{
    for (let i=0;i<=array.length;++i){
      if (array[i] === item){array.splice(i,1)}
    }
  }

// Events 
Client.on('ready', ()=>{
  console.log('Aux Connected')
  Client.user.setActivity('ya grandma', {type: 'WATCHING'})
})

Client.on('message', (Message)=>{
  if (Message.content.startsWith(Config.PREFIX) && Config.WHITELISTED.includes(Message.author.id)){
    const [Command, ...Args] = Message.content.split(Config.PREFIX)[1].split(' ')

    switch(Command){
      // Global Handlers
      case 'prefix':
        if(!Args[0]){return Message.channel.send('**No prefix provided.**')}
        Config.PREFIX = Args[0]
        Message.channel.send('**Prefix set to ** ``'+Args[0]+'``')
        Save_Config()
      break

      case 'whitelist':
        if(!Args[0]){return Message.channel.send('**No ID provided.**')}
        if(Config.WHITELISTED.includes(Args[0])){return Message.channel.send('**Already whitelisted.**')}
        Config.WHITELISTED.push(Args[0].toString())
        Message.channel.send('**Whitelisted **'+`<@${Args[0]}>.`)
        Save_Config()
      break 

      case 'blacklist':
        if(!Args[0]){return Message.channel.send('No ID provided.')}
        if(!Config.WHITELISTED.includes(Args[0])){return Message.channel.send("**User wasn't whitelisted.**")}
        Array_Remove(Config.WHITELISTED,Args[0])
        Message.channel.send('**User blacklisted.**')
        Save_Config()
      break 

      // Music Handlers
      case 'play':
        Music.Handle_Play({Author:Message.author,Args:Args,Channel:Message.channel,Voice:Message.member.voice.channel})
      break

      case 'skip': 
        Music.Handle_Skip(null) 
      break

      case 'shuffle':
        Music.Handle_Shuffle({Channel:Message.channel})
      break

      case 'queue':
        Music.Handle_Queue({Channel:Message.channel})
      break
    }
  }
})


// Login 
Client.login(Config.TOKEN)
