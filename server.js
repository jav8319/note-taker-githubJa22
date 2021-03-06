const express = require('express');
const path = require('path');
const fs = require('fs');
const notes=require('./db/db.json');
const uuid = require('./helper/uuid.js');
// Helper method for generating unique ids
// const uuid = require('./helper/uuid');
// const { title } = require('process');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('/api/notes', (req, res) =>
res.sendFile(path.join(__dirname, './db/db.json'))
);

app.delete('/api/notes/:id', function(req, res) {
  const id = req.params.id;

  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
    } else {
      const parsedNote = JSON.parse(data);


      var index =parsedNote.findIndex((note0) => note0.id === id);
      parsedNote.splice(index,1)
      console.info("2--------------")
      console.info(parsedNote)
      
   

      
      fs.writeFile(
        './db/db.json',
        JSON.stringify(parsedNote, null, 4),
        (writeErr) =>
          writeErr
            ? console.error(writeErr)
            : console.info('--Successfully updated notes---!')

      );
      res.json(notes)
    }
    
  });



});

app.post('/api/notes', (req, res) => {
 
  console.info(`${req.method} request received to add a note`);

  
  const {title, text} = req.body;

  
  if (title && text) {
    
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        
        const parsedNote = JSON.parse(data);

        
        parsedNote.push(newNote);

        
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} ????`)
);

