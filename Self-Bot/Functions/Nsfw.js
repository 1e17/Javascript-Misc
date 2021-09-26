
// Packages 
const Fetch = require('node-fetch')

// Functions 
const getRedditJson = (index) => {
  return Fetch(`https://www.reddit.com/r/${index}/new.json`,{method:'GET'})
  .then((res) => res.json())
  .then((json) => {
    if(json && json['data'] && json.data['children']){return json.data.children}
    return null
  })
}

module.exports = {
  hentai: async (Data) => {
    const Hentai = await getRedditJson('hentai')
    Data.Channel.send(Hentai[Math.floor(Math.random()*25)].data.url)
  },
  nsfw: async (Data) => {
    const Nsfw = await getRedditJson('Nsfw')
    Data.Channel.send(Nsfw[Math.floor(Math.random()*25)].data.url)
  },
  porn: async (Data) => {
    const Porn = await getRedditJson('porn')
    Data.Channel.send(Porn[Math.floor(Math.random()*25)].data.url)
  },
  reddit: async (Data) => {
    if(!Data.Args[0]){return Data.Channel.send('**No argument provided.**')}
    const Arg = await getRedditJson(Data.Args.join(' '))
    if (!Arg){return Data.Channel.send("**Couldn't find anything.**")}
    Data.Channel.send(Arg[Math.floor(Math.random()*25)].data.url)
  },
}
