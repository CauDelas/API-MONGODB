// Importações necessárias
const express = require('express');
const mongoose = require('mongoose');
const Person = require('./models/Person');

// Inicialização do aplicativo Express
const app = express();

// Configuração para permitir JSON e dados de formulários no corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas
app.post('/person', async (req, res) => {
  const { name, salary, approved } = req.body;

  const person = { name, salary, approved };

  try {
    await Person.create(person);
    res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/person', async (req, res) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.get('/person/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const person = await Person.findById(id);

    if (!person) {
      return res.status(422).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.patch('/person/:id', async (req, res) => {
  const id = req.params.id;
  const { name, salary, approved } = req.body;

  const updatedData = { name, salary, approved };

  try {
    const updatedPerson = await Person.updateOne({ _id: id }, updatedData);

    if (updatedPerson.matchedCount === 0) {
      return res.status(422).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

app.delete('/person/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const person = await Person.findById(id);

    if (!person) {
      return res.status(422).json({ message: 'Usuário não encontrado!' });
    }

    await Person.deleteOne({ _id: id });
    res.status(200).json({ message: 'Usuário removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({ message: 'Oi Express!' });
});

// Conexão com o MongoDB e inicialização do servidor
mongoose
  .connect('mongodb+srv://cauamaciel779:pj24jKMQsiGMOwrN@apimongodb.4hhln.mongodb.net/?retryWrites=true&w=majority&appName=apiMongoDB')
  .then(() => {
    console.log('Conectou ao banco!');
    app.listen(3000, () => {
      console.log('Servidor rodando na porta 3000');
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err.message);
  });
