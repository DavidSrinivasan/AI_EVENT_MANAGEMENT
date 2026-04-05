const mongoose = require('mongoose');

const dbConfig = {
    uri: 'mongodb://localhost:27017/ai_event_management',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
};

const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.uri, dbConfig.options);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = {
    connectDB,
};