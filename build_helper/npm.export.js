if (process.env.NODE_ENV === 'production') {
    module.exports = require('./taj.commonjs2.js');
}
else if (process.env.NODE_ENV === 'test') {
    module.exports = require('./taj.commonjs2.test.js');
}
else {
    module.exports = require('./taj.commonjs2.js');
}
