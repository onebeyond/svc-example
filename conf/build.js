module.exports = {
    logger: {
        transport: 'console'
    },
    mongo: {
        url: 'mongodb://mongo/example-test',
        options: {
            server: {
                socketOptions: {
                    keepAlive: 1000,
                    connectTimeoutMS: 5000,
                    socketTimeoutMS: 5000
                }
            }
        }
    }
}
