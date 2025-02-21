const mongoose = require('mongoose')

const db = mongoose.connect('mongodb+srv://root:root@cluster0.j2ecr.mongodb.net/schools?retryWrites=true&w=majority&appName=Cluster0',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>{
    console.log('DB is connected')
})
.catch((err)=>{
    console.log("DataBase Error: ", err)
})

module.exports = db