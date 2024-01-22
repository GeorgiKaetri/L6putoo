const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const uploaders =[];
const reviews = [];
const accounts = [];
const images = [
   
];

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
    console.log(req);
});

app.post("/register", (req, res) => {
    let username = req.body.username;
    let passw = req.body.passw;

    accounts.push({
        username: username,
        password: passw,
    });
    res.sendFile(__dirname + "/public/indexSucces.html");
});

app.post("/login", (req, res) => {
    function isObjectInArray(array, targetObject) {
        return array.some((obj) => isEqual(obj, targetObject));
    }
    function isEqual(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    let username = req.body.usernameLogin;
    let passw = req.body.passwLogin;
    let user = {
        username: username,
        password: passw,
    };

    if (isObjectInArray(accounts, user)) {
        console.log("Redirecting to /cats with username:", username);
        res.redirect(`/cats?usernameLogin=${encodeURIComponent(username)}`);


    } else {
        res.sendFile(__dirname + "/public/indexFail.html");
    }
});

app.get("/cats", (req, res) => {
    let usernameLogin = req.query.usernameLogin || '';
    console.log("Username in /cats:", usernameLogin);

    if (usernameLogin !== "") {
        uploaders.push(usernameLogin);
    } else {
        let lastUploader = uploaders.length > 0 ? uploaders[uploaders.length - 1] : undefined;
        console.log("Using last non-empty uploader:", lastUploader);
        uploaders.push(lastUploader);
    }

    console.log("Updated uploaders:", uploaders);

    res.render("cats", {
        imageUrls: images,
        usernames: uploaders,
        username: uploaders[uploaders.length -1]

        
    });
});






app.post("/addCats", (req, res) => {
    let url = req.body.url;
  
    console.log("hello"); 
    if (url !== "") {
        images.push(url);
    }
    res.redirect("/cats");
});



app.post("/addCatsApi", (req, res) => {
  

    fetch('https://api.thecatapi.com/v1/images/search')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            let url = data[0].url;
            images.push(url);
            console.log(uploaders);
            res.redirect("/cats");
        })
        .catch(error => {
            console.error('Error fetching cat image:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});









app.post("/backToLogin", (req, res) => {
    res.redirect("/");
});



app.post("/review", (req, res) => {
    let anotherreview = req.body.review;
   

    reviews.push({
        review: anotherreview,
    });
    res.redirect("/cats");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
