const {Client} = require("discord.js")
require("dotenv").config()
const client = new Client()

client.login(process.env.TOKEN)
client.on("ready", () => console.log(`Logged in as ${client.user.tag}`)