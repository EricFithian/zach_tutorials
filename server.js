require('dotenv').config();
// import express
const express = require('express');
// This is something useless I'm adding as a comment
const methodOverride = require('method-override');
// configure the app settings (used by app.listen) for 4000 or Heroku
const {MONGODB_URI, PORT} = process.env;
const { users, tutorials, reviews } = require('./controllers');
const MongoStore = require('connect-mongo');
const session = require('express-session')

// Updated with the env vars

// create instance
const app = express();
const bodyParser = require('body-parser')

// app configs - app.set()
app.set('view engine', 'ejs');
var multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

var upload = multer({ storage: storage });
console.log(MONGODB_URI)
app.use(
    session({
        store: MongoStore.create({ mongoUrl: MONGODB_URI }),
        secret: "super secret",
        resave: false,
        saveUninitialized: false,
        // configure the experation of the cookie
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7 * 2, // two weeks
        },
    })
);

/* 
EXPRESS Middleware - a later topic - this code will run for every route
*/
app.use(bodyParser.json());
app.use(express.static('public'))
app.use(methodOverride('_method'))
// method override middleware

// body-parser middleware -> intercept the data from our post request
// take all of the data in the url-string content and create an object - req.params 
// request body -> data - parsed by the middleware

app.use(express.urlencoded({ extended: false }))


// CONTROLLERS 

app.use('/tutorials', tutorials) // "products" router
app.use('/reviews', reviews) // "reviews" router
app.use('', users) // "users" router

app.post('/uploadfile', (req, res, next) => {
    // create an incoming form object
    var form = new formidable.IncomingForm();
    // specify that we want to allow the user to upload multiple files in a single request
    form.multiples = true;
    // store all uploads in the /uploads directory
    form.uploadDir = path.basename(path.dirname('/uploads/json_files/'))
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name), function(err){
            if (err) throw err;
            //console.log('renamed complete: '+file.name);
            const file_path = '/uploads/'+file.name
        });
    });
    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });
    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        //res.end('success');
        res.statusMessage = "Process cashabck initiated";
        res.statusCode = 200;
        res.redirect('/')
        res.end()
    });
    // parse the incoming request containing the form data
    form.parse(req);
});


/* 
    EXPRESS Routing: express provides route methods that will intercept requests to the server:
    1. filter by method - app.get will only run if the type of request has a GET method
    2. match the url path argument - a requested url from the client - if a match is found a call back function is called
    3. the callback function - provided two arguments by express representing data/methods concerning the request and the response. 
        3a - request {} - a request object provides information about the request made by the client
        3b - response {} - a response object is a collection of properties / methods. 
        3c - response.send() - a response method that closes response cycle -> send back info/data to the browser
    
    Note: A response method call is required for every request otherwise the server will "hang" and timeout after 30-60 seconds
*/


// Products "Home" route 

app.get('/', (req, response) => {
    console.log(req.session);
    let context;
    if(req.session.currentUser) {
        context = {
            user: req.session.currentUser.username
        }
    } else {
        context = {
            user: undefined
        }
    }
    response.render(`home.ejs`, context)
})

/* 
    EXPRESS Server: initializes the server; app.listen allows your computer to receive requests at http://localhost:4000/ 
*/

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`))