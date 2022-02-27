const {Client, Intents, Message, CommandInteractionOptionResolver, VoiceChannel} = require("discord.js")
const {joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioResource} = require("@discordjs/voice")
const {createReadStream, read} = require('fs')
require("dotenv").config()

const doors= {
    INVALID: 0,
    INNER: 1,
    DOOR4: 2,
    DOOR3: 3,
    }

43
let prefix = '!'
let ready = true
let voiceChannelID = null

const client = new Client({
    intents:["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"]
})


client.login(process.env.TOKEN)
client.on("ready", () => console.log(`Logged in as ${client.user.tag}`))

client.on("messageCreate", async (message) => {
    if(!message.content.startsWith(prefix) || message.author.bot) return

    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()

    if(command === "setvc") {
        if(!message.member.voice.channelId) {
            message.reply("you must be in a voice channel to set bot's voice channel")
            return
        }
        voiceChannelID = message.member.voice.channelId
        let voiceChannel = message.member.voice.channel
        message.reply("successfully joined voice channel " +voiceChannel.name)
    }

    if(command === "setprefix") {
        prefix = args[0]
        if(prefix === undefined){
            message.reply("must give a prefix")
            prefix = "!"
        } else message.reply('Prefix has been set to ' + prefix)
    }

    if(command === "ding") {
        if(!voiceChannelID) {
            message.reply('must set doorbell bot to a voice channel')
            return
        } else {
            if (!ready) {
                message.reply('Doorbell is currently in use. Try again in a few seconds')
                return
            } else {
                ready = false
                const enteredDoor = setDoor(args)
                if (enteredDoor === doors.INVALID) {
                    message.reply('please try again and specify which door')
                    ready = true
                    return
                }
                channel = await client.channels.fetch(voiceChannelID)
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
    
                    const resource = createAudioResource(createReadStream("doorbell.mp3"), {inlineVolume: true})
                    resource.volume.setVolume(1) 
    
                    connection.subscribe(player)
                    message.reply("dong!")
                    player.play(resource)
                    setTimeout(() => {
                        try {
                            let whichDoor = AudioResource
                            switch(enteredDoor) {
                                case doors.INNER:
                                    whichDoor = createAudioResource(createReadStream("innerdoor.mp3"), {inlineVolume: true})
                                    break
                                case doors.DOOR3:
                                    whichDoor = createAudioResource(createReadStream("door 3.mp3"), {inlineVolume: true})
                                    break
                                case doors.DOOR4:
                                    whichDoor = createAudioResource(createReadStream("door 4.mp3"), {inlineVolume: true})
                                    break
                            }   
                            whichDoor.volume.setVolume(1)
                            player.play(whichDoor)
    
                        } catch(ex) {
                            console.log(ex)
                        }
                        
                    }, 3000)
                    setTimeout(() => {
                        try {
                            connection.destroy()
                        } catch(ex) {
                            console.log(ex)
                        }
                        ready = true
                    }, 6000)                
                } catch(ex) {
                    console.log(ex)
                }
            }
            
        
        }
    }
        
})

function setDoor(args) {
    if(args.includes('inner')) return doors.INNER
    else if (args.includes('four') || args.includes('4')) return doors.DOOR4
    else if (args.includes('three') || args.includes('3')) return doors.DOOR3
    else {
        return doors.INVALID
    }
}

