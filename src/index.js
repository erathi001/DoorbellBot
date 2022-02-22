const {Client, Intents, Message, CommandInteractionOptionResolver} = require("discord.js")
const {joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType} = require("@discordjs/voice")
const {createReadStream} = require('fs')
const TOKEN = "OTMzNjAxNjUxNDgxMjU1OTg2.Yej6Sw.HoYTlBWXfmVs60k_KfCp5Udu45M"
require("dotenv").config()
const client = new Client({
    intents:["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
})


client.login(TOKEN)
client.on("ready", () => console.log(`Logged in as ${client.user.tag}`))

client.on("messageCreate", (message) => {
    if(message.content === "!find") {
        client.channels.fetch('933603415009927173')
            .then(channel => console.log(channel.name))
            .catch(console.error);
        
    } else if(message.content === "!ding") {

        client.channels.fetch('933603415009927173').then((channel) => {
            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            })
            try {
                const player = createAudioPlayer()
                // An AudioPlayer will always emit an "error" event with a .resource property
                player.on('error', error => {
                    console.error('Error:', error.message, 'with track', error.resource.metadata.title);
                });

                const resource = createAudioResource(createReadStream("doorbell-1 (1).mp3"), {inlineVolume: true})
                resource.volume.setVolume(1) 

                connection.subscribe(player)
                message.reply("dong!")
                player.play(resource)
                setTimeout(() => connection.destroy(), 4000)

                
            } catch(ex) {
                console.log(ex)
            }
            
        })  
    }
})

