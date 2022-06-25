if (process.env.NODE_ENV === 'production') {
    module.exports = require('./mahal.min.commonjs2.js');
}
else {
    module.exports = require('./mahal.commonjs2.js');
}
