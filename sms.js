import twilio from "twilio";
import * as fs from "fs/promises";
import * as logger from "./logger.js";

const config = JSON.parse(
  await fs.readFile(new URL("./config.json", import.meta.url))
);

const sms = twilio(config.sms.sid, config.sms.token);

export async function enviar(numero, mensaje) {
    try {
        const message = await sms.messages.create({
            body: mensaje,
            to: numero,
            from: config.sms.telefono
        });
        await logger.info("Se ha enviado un mensaje en SMS a " + numero + ": " + mensaje);
    } catch (error) {
        console.log(numero)
        await logger.error(error);
    }
}