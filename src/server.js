/**
 * Cloudflare worker.
 */
import { Router } from "itty-router";
import { verifyKey } from "discord-interactions";
import API from "./api.js";
import interaction from "./interaction.js";
import { getValue } from "./functions.js";
import { SALDO } from "./commands.js";

const router = Router();

router.get("/", (req, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});
 
router.post("/", async (req) => {
  const { type, data, member } = await req.json();
  const { create, reply, error } = interaction;
  
  return create(type, async () => {
    const { name, options } = data;

    switch (name) {
      // Comando /saldo
      case SALDO.name: {
        const num_tarjeta = getValue("tarjeta", options);
        const { status, tarjeta } = await API.getTarjeta(num_tarjeta);
        if (status === "ok") {
          return reply(`<@${member.user.id}>: \`${num_tarjeta}\`. Tu saldo es de \`B/. ${tarjeta.saldo}\`, Último uso en \`${tarjeta.fecha}\`.`);
        }
        else {
          return reply("Ha ocurrido un error.");
        }
      }
      default:
        return error("Unknown Type", 400);
    }
    
  });
  
});

router.all("*", () => new Response("Not Found.", { status: 404 }));
 
export default {
  async fetch(request, env) {
    const { method, headers } = request;
    if (method === "POST") {
      const signature = headers.get("x-signature-ed25519");
      const timestamp = headers.get("x-signature-timestamp");
      const body = await request.clone().arrayBuffer();
      const isValidRequest = verifyKey(
        body,
        signature,
        timestamp,
        env.DISCORD_PUBLIC_KEY
      );
      if (!isValidRequest) {
        return new Response("Bad request signature.", { status: 401 });
      }
    }
    return router.handle(request, env);
  },
};
