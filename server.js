const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
const PORT = 3000;
const connectionString = "mongodb+srv://yayati:Pumpkin@64@cluster0.qtrns.mongodb.net/Todo?retryWrites=true&w=majority";
var router = express.Router();
/*
Express.js, or simply Express, is a web application framework for Node.js,
released as free and open-source software under the MIT License.

It is designed for building web applications and APIs.
/*

/*
body-parser extract the entire body portion of an incoming request stream and exposes it on req. body .
The middleware was a part of Express. js earlier but now you have to install it separately. This body-parser module parses the JSON,
buffer, string and URL encoded data submitted using HTTP POST request.
*/
try {
    mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, () =>
            console.log("connected"));
} catch (error) {
    console.log("could not connect");
}





app.set('views', './views'); // specify the views directory
app.set('view engine', 'ejs'); // register the template engine
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
app.use(bodyParser.json()); // Send JSON responses
//render css files
app.use('/static', express.static("public"));

const todoTaskSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
const toDo = mongoose.model('ToDo', todoTaskSchema);
mongoose.set('useFindAndModify', false);
var toDoTasks = [{ task: "Run" }];

app.get('/', (req, res) => {

    toDo.find({}, (err, tasks) => {
        res.render("index.ejs", { toDoTask: tasks });
    });
})



//Create To-Do
app.post('/addtask', (req, res) => {

    const task = req.body.newtask;

    var toDoAdd = new toDo({
        task: task,
    });



    toDoAdd.save((err, todo) => {
        if (err) {
            return res.status(500).json({ err });
        }
        toDoTasks.push(todo);
        res.redirect("/");
    });



});

app.route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;

        toDo.find({}, (err, tasks) => {

            res.render("todoEdit.ejs", { toDoTasks: tasks, idTask: id });
        });
    })
    .post((req, res) => {
        const id = req.params.id;
        console.log(req.body)
        toDo.findByIdAndUpdate(id, { task: req.body.task }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });

//View To-Do
app.get('todos/', (req, res) => {
    toDo.find({}, (err, toDos) => {
        if (err) {
            res.status(500).json({
                err
            });
        } else {
            res.status(200).json({
                message: 'All ToDos',
                toDos
            });
        }
    });
});

//View Single To-Do
app.get('todos/:todo_id', (req, res) => {

    const { todo_id } = req.params;

    toDo.findById(todo_id, (err, toDo) => {
        if (err) {
            res.status(500).json({
                err
            });
        } else {
            res.status(200).json({
                message: 'To-Do',
                toDo
            });
        }
    });
});




//Remove Single To-Do
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    toDo.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

//Remove all To-Do
app.route('/deleteAll').get((req, res) => {

    toDo.remove({}, (err, toDo) => {
        if (err) {
            res.status(500).json({
                err
            });
        } else {
            res.redirect("/");
        }
    });
});
app.listen(process.env.PORT || 3000);

// add router in the Express app.






