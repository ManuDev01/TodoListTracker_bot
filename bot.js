"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
// Create a bot object
const bot = new grammy_1.Bot("7701073887:AAFvRXySUCI8l5mVC94oalweJV6OGizAVLQ"); // <-- place your bot token in this string
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
/* bot.on("message", (ctx) => ctx.reply("Got another message!"));*/
// Start the bot (using long polling)
bot.start();
console.log("Se ha iniciado el server");
/*
bot.on("message", async (ctx) => {
    ctx.reply("Ha llegado un mensaje");
});*/
bot.hears("Hola", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const txt = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text;
    console.log(txt);
}));
