import nodemailer from 'nodemailer';
import * as fs from "fs/promises";
import * as logger from "./logger.js";

const config = JSON.parse(
    await fs.readFile(new URL("./config.json", import.meta.url))
  );
  
const correo = nodemailer.createTransport(config.email);

export async function enviar(email, asunto, texto) {
    const resultado = await transporter.sendMail({
        from: config.email.auth.user,
        to: email,
        subject: asunto,
        text: texto
    });

    console.log(JSON.stringify(resultado, null, 4));
    await logger.info("Se ha enviado un correo a " + email + ": " + texto);
}