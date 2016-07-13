module.exports = {
    logger: {
        transport: 'console'
    },
    mongo: {
        url: 'mongodb://127.0.0.1/example-test',
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
