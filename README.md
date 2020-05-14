# Time-for-beer-Discord-bot
## What is this?
This bot will play the well known time-for-beer-jingle at 4 PM in a Discord voice channel.

## How to add to your server
1. https://discord.com/api/oauth2/authorize?client_id=710496419978412110&permissions=3146752&scope=bot
2. Join a voice channel in which you want to hear the jingle every day at 4 PM
3. Type '@Tijd voor bier enable' in any text channel on the server

Had enough fun? Disable the bot for your server by typing '@Tijd voor bier disable' in any channel or simply
kick the bot from the server.

## Getting the code to work
1. Clone repository
2. Install ffmpeg
3. `npm install`
4. Set Discord bot token in `.env`
5. Add trigger to your crontab file, for example: `59 15 * * * sleep 41; curl http://127.0.0.1:23655;`