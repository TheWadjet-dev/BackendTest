const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Admin123',
  database: 'users'
});

const promisePool = pool.promise();

// GET
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// GET
app.get('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await promisePool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener el usuario');
  }
});

// POST
app.post('/usuarios', async (req, res) => {
  const { nombre, correo, password } = req.body;
  try {
    const [result] = await promisePool.query('INSERT INTO usuarios (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, password]);
    res.status(201).send({ id: result.insertId, nombre, correo, password });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear el usuario');
  }
});

// PUT
app.put('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, correo, password } = req.body;
  try {
    const [result] = await promisePool.query('UPDATE usuarios SET nombre = ?, correo = ?, password = ? WHERE id = ?', [nombre, correo, password, id]);
    if (result.affectedRows > 0) {
      res.send('Usuario actualizado');
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar el usuario');
  }
});

// DELETE
app.delete('/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await promisePool.query('DELETE FROM usuarios WHERE id = ?', [id]);
    if (result.affectedRows > 0) {
      res.send('Usuario eliminado');
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar el usuario');
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
