
const express = require("express");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const dbJSON = require("./Develop/db/db.json");
const path = require("path");


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('Develop/public'));



// Routes
// ==============================================

//------------------HTML-----------------------------------
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

app.get('/notes', function(req, res) {
  res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});



//----GET from db.json------------------------------
app.get('/api/notes', function(req, res) {
  res.json(dbJSON);
});

//------if no title------------------------
app.post('/note', function(req, res) {
  if(!req.body.title) {
    return res.json({error: "Missing Title!"});
  }
})
//-----------post api note------------------------
app.post("/api/notes", function(req, res){
  // res.sendFile(path.join(__dirname, './Develop/db/db.json'))
  req.body["id"] = Math.floor(Math.random()*10000000);
  dbJSON.push(req.body);
  fs.writeFile("./Develop/db/db.json", JSON.stringify(dbJSON), (err)=>{
    if(err) throw err;
    return res.json(dbJSON);
  })
})

//--------------delete note-----------------------
app.delete('/api/notes/:id', function(req, res) {
  let IDToBeDeleted = req.params.id;
  let data = req.body //Probably don't need

  for (i=0; i<dbJSON.length; i++){
    if(IDToBeDeleted == dbJSON[i].id){
      dbJSON.splice(i, 1);
      fs.writeFile("./Develop/db/db.json", JSON.stringify(dbJSON), err => {
        if(err) throw err;
        return res.json(dbJSON);
      })
    }
    }
})

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, './Develop/public/index.html'));
});

  // Copy request body and generate ID
  // const note = {...req.body, id: uuidv4()}

  // Push note to dbJSON array - saves data in memory
  // dbJSON.push(note);

  // Saves data to file by persisting in memory variable dbJSON to db.json file.
  // This is needed because when we turn off server we loose all memory data like pbJSON variable.
  // Saving to file allows us to read previous notes (before server was shutdown) from file.
  // fs.writeFile(path.join(__dirname, "db.json"), JSON.stringify(dbJSON), (err) => {
  //   if (err) {
  //     return res.json({error: "Error writing to file"});
  //   }

  //   return res.json(note);
  // });



// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});
