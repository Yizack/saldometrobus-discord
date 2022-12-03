import { REST, Routes } from "discord.js";
import { SALDO } from "./commands.js";
import * as dotenv from "dotenv";
dotenv.config();

const commands = [SALDO];
const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID), { body: commands });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();
