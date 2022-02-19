const {Client, Intents, Message, CommandInteractionOptionResolver} = require("discord.js")
const {joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType} = require("@discordjs/voice")
const {createReadStream} = require('fs')
const TOKEN = "OTMzNjAxNjUxNDgxMjU1OTg2.Yej6Sw.yjVAJSupdL5xZGog_Nk2PYt2kFw"
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

                const resource = createAudioResource(createReadStream("./testdoorbell.ogg"), {
                    inputType: StreamType.OggOpus,
                    metadata: {
                        title: 'doorbell'
                    }
                })               


                connection.subscribe(player)
                player.play()
                // const dispatcher = connection.subscribe(player)
                
                // dispatcher.on('start', () => {
                //     console.log('Now playing ');
                //     const statusEmbed = new Discord.MessageEmbed()
                //     .addField('Now Playing', "ding dong")
                //     .setColor('#0066ff')
                // });
                
                // dispatcher.on('error', console.error);
            
                // dispatcher.on('finish', () => {
                //     console.log('Music has finished playing.')
                //     connection.destroy()
                // });
                
            } catch(ex) {
                console.log(ex)
            }
            
        })  
    }
})

