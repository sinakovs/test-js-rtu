const express = require('express');
const router = express.Router();
const handlers = require('./handlers');

router.get('/', handlers.getAllTodos);
router.get('/one', handlers.getTodosFromFile);
router.get('/async', handlers.getTodosFromFileAsync);
router.get('/:id', handlers.getTodoById);
router.post('/', handlers.createTodo);
router.post('/async', handlers.createTodoAsync);
router.patch('/:id', handlers.toggleTodoCompleted);
router.delete('/:id', handlers.deleteTodo);

module.exports = router;