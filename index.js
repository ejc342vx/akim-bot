require('dotenv').config();

const helper = require('./helpers')

const {
    Telegraf
} = require('telegraf')
const Extra = require('telegraf/extra')
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', err => {
    console.error(
        `Error occurred during an attempt to establish connection with the database`,
        err
    );
    process.exit(1);
});

mongoose.connection.on('open', () => {

    const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

    const AkimSchema = new Schema({
        chatId: {
            type: Number,
            unique: true
        },
        maxTime: {
            type: Number,
        },
        lastAkimMessage: {
            type: Number,
        },
        stevenCounter: {
            type: Number,
        },
        messageCounter: {
            type: Number
        }
    });

    const Akim = mongoose.model('Akim', AkimSchema, 'akim');
    const words = ['Омерзительно.', 'Отвратительно.', 'Маразм.', 'Бред какой-то.', 'Наркоманы какие-то.', 'Не пишите такой маразм больше никогда.']
    const regex = /(^|\s)аким|асланов|akim|aslanov|aким?\D(?=\s|$)/gi

    const findDoc = chatId => Akim.findOne({
        chatId: chatId
    });

    const checkMessageDate = messageDate => messageDate < (Date.now() / 1000 | 0)

    bot.command('akimstats', async (ctx) => {
        if (checkMessageDate(ctx.message.date)) {
            return
        }
        const doc = await findDoc(ctx.message.chat.id)
        if (doc && doc.maxTime) {
            ctx.reply(helper.maxTime(doc.maxTime))
        }
    })

    bot.command('lastmessage', async (ctx) => {
        if (checkMessageDate(ctx.message.date)) {
            return
        }
        const doc = await findDoc(ctx.message.chat.id)
        if (doc && doc.lastAkimMessage) {
            ctx.reply(helper.currentTime(ctx.message.date - doc.lastAkimMessage))
        }
    })

    bot.on(['text', 'photo', 'sticker', 'audio', 'video', 'document', 'forward'], async (ctx) => {
        const doc = await findDoc(ctx.message.chat.id)
        if (checkMessageDate(ctx.message.date)) {  //|| ctx.message.date - doc.lastAkimMessage == 0
            return
        }
        if (doc) {
            doc.messageCounter += 1
            if (doc.messageCounter > 120) {
                doc.messageCounter = 0
                ctx.reply(words[Math.floor(Math.random() * words.length)], Extra.inReplyTo(ctx.update.message.message_id))
            }

            if (ctx.update.message.from.id == 366160795) {
                doc.stevenCounter += 1
                if (doc.stevenCounter > 13) {
                    doc.stevenCounter = 0
                    ctx.reply('Держи в курсе.', Extra.inReplyTo(ctx.update.message.message_id))
                }
            }

            if (ctx.message.text && ctx.message.text.length > 500 || ctx.message.caption && ctx.message.caption.length > 500) {
                ctx.reply('Я даже дальше середины это читать не хочу.', Extra.inReplyTo(ctx.update.message.message_id))
            }

            if (ctx.message.text || ctx.message.caption) {
                if ((ctx.message.text || ctx.message.caption).match(regex)) {
                    ctx.reply(helper.time(ctx.message.date - doc.lastAkimMessage))
                    const lastInterval = ctx.message.date - doc.lastAkimMessage
                    doc.maxTime = doc.maxTime > lastInterval ? doc.maxTime : lastInterval
                    doc.lastAkimMessage = ctx.message.date
                }
            }
            doc.save()
        } else {
            const Akim1 = new Akim({
                chatId: ctx.message.chat.id,
                lastAkimMessage: ctx.message.date,
                maxTime: 0,
                messageCounter: 1,
                stevenCounter: 0
            })
            Akim1.save()
        }
    })
    bot.launch()
})