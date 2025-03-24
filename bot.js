"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const userTasks = new Map();
// Create a bot object
const bot = new grammy_1.Bot("7701073887:AAFvRXySUCI8l5mVC94oalweJV6OGizAVLQ"); // <-- place your bot token in this string
// Handle the /start command.
bot.command("start", (ctx) => {
    const keyboard = new grammy_1.InlineKeyboard();
    keyboard.text("Prueba").row();
});
// Handle other messages.
/* bot.on("message", (ctx) => ctx.reply("Got another message!"));*/
// Start the bot (using long polling)
bot.start();
console.log("Se ha iniciado el server");
bot.hears("Hola", async (ctx) => {
    const txt = ctx.message?.text;
    console.log(txt);
});
bot.command("todo", (ctx) => ctx.reply("Menu de lista de tareas"));
//Calculadora de sueno
bot.command("sleepcalc", (ctx) => {
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };
    const calculateWakeUpTime = (cycles) => {
        const now = new Date();
        const minutesToAdd = cycles * 90;
        const wakeUpTime = new Date(now.getTime() + minutesToAdd * 60000);
        return formatTime(wakeUpTime);
    };
    const currentTime = formatTime(new Date());
    const response = `🛌 Calculadora de sueño\n
⏰Hora actual: ${currentTime}\n
🌙Si te duermes ahora, deberías levantarte a:
🔴 3 ciclos (4.5 horas): ${calculateWakeUpTime(3)}
🟡 4 ciclos (6 horas): ${calculateWakeUpTime(4)}
🟢 5 ciclos (7.5 horas): ${calculateWakeUpTime(5)}
🟢 6 ciclos (9 horas): ${calculateWakeUpTime(6)}`;
    ctx.reply(response);
});
bot.command("about", (ctx) => {
});
//Todo List
bot.command("todolist", async (ctx) => {
    const userId = ctx.from.id;
    if (!userTasks.has(userId))
        userTasks.set(userId, []);
    await showTodoList(ctx, userId);
});
// Mostrar lista de tareas
async function showTodoList(ctx, userId) {
    const tasks = userTasks.get(userId) || [];
    const keyboard = new grammy_1.InlineKeyboard();
    tasks.forEach(task => {
        keyboard.text(`${task.status === "done" ? "✅" : "◻️"} ${task.text} [${task.priority}]`, `task_${task.id}`).row();
    });
    keyboard.text("➕ Añadir tarea", "add_task").row();
    await ctx.reply(`📝 *Tu Lista de Tareas*${tasks.length === 0 ? "\n\n_No hay tareas pendientes_" : ""}`, {
        parse_mode: "Markdown",
        reply_markup: keyboard
    });
}
// Manejar acciones de botones
bot.callbackQuery(/task_(.+)/, async (ctx) => {
    const taskId = ctx.match[1];
    const userId = ctx.from.id;
    const tasks = userTasks.get(userId) || [];
    const task = tasks.find(t => t.id === taskId);
    if (!task)
        return await ctx.answerCallbackQuery("Tarea no encontrada");
    const keyboard = new grammy_1.InlineKeyboard()
        .text(task.status === "done" ? "❌ Marcar pendiente" : "✅ Marcar completada", `toggle_${taskId}`)
        .row()
        .text("🔼 Alta", `priority_high_${taskId}`)
        .text("🟡 Media", `priority_medium_${taskId}`)
        .text("🔽 Baja", `priority_low_${taskId}`)
        .row()
        .text("🗑 Eliminar", `delete_${taskId}`)
        .row()
        .text("🔙 Volver", "back_to_list");
    await ctx.editMessageText(`📌 *Gestionando tarea:*\n\n${task.text}\n\n` +
        `🏷 *Estado:* ${task.status === "done" ? "Completada" : "Pendiente"}\n` +
        `🚩 *Prioridad:* ${task.priority}`, {
        parse_mode: "Markdown",
        reply_markup: keyboard
    });
});
// Añadir nueva tarea
bot.callbackQuery("add_task", async (ctx) => {
    await ctx.deleteMessage();
    await ctx.reply("Escribe la nueva tarea:", {
        reply_markup: new grammy_1.Keyboard().resized()
    });
});
// Manejar texto para nuevas tareas
bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;
    if (!userTasks.has(userId))
        userTasks.set(userId, []);
    const newTask = {
        id: Date.now().toString(),
        text: text,
        status: "pending",
        priority: "medium"
    };
    userTasks.get(userId).push(newTask);
    await showTodoList(ctx, userId);
});
// Manejar otras acciones
bot.callbackQuery(/toggle_(.+)/, async (ctx) => {
    const taskId = ctx.match[1];
    const userId = ctx.from.id;
    const tasks = userTasks.get(userId) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === "done" ? "pending" : "done";
        await ctx.answerCallbackQuery();
        await showTodoList(ctx, userId);
    }
});
bot.callbackQuery(/priority_(.+)_(.+)/, async (ctx) => {
    const [priority, taskId] = ctx.match.slice(1);
    const userId = ctx.from.id;
    const tasks = userTasks.get(userId) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task && ["low", "medium", "high"].includes(priority)) {
        task.priority = priority;
        await ctx.answerCallbackQuery();
        await showTodoList(ctx, userId);
    }
});
bot.callbackQuery("back_to_list", async (ctx) => {
    await showTodoList(ctx, ctx.from.id);
});
