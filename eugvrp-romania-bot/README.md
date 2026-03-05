# eugvrp-romania-bot README

# eugvrp-romania-bot

## Overview
This project is a Discord bot built using Node.js and the Discord.js library. It is designed to respond to commands and interact with users in a Discord server.

## Features
- Responds to the "ping" command.
- Logs activity when the bot is ready.
- Handles user interactions.

## Setup Instructions

### Prerequisites
- Node.js (version 16 or higher)
- npm (Node package manager)
- A Discord account and a server where you can test the bot

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   cd eugvrp-romania-bot
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on the `.env.example` template:
   ```
   cp .env.example .env
   ```

4. Fill in the `.env` file with your Discord bot token and guild ID:
   ```
   DISCORD_TOKEN=your_bot_token
   GUILD_ID=your_guild_id
   ```

### Running the Bot
To start the bot locally, use the following command:
```
npm start
```

### Deploying on Railway
1. Ensure your `Procfile` contains the following line:
   ```
   web: node src/index.js
   ```

2. Push your code to Railway and set up the environment variables in the Railway dashboard:
   - DISCORD_TOKEN
   - GUILD_ID

3. Deploy the application.

## Commands
- **ping**: Responds with "Pong!" when invoked.

## Contributing
Feel free to submit issues or pull requests for improvements or bug fixes.

## License
This project is licensed under the MIT License.