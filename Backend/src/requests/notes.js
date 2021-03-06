import mongo from "mongodb"
import connect from "../db"

export default {
    async get(req, res) {
        try {
            let db = await connect()
            let cursor = await db.collection("notes").find({ owner: mongo.ObjectId(req.body._id) }).sort({ date: -1 })
            let result = await cursor.toArray()
            cursor.close()
            if (result.length > 0) res.json(result)
            else res.sendStatus(400)
        } catch {
            res.sendStatus(400)
        }
    },

    async set(req, res) {
        try{
            req.body.owner = mongo.ObjectId(req.body.owner)
            req.body.date = new Date
            let db = await connect()
            let result = await db.collection("notes").insertOne(req.body)
            if (result.insertedCount == 1) res.json(result.insertedId)
            else res.sendStatus(400)
        } catch {
            res.sendStatus(400)
        }
    },

    async delete(req, res) {
        try {
            let db = await connect()
            let result = await db.collection("notes").deleteOne({ _id: mongo.ObjectId(req.params.id) })
            if (result.deletedCount == 1) res.sendStatus(200)
            else res.sendStatus(400)
        } catch {
            res.sendStatus(400)
        }
    }
}
