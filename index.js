require('dotenv').config();
const http = require('http');
const path = require('path');
const JSONdb = require('simple-json-db');
const Discord = require('discord.js');
const bot = new Discord.Client();

const db = new JSONdb(path.join(__dirname, 'guilds.json'), {asyncWrite: true});

const playAudioFile = (channel, file) => {
	channel.join().then(voiceConnection => {
		const dispatcher = voiceConnection.play(file);
		dispatcher.on('finish', end => {
			channel.leave();
		});
	}).catch(err => console.log(err));
};

const broadcastAudioFile = (file) => {
	if (bot.readyAt) {
		bot.guilds.cache.forEach((guild) => {
			const channelID = db.get(guild.id);

			if (channelID) {
				const channel = guild.channels.resolve(channelID);
				
				if (channel && channel.type == 'voice') {
					if (channel.members.size > 0) {
						console.info(`Playing audio in guild '${guild.name}', channel '${channel.name}'`);
						playAudioFile(channel, file);
					} else {
						console.info(`Skipping guild '${guild.name}', channel '${channel.name}' because it is empty`);
					}
				}
			}
		});
	}
};

const triggerServer = http.createServer((req, res) => {
	broadcastAudioFile(path.join(__dirname, '4uur.mp3'));
	res.end('OK\n');
});

bot.on('ready', () => {
	console.info(`Logged in as ${bot.user.tag}`);
	triggerServer.listen(process.env.TRIGGER_PORT, process.env.TRIGGER_HOST, err => {
		if (err) return console.log('Could not start trigger server', err);
		console.info(`Trigger server listening on ${process.env.TRIGGER_HOST}:${process.env.TRIGGER_PORT}`);
	});
});

bot.on('message', message => {
	if (!message.guild || !message.member) return;

	if (message.mentions.has(bot.user)) {
		// @bot enable
		if (message.content.toLowerCase().includes('enable')) {
			if (message.member.voice && message.member.voice.channel) {
				const channel = message.member.voice.channel;
				message.reply(`set jingle channel to ${channel.name}.`);
				db.set(message.guild.id, channel.id);
				console.info(`Set guild '${message.guild.name}' to channel '${channel.name}'`);
			} else {
				message.reply('please join a voice channel first.');
			}
		// @bot disable
		} else if (message.content.toLowerCase().includes('disable')) {
			message.reply('disabled jingle.');
			db.delete(message.guild.id);
		}
	}
});

bot.login(process.env.DISCORD_TOKEN);
