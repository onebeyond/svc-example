module.exports = {
    mongo: {
        url: 'mongodb://127.0.0.1/example',
        options: {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            maxPoolSize: 10,
            minPoolSize: 1,
            maxIdleTimeMS: 10000,
            waitQueueTimeoutMS: 5000,
            readPreference: 'secondaryPreferred'
        }
    }
}
