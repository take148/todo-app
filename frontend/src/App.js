import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = 'https://todo-app-backend-qw9b.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all'); // 👈 追加！フィルター状態を管理

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await axios.get(`${BASE_URL}/api/todos/`);
    setTodos(response.data);
  };

  const addTodo = async () => {
    if (title.trim() === '') return;
    await axios.post(`${BASE_URL}/api/todos/`, { title, completed: false });
    setTitle('');
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${BASE_URL}/api/todos/${id}/`);
    fetchTodos();
  };

  const toggleComplete = async (todo) => {
    await axios.put(`${BASE_URL}/api/todos/${todo.id}/`, {
      title: todo.title,
      completed: !todo.completed,
    });
    fetchTodos();
  };

  // ここでフィルターに応じて表示するリストを作る！
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6">TODOリスト</h1>

      <div className="flex w-full max-w-md gap-2 mb-6">
        <input
          className="flex-1 p-2 rounded border border-gray-300"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクを入力"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={addTodo}
        >
          追加
        </button>
      </div>

      {/* フィルターボタン */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
        >
          すべて
        </button>
        <button
          onClick={() => setFilter('incomplete')}
          className={`px-4 py-2 rounded ${filter === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
        >
          未完了
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-white text-blue-500 border border-blue-500'}`}
        >
          完了
        </button>
      </div>

      <ul className="w-full max-w-md space-y-2">
        <AnimatePresence>
          {filteredTodos.map((todo) => (
            <motion.li
              key={todo.id}
              className="flex justify-between items-center p-3 bg-white rounded shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo)}
                  className="w-5 h-5"
                />
                <span className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.title}
                </span>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => deleteTodo(todo.id)}
              >
                削除
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

export default App;