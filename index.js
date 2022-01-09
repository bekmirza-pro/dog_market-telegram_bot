const TelegramBot = require('node-telegram-bot-api')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 4040
const images = require('./images')

const TOKEN = '2110083429:AAEtLE_2hKBv3vzRaTRuFYQ4dnnjoubIe5A'

const bot = new TelegramBot(TOKEN, {
    polling: true
})

const orders = []
const dogs = [

    {
        id: 1,
        name: 'Haski',
        price: '200 000',
        age: 2
    },
    {
        id: 2,
        name: 'Apcharka',
        price: '400 000',
        age: 3
    },
    {
        id: 3,
        name: 'Buldog',
        price: '700 000',
        age: 1
    },
    {
        id: 4,
        name: 'Pitbull',
        price: '500 000',
        age: 4
    }
]


bot.onText(/\/start/, msg => {

    const receiver = msg.chat.id

    bot.sendMessage(receiver, `Assalomu aleykum ${msg.from.first_name}, It bozoriga xush kelibsiz !!`, {
        reply_markup: {
            keyboard: [
                [{
                        text: '🐶 Itlarning zoti'
                    },
                    {
                        text: '👥 Biz haqimizda'
                    },
                ],
                [{
                    text: '📞 Aloqa'
                }]
            ],
            resize_keyboard: true
        }
    })
})

bot.on('message', msg => {

    const receiver = msg.chat.id

    if (msg.text === '🐶 Itlarning zoti') {
        bot.sendMessage(receiver, 'Itlaring zotlari', {
            reply_markup: {
                keyboard: [
                    [{
                            text: '🦮 Haski',
                        },
                        {
                            text: '🐕‍🦺 Apcharka',
                        }
                    ],
                    [{
                            text: '🐕 Buldog',
                        },
                        {
                            text: '🐩 Pitbull',
                        }
                    ],
                    [{
                        text: '⬅️  Orqaga',
                    }, ]
                ],
                resize_keyboard: true
            }
        })
    }

    if (msg.text === '⬅️  Orqaga') {

        bot.sendMessage(receiver, '✅ Asosiy menyuga qaytdingiz !!!', {
            reply_markup: {
                keyboard: [
                    [{
                            text: '🐶 Itlarning zoti'
                        },
                        {
                            text: '👥 Biz haqimizda'
                        },
                    ],
                    [{
                        text: '📞 Aloqa'
                    }]
                ],
                resize_keyboard: true
            }
        })
    }

    if (msg.text === '🦮 Haski') {
        bot.sendPhoto(receiver, images.haski, {
            caption: `Nomi Haski IT\nNarxi: 200 000 so'm\nYoshi: 2 yosh`,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Buyurtma berish',
                        callback_data: '1'
                    }]
                ],
                one_time_keyboard: true
            }
        })
    }
    if (msg.text === '🐕‍🦺 Apcharka') {
        bot.sendPhoto(receiver, images.apcharka, {
            caption: `Nomi 🐕‍🦺 Apcharka IT\nNarxi: 300 000 so'm\nYoshi: 2 yosh`,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Buyurtma berish',
                        callback_data: '2'
                    }]
                ],
                one_time_keyboard: true
            }
        })
    }
    if (msg.text === '🐕 Buldog') {
        bot.sendPhoto(receiver, images.buldog, {
            caption: `Nomi 🐕 Buldog IT\nNarxi: 700 000 so'm\nYoshi: 1 yosh`,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Buyurtma berish',
                        callback_data: '3'
                    }]
                ],
                one_time_keyboard: true
            }
        })
    }
    if (msg.text === '🐩 Pitbull') {
        bot.sendPhoto(receiver, images.pitbull, {
            caption: `Nomi 🐩 Pitbull IT\nNarxi: 500 000 so'm\nYoshi: 4 yosh`,
            reply_markup: {
                inline_keyboard: [
                    [{
                        text: 'Buyurtma berish',
                        callback_data: '3'
                    }]
                ],
                one_time_keyboard: true
            }
        })
    }

})

bot.on('callback_query', data => {
    const receiver = data.from.id

    let username;

    const { data: id } = data

    const dog = dogs.find(e => e.id == id)

    bot.sendMessage(receiver, 'Ismingizni kiriting', {
        reply_markup: {
            force_reply: true
        }
    }).then(payload => {
        const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg => {

            username = msg.text

            bot.removeReplyListener(replyListenerId)

            bot.sendMessage(receiver, 'Raqamni jonating', {
                reply_markup: {
                    keyboard: [
                        [{
                            text: 'Contact',
                            request_contact: true
                        }],
                        [{
                            text: '⬅️  Orqaga',
                        }]
                    ],
                    resize_keyboard: true
                }
            }).then(payload => {
                const replyListenerId = bot.onReplyToMessage(payload.chat.id, payload.message_id, msg => {

                    bot.removeReplyListener(replyListenerId)

                    const { contact: { phone_number: number } } = msg

                    orders.push({
                        id: orders.length + 1,
                        name: username,
                        contact: number,
                        dogInfo: {
                            id: dog.id,
                            name: dog.name,
                            price: dog.price,
                            age: dog.age
                        }
                    })

                    bot.sendMessage(receiver, 'Sizning buyurtmangiz qabul qilindi, yaqin orada aloqaga chiqamiz 😊😊😊 !!')

                    console.log(orders)
                })
            })
        })
    })
})

app.get('/allOrders', (req, res) => {
    res.json(orders)
})

app.listen(PORT, () => console.log(PORT))