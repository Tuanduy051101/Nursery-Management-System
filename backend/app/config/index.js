const config = {
    app: {
        port: process.env.PORT || 4001,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb://localhost:27017/lvtn"
    }
}

module.exports = config;

