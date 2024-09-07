const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = process.env.SECRET_KEY
const { connectToDatabase } = require('../utils/db')
const { timeStampGenerator } = require('../utils/timeStamp')

const dataBase = "ChatApp";
const users = "Users";
const userContact = "User_Contacts";
const messages = "Messages";

async function login(req, res) {
    const client = await connectToDatabase()
    const { username, password } = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const document = await collection.findOne({username: username})
        if (!document)
            return res.status(404).json()
        if (!await bcrypt.compare(password, document.password)) 
            return res.status(401).json()
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token , userId: document.userid , isactive: document.isactive})
    } 
    catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function statusUpdate(req,res) {
    const client = await connectToDatabase()
    const request = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const document = await collection.findOne({userid: request.userId})
        if(document) {
            if(request.updateType) {
                await collection.updateOne({ userid: document.userid },{ $set: { isactive: true } })
                res.status(200).json({result: true})
            }
            else {
                const now = timeStampGenerator()
                await collection.updateOne({ userid: document.userid },{ $set: { isactive: false } })
                await collection.updateOne({ userid: document.userid },{ $set: { lastseen: now } })
                res.status(204).json({result: true})
            } 
        } else {
            res.status(404).json({ result: false })
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

async function checkStatus(req,res) {
    const client = await connectToDatabase()
    try {
        const collection = client.db(dataBase).collection(users)
        const projection = { lastseen: 1, userid: 1, isactive: 1, _id: 0 }
        const document = await collection.find({},{ projection }).toArray()
        if(document) {
            res.status(200).json({ result: true , response: document })
        } 
        else {
            res.status(404).json({ result: false })  
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

async function getUser(req, res) {
    const client = await connectToDatabase()
    const request = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const result = await collection.findOne({username: request.username})
        if(result) {
            res.status(200).json({ response: true, userId : result.userid})
        } else {
            res.status(404).json({ response: false })
        }
    } catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function getUserCollections(req, res) {
    const client = await connectToDatabase();
    const userDatabase = req.params.userId;
    try {
        const collection = await client.db(userDatabase).listCollections().toArray()
        const collectionNames = collection.map(col => col.name)
        if(collectionNames.length === 0) res.status(404)
        res.status(200).json(collectionNames)
    } catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log("Disconnected")
    }
}

async function getChatUserList(req, res) {
    const client = await connectToDatabase()
    const request = req.body;
    try {
        const collection = client.db(dataBase).collection(userContact)
        const results = await collection.findOne({ userid: request.userId })
        if(results) {
            const usercontacts = results.contacts
            res.status(200).json(usercontacts)
        }
        else {
            res.status(404)
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

async function updateSocket(req,res) {
    const client = await connectToDatabase()
    const request = req.body
    try {
        const collection = client.db(dataBase).collection(users)
        const results = await collection.findOne({ userid: request.userId })
        if(results) {
            await collection.updateOne({ userid: request.userId },{ $set: { socketid: request.socketId } })
            res.status(200).json({result: true})
        }
        else {
            res.status(404)
        }
    }
    catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log('Disconnected')
    }
}

async function addMessage(chatid,userid,message) {
    const client = await connectToDatabase()
    try {
        const collection = client.db(dataBase).collection(messages)
        const time = timeStampGenerator()
        const data = { $push: {messages: { userid: userid, message: message ,time: time } }}
        const result = await collection.findOneAndUpdate(
            { chatid: chatid },
            data,
            { upsert: true}
        )
        if(result) {
            return true
        }
        else {
            return false
        }
    }
    catch(err) {
        console.error(err)
    }
    finally {
        client.close()
        console.log('Disconnected')
    }
} 

async function receiveMessage() {
    const client = await connectToDatabase()
    try {
        const collection = client.db(dataBase).collection(messages)
        const result = await collection.find({}).toArray()
        if(result) {
            return result
        }
        else {
            return false
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
    login,
    getUser,
    getUserCollections,
    getChatUserList,
    statusUpdate,
    checkStatus,
    updateSocket,
    addMessage,
    receiveMessage
}
