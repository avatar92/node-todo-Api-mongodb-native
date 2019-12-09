var mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/TodoApp';
mongoose.Promise=global.Promise;
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true });

module.exports={
  mongoose,
}