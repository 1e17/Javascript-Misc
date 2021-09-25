
// Packages
const Fs = require('fs')

// Declarations
global.Config = null
if (!Fs.existsSync('./config.cfg')){return console.log("Config doesn't exist. (▀̿Ĺ̯▀̿ ̿)")}
Config = JSON.parse(Fs.readFileSync('./config.cfg'))

// Functions
const 
  Save_Config = ()=> {
    Fs.writeFileSync('./config.cfg',JSON.stringify(Config,null,2))
  }

  Array_Remove = (array,item) => {
    for (let i=0;i<=array.length;++i){
      if (array[i] === item){array.splice(i,1)}
    }
  }

// Exports
module.exports = {
  prefix: (Data) => {
    const [Args,Channel] = [Data.Args,Data.Channel]
    if(!Args[0]){return Channel.send('**No prefix provided.**')}
    Config.PREFIX = Args[0]
    Channel.send('**Prefix set to ** ``'+Args[0]+'``')
    Save_Config()
  },

  whitelist: (Data) => {
    const [Args,Channel] = [Data.Args,Data.Channel]
    if(!Args[0]){return Channel.send('**No ID provided.**')}
    if(Config.WHITELISTED.includes(Args[0])){return Channel.send('**Already whitelisted.**')}
    Config.WHITELISTED.push(Args[0].toString())
    Channel.send('**Whitelisted **'+`<@${Args[0]}>.`)
    Save_Config()
  },

  blacklist: (Data) => {
    const [Args,Channel] = [Data.Args,Data.Channel]
    if(!Args[0]){return Channel.send('No ID provided.')}
    if(!Config.WHITELISTED.includes(Args[0])){return Channel.send("**User wasn't whitelisted.**")}
    Array_Remove(Config.WHITELISTED,Args[0])
    Channel.send('**User blacklisted.**')
    Save_Config()
  }
}
