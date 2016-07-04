module.exports = {
    service: {
        reload: {
            delay: '60s'
        }
    },
    server: {
        host: '0.0.0.0',
        port: 3000,
        shutdown: {
            delay: '5s'
        }
    },
    logger: {
        transport: 'json',
        include: [
            'tracer',
            'timestamp',
            'level',
            'message',
            'error.message',
            'error.code',
            'error.stack',
            'request.url',
            'request.headers',
            'request.params',
            'request.method',
            'response.statusCode',
            'response.headers',
            'response.time',
            'process',
            'system',
            'package.name',
            'mongo',
            'service'
        ],
        exclude: [
            'password',
            'secret',
            'token',
            'request.headers.cookie',
            'dependencies',
            'devDependencies'
        ]
    }
}