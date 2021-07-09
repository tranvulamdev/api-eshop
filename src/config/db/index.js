const mongoose = require('mongoose')

async function connect(connectionString) {
    await mongoose
        .connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        })
        .then(() => console.log('Database connection is ready...'))
        .catch(err => console.log(err))
}

module.exports = { connect }
