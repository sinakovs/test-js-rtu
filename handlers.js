const fs = require('fs').promises;
const fsp = require('fs');
const path = require('path');


const todosFilePath = path.join(__dirname, './data/data.txt');
let todos = [];



const loadTodos = () => {
  try {
    const data = fsp.readFileSync(todosFilePath, 'utf8');
    return data.split('\n').map(line => {
      const [TodosNumber, ID, Item, Completed] = line.split('::');
      return {
        TodosNumber: parseInt(TodosNumber),
        ID,
        Item,
        Completed: Completed === 'true'
      };
    });
  } catch {
    return [];
  }
};


todos = loadTodos();
let tempCounter = todos.length;

const loadTodosAsync = async () => {
  try {
    const data = await fs.readFile(todosFilePath, 'utf8');
    return data
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [TodosNumber, ID, Item, Completed] = line.split('::');
        return {
          TodosNumber: parseInt(TodosNumber),
          ID,
          Item,
          Completed: Completed === 'true'
        };
      });
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
};

const saveTodos = () => {
  try {
    const data = todos.map(todo => `${todo.TodosNumber}::${todo.ID}::${todo.Item}::${todo.Completed}`).join('\n');
    fs.writeFile(todosFilePath, data, 'utf8');
  } catch {}
};

const saveTodosAsync = async () => {
  try {
    const data = todos.map(todo => `${todo.TodosNumber}::${todo.ID}::${todo.Item}::${todo.Completed}`).join('\n');
    await fs.writeFile(todosFilePath, data, 'utf8');
  } catch {}
};


exports.getAllTodos = (req, res) => {
  res.json(todos);
};

exports.getTodosFromFile = (req, res) => {
  const result = loadTodos();
  res.json(result);
};

exports.getTodosFromFileAsync = async (req, res) => {
  try {
    const result = await loadTodosAsync();
    res.json(result);
  } catch (error) {
    console.error('Error loading todos:', error);
    res.status(500).send('Internal Server Error');
  }
};


exports.getTodoById = (req, res) => {
  const todo = todos.find(t => t.ID === req.params.id);
  if (!todo) return res.status(404).send('Todo not found');
  res.json(todo);
};

exports.createTodo = (req, res) => {
  const newTodo = {
    TodosNumber: todos.length + 1,
    ID: req.body.id,
    Item: req.body.item,
    Completed: req.body.completed || false
  };
  todos.push(newTodo);
  if ((newTodo.TodosNumber - tempCounter) > 5) {
    saveTodos();
    tempCounter = newTodo.TodosNumber;
  }
  res.status(201).json(newTodo);
};

exports.createTodoAsync = async (req, res) => {
  const newTodo = {
    TodosNumber: todos.length + 1,
    ID: req.body.id,
    Item: req.body.item,
    Completed: req.body.completed || false
  };
  todos.push(newTodo);
  if ((newTodo.TodosNumber - tempCounter) > 5) {
    await saveTodosAsync();
    tempCounter = newTodo.TodosNumber;
  }
  res.status(201).json(newTodo);
};

exports.toggleTodoCompleted = (req, res) => {
  const todo = todos.find(t => t.ID === req.params.id);
  if (!todo) return res.status(404).send('Todo not found');
  todo.Completed = !todo.Completed;
  saveTodos();
  res.json(todo);
};

exports.deleteTodo = (req, res) => {
  const index = todos.findIndex(t => t.ID === req.params.id);
  if (index === -1) return res.status(404).send('Todo not found');
  todos.splice(index, 1);
  saveTodos();
  res.status(204).send();
};
