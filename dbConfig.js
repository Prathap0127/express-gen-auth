const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient

const dbName = 'b40wde'

const dbUrl =`mongodb+srv://prathap27:prathap27@cluster0.6nroldb.mongodb.net/${dbName}` 


module.exports={mongodb,MongoClient,dbName,dbUrl}