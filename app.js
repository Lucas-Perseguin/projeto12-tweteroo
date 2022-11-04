import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const users = [];
const tweets = [];

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;
  if (!(username && avatar)) {
    res.status(400).send('Todos os campos são obrigatórios!');
    return;
  } else {
    users.push({ username, avatar });
    res.status(201).send('Ok');
  }
});

app.post('/tweets', (req, res) => {
  const { tweet } = req.body;
  const { username } = req.headers;
  if (!(username && tweet)) {
    res.status(400).send('Todos os campos são obrigatórios!');
    return;
  } else {
    tweets.push({ username, tweet });
    res.status(201).send('Ok');
  }
});

app.get('/tweets', (req, res) => {
  const { page } = req.query;
  if (isNaN(page) || page < 1) {
    res.status(400).send('Informe uma página válida!');
  }
  const pageTweets = tweets.slice((page - 1) * 10, page * 10);
  res.json(pageTweets);
});

app.get('/tweets/:username', (req, res) => {
  const { username } = req.params;
  const user = users.find((user) => user.username === username);
  if (!user) {
    res.status(400).send('Usuário não encontrado');
    return;
  }
  const userTweets = tweets.filter((tweet) => tweet.username === username);
  userTweets.forEach((tweet) => {
    tweet.avatar = user.avatar;
  });
  res.json(userTweets);
});

app.listen(5000);
