const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')

app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  var arr = [];
  fs.readdir('./files', (err, file) => {
    file.forEach(function (file) {
      var data = fs.readFileSync(`./files/${file}`, 'utf-8');
      arr.push({ name: file, content: data })
    })
    res.render('index', { files: arr })
  })
  console.log(arr)
})

// create file
app.post('/create', function (req, res) {
  var fn = req.body.title.split(' ').join('') + '.txt';
  fs.writeFile(`./files/${fn}`, req.body.details, function (err) {
    if (err) {
      res.status(404).send('folder not found')
    }
  })
  res.redirect('/')
})

// open file
app.get('/read/:filename', function (req, res) {
  const name = req.params.filename.split(' ').join('');
  fs.readFile(`./files/${name}`, 'utf-8', function (err, files) {
    if (err) return console.log(err);
    else res.render('task', { name: req.params.filename, content: files })
  })

})

// delete file
app.get('/delete/:filename', function (req, res) {
  const name = req.params.filename;
  fs.unlink(`./files/${name}`, function (err, files) {
    if (err) return console.log(err);
    res.redirect('/')
  })

})

// Save file
app.post('/save/:filename', function (req, res) {
  const fn = req.params.filename;
  let newFn = req.body.title.split(' ').join('');
  
  fs.writeFile(`./files/${fn}`, req.body.details, function (err) {
    if (err) {
      return res.status(500).send('Error!');
    }
    
    // Renaming the file
    const ext = newFn.includes('.');
    if (!ext) {
      newFn += '.txt';
    }
    fs.rename(`./files/${fn}`, `./files/${newFn}`, function (err) {
      if (err) {
        return res.status(500).send('Error renaming file');
      }
      res.redirect('/');
    });
  });
});



app.listen(3000)
