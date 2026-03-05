# EUGVRP-Romania-v2

## Setup

1. **Install dependencies**

   ```bash
   npm install
   # and add dotenv for environment variable support
   npm install dotenv
   ```

2. **Bot token**

   - Copy `.env.example` to `.env` and paste your Discord bot token there:
     ```dotenv
     TOKEN_BOT=your-real-token
     ```
   - Alternatively, you can export the variable in your shell:
     ```bash
     export TOKEN_BOT="your-real-token"
     ```
   - The code will also fallback to `config.botToken` if you prefer to put it in
     `config/config.json` (but be careful not to commit secrets).

3. **Ignore secrets**

   `.env` is already listed in `.gitignore`; never commit it. If you store the token
   in a separate `config/local.json`, add that file to `.gitignore` as well.

4. **Run the bot**

   ```bash
   node index.js
   ```

5. **Deploy commands**

   ```bash
   node deploy-commands.js
   ```

   Make sure you replace `CLIENT_ID`/`GUILD_ID` in the script with your own values.

---

The project uses ES modules and loads environment variables via `dotenv` if present.