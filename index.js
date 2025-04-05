const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); 

const app = express();
const port = 8000;


app.use(bodyParser.json());

app.get('/students', (req, res) => {
  const query = 'SELECT * FROM students';
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});


app.post('/students', (req, res) => {
  const { firstname, lastname, gender, age } = req.body;

  const query = `INSERT INTO students (firstname, lastname, gender, age)
                 VALUES (?, ?, ?, ?)`;

  db.run(query, [firstname, lastname, gender, age], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, firstname, lastname, gender, age });
  });
});


app.get('/student/:id', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM students WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(row);
  });
});


app.put('/student/:id', (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, gender, age } = req.body;

  const query = `UPDATE students SET firstname = ?, lastname = ?, gender = ?, age = ? WHERE id = ?`;

  db.run(query, [firstname, lastname, gender, age, id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ id, firstname, lastname, gender, age });
  });
});


app.delete('/student/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM students WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: `Student with ID ${id} deleted successfully` });
  });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
