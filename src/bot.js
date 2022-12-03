import { Client, GatewayIntentBits } from "discord.js";
import { request } from "undici";
import * as dotenv from "dotenv";
import { SALDO } from "./commands.js";
dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const api = "https://saldometrobus.yizack.com/api";

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async interaction => {
  const { commandName, options, isChatInputCommand, user } = interaction;
  
  if (!isChatInputCommand) return;

  switch (commandName) { 
    // Comando /saldo
    case SALDO.name: {
      const num_tarjeta = options.getInteger("tarjeta");
      const { body, statusCode } = await request(`${api}/tarjeta/${num_tarjeta}`);
      const { status, tarjeta } = await body.json();

      if (statusCode === 200 && status === "ok") {
        await interaction.reply(`<@${user.id}>: \`${num_tarjeta}\`. Tu saldo es de \`B/. ${tarjeta.saldo}\`, Último uso en \`${tarjeta.fecha}\`.`);
      }
      else {
        await interaction.reply("Ha ocurrido un error.");
      }

      break;
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
