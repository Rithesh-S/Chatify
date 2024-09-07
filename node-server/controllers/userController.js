const bcrypt = require('bcryptjs')
const { connectToDatabase } = require('../utils/db')
const { generateId } = require('../utils/idGenerator')
const { timeStampGenerator } = require('../utils/timeStamp')

const dataBase = "ChatApp"
const users = "Users"
const userContact = "User_Contacts"

async function signup(req, res) {
    const client = await connectToDatabase()
    const { username, password } = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const document = await collection.findOne({username: username})
        if(document) {
            return res.status(409).json()
        } 
        const userId = generateId()
        const hashedPassword = await bcrypt.hash(password, 10);
        const timestamp = timeStampGenerator()
        const userData = { userid: userId , username: username, password: hashedPassword , isactive: true , socketid: "" , timestamp: timestamp, lastseen: timestamp}
        const result = await collection.insertOne(userData)
        if(result) {
            return res.status(201).json()
        }
        res.status(404).json()
    } 
    catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function addMember(req, res) {
    const client = await connectToDatabase()
    const request = req.body
    try {
        const collection = client.db(dataBase).collection(userContact)
        const check = await collection.findOne({ userid : request.addUserId })
        if(check) {
            const checkUser = check.contacts.find(val => val.userid === request.userId )
            if(checkUser?.chatid) {
                const result = await collection.findOneAndUpdate(
                    { userid: request.userId },
                    { $push: { contacts: { userid: request.addUserId,chatid:checkUser.chatid ,name: request.username } } },
                    { upsert: true}
                )
                if (result) {
                   return res.status(201).json({ message: true })
                } 
                else {
                    return res.status(404).json({ message: false })
                }
            }
        }
        const chatId = generateId()
        const result = await collection.findOneAndUpdate(
            { userid: request.userId },
            { $push: { contacts: { userid: request.addUserId,chatid:chatId ,name: request.username } } },
            { upsert: true}
        )
        if (result) {
            res.status(201).json({ message: true })
        } 
        else {
            res.status(404).json({ message: false })
        }
    }
    catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

module.exports = {
    signup,
    addMember
}