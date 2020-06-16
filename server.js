let express = require("express");
let path = require("path");
let fs = require("fs");
let app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get("/notes", function(req, res){
    console.log("Loaded notes.html page");
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

app.get("/api/notes", function(req, res){
    console.log("Reading db.json data");
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", function(req, res) {
        console.log("Posting to db.json");
    let newNote = req.body;
    let databasepath = path.join(__dirname, "db/db.json");
    fs.readFile(databasepath, "utf8", function (err, data) {
        if (err) throw err;
        let currentData = JSON.parse(data);
            console.log(currentData);
        newNote.id = currentData.length + newNote.title;
        currentData.push(newNote);
        let addData = JSON.stringify(currentData);
        fs.writeFile(databasepath, addData, function (err){
            if (err) throw err;
        });
    })
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});



app.delete("/api/notes/:id", function(req, res) {
    console.log("Deleting from db.json");
    res.sendFile(path.join(__dirname, "public/notes.html"));

    let noteId = req.params.id;
    let databasepath = path.join(__dirname, "db/db.json");

    fs.readFile(databasepath, "utf8", function(err, data) {
        if (err) throw err;
        let currentData = JSON.parse(data);
        for (let i = 0; i < currentData.length; i++) {
            if (currentData[i].id === noteId) {
                currentData.splice(i, 1)
            }
        }
        let update = JSON.stringify(currentData);
        fs.writeFile(databasepath, update, function (err) {
          if (err) throw err;
    })

});
res.sendFile(path.join(__dirname, "public/notes.html"));
});





app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
  });


