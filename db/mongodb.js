const mongoose = require ('mongoose');
mongoose.connection.on('open', ()=> console.log("conection DB"));
async function connectDb({ port,host, dbName }){
    const uri = `mongodb://${host}:${port}/${dbName}`;
    let options = {
        db: {native_parser: true}
        //,server: {poolSize: 5},
        //replset: {rs_name: 'myReplicaSetName'}
        //,user: 'myUserName',
        //pass: 'myPassword'
        
    }
    await mongoose.connect( uri,
        {
            useNewUrlParser: true
        },
        function (err, database) {
            if (err) {
                console.error(err.toString())
                process.exit(1)
            }
        }
    );
}

module.exports = connectDb;