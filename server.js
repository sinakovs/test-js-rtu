const express = require('express');
const app = express();
const port = 8070;
const routes = require('./routes');

app.use(express.json());
app.use('/api/todos', routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
