const express = require('express');
const app = express();
const port = 3000;

// configure
app.set('views', '../public/views');
app.set('view engine', 'pug');
app.use(express.static('../public'));

// route
app.get('/', (req, res) => {
  res.render('index');
});

// run
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});