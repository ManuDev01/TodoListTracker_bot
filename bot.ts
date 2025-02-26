import { Bot } from "grammy";

// Create a bot object
const bot = new Bot("7701073887:AAFvRXySUCI8l5mVC94oalweJV6OGizAVLQ"); // <-- place your bot token in this string

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
/* bot.on("message", (ctx) => ctx.reply("Got another message!"));*/

// Start the bot (using long polling)
bot.start();
console.log("Se ha iniciado el server")



bot.hears("Hola", async (ctx) => {
    const txt = ctx.message?.text;

    console.log(txt);
});

bot.command("todo", (ctx) => ctx.reply("Menu de lista de tareas"));

bot.command("sleepcalc", (ctx) => {
    ctx.reply("Calculadora de sueño")
    let date: Date = new Date();
    const cicloSueno: Number = 90; //Tiempo optimo de ciclo de sueno
    const cicloMinimo: Number = 4;
    const cicloMedio: Number = 5;
    const cicloRecomendado: Number = 6;

    ctx.reply("Hora actual: " + ":" + date.getHours() + date.getMinutes());



});