const fs = require('fs')
const path = require('path')

module.exports = fs.readdirSync(__dirname).reduce((result, file) => {
    if (path.extname(file) !== '.sql') return result
    result[name(file)] = load(file)
    return result
}, {})

function name(file) {
    return path.basename(file, '.sql').toUpperCase().replace(/-/g, '_')
}

function load(file) {
    return fs.readFileSync(path.join(__dirname, file), 'utf-8')
}
