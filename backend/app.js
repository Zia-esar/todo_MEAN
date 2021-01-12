const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/todo', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(()=> console.log('Connected to Database ...'))
    .catch((error)=> console.log(error))

const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    // todoId: {
    //     type: mongoose.Types.ObjectId,
    //     required: true
    // }
})

const Todo = mongoose.model('Todo', TodoSchema)

app.get('/todo', (req, res)=> {
    Todo.find({})
        .then((list)=> res.send(list))
        .catch(error => console.log(error))
})

app.post('/todo', (req, res)=> {
    new Todo({ 'title': req.body.title })
        .save()
        .then((item) => res.send(item))
        .catch(err => console.log(err))
})

app.patch('/todo/:todoId', (req, res)=> {
    Todo.findOneAndUpdate({ _id: req.params.todoId}, {$set: req.body})
        .then((updatedTask)=> res.send(updatedTask))
        .catch(err => console.log(err))
})

app.delete('/todo/:todoId', (req, res)=> {
    Todo.findByIdAndDelete({ _id: req.params.todoId})
        .then(deletedTask => res.send(deletedTask))
        .catch(err => console.log(err))
})



app.listen(3000, ()=> console.log('Server is running on port 3000...'));