import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';  // ← さっき作ったLoginコンポーネントをimport
import './index.css';         // CSSはそのまま
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 ログイン状態を管理
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState(''); // 追加: 期限日を管理するステート

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchTodos();
    }
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://todo-app-backend-qw9b.onrender.com/api/todos/', {
        headers: { Authorization: `Token ${token}` }
      });
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  
  const fetchTodosQuiet = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://todo-app-backend-qw9b.onrender.com/api/todos/', {
        headers: { Authorization: `Token ${token}` }
      });
      setTodos(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  const addTodo = async () => {
    if (title.trim() === '') return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://todo-app-backend-qw9b.onrender.com/api/todos/', 
        { title, completed: false }, 
        { headers: { Authorization: `Token ${token}` } }
      );
      setTitle('');
      setDueDate(''); // 追加: タイトルをクリア
      fetchTodosQuiet();
    } catch (error) {
      console.error(error);
    }
  };
  
  const deleteTodo = async (todo) => {  // ここもidじゃなくてtodoを受け取ったほうがいい
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://todo-app-backend-qw9b.onrender.com/api/todos/${todo.id}/`, {
        headers: { Authorization: `Token ${token}` }
      });
      fetchTodosQuiet();
    } catch (error) {
      console.error(error);
    }
  };
  
  const toggleComplete = async (todo) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://todo-app-backend-qw9b.onrender.com/api/todos/${todo.id}/`, 
        { title: todo.title, completed: !todo.completed },
        { headers: { Authorization: `Token ${token}` } }
      );
      fetchTodosQuiet(); // ← ここ！！
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={() => {
        setIsLoggedIn(true);
        setTodos([]);  // ★ここでリストをいったんクリア
        fetchTodos();  // ★ログイン直後にタスク一覧を取り直す！！
    }} />;
  }

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl">Loading...</p>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">ToDoリスト</h1>
            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">
              ログアウト
            </button>
          </div>
          <div className="flex mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクを追加"
              className="border p-2 flex-1"
            />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border p-2"
            />
            <button onClick={addTodo} className="ml-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            追加
            </button>
          </div>
          <div className="flex mb-4">
            <button onClick={() => setFilter('all')} className="mr-2 bg-gray-300 p-2 rounded">すべて</button>
            <button onClick={() => setFilter('completed')} className="mr-2 bg-gray-300 p-2 rounded">完了</button>
            <button onClick={() => setFilter('incomplete')} className="bg-gray-300 p-2 rounded">未完了</button>
          </div>
  
          <AnimatePresence>
            {todos
              .filter((todo) => {
                if (filter === 'completed') return todo.completed;
                if (filter === 'incomplete') return !todo.completed;
                return true;
              })
              .map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between bg-white p-4 rounded shadow mb-2"
                >
                  <div
                    className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}
                    onClick={() => toggleComplete(todo)}
                  >
                    <div>{todo.title}</div>
                    <div className="text-sm">
                      作成: {new Date(todo.created_at).toLocaleDateString()}<br />
                      期限: <span className={
                        todo.due_date && new Date(todo.due_date) < new NativeAnimation().setHours(0,0,0,0)
                          ? 'text-red-500'
                          : 'text-gray-500'
                      }>
                      {todo.due_date || '未設定'}
                      </span>
                    </div>
                  </div>
                  <button onClick={() => deleteTodo(todo)} className="text-red-500">削除</button>
                </motion.div>
              ))
          }
          </AnimatePresence>
        </div>
      )}
    </>
  );
}

export default App;