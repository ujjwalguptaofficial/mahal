if (process.env.NODE_ENV === 'production') {
    module.exports = require('./mahal.commonjs2.js');
}
else if (process.env.NODE_ENV === 'test') {
    module.exports = require('./mahal.commonjs2.test.js');
}
else {
    module.exports = require('./mahal.commonjs2.js');
}
