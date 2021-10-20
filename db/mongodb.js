const mongoose = require ('mongoose');
mongoose.connection.on('open', ()=> console.log("connecting DB"));
mongoose.connection.on('close', ()=> console.log("disconnecting DB"));
mongoose.connection.on('error',function (err) {
    console.log('Error al conectar a la base de datos: ' + err)
})

async function connectDb({ port,host, dbName }){
    const uri = `mongodb://${host}:${port}/${dbName}`;
    await mongoose.connect( uri,
        {
            useNewUrlParser: true
        },
        function (err, _database) {
            if (err) {
                console.error(err.toString())
                process.exit(1)
            }
        }
    );
}

async function disconnectDb (done) {
    await mongoose.disconnect(done)
}


async function clearDb () {
    await mongoose.connection.dropDatabase()
}
module.exports = { connectDb, disconnectDb,clearDb };