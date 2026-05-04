import { useEffect, useState } from 'react'
import axios from 'axios'

const API = 'http://localhost:5001'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/api/todos`)
    setTodos(res.data)
  }

  useEffect(() => { fetchTodos() }, [])

  const addTodo = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    await axios.post(`${API}/api/todos`, { title })
    setTitle('')
    fetchTodos()
  }

  const toggleTodo = async (id, completed) => {
    await axios.put(`${API}/api/todos/${id}`, { completed: !completed })
    fetchTodos()
  }

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/api/todos/${id}`)
    fetchTodos()
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Todo App</h1>

      <form onSubmit={addTodo} className="flex gap-2 mb-6">
        <input
          className="border p-2 flex-1 rounded"
          placeholder="Add a todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 rounded" type="submit">
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo._id} className="flex justify-between items-center border p-3 rounded">
            <span
              onClick={() => toggleTodo(todo._id, todo.completed)}
              className={`cursor-pointer ${todo.completed ? 'line-through text-gray-400' : ''}`}
            >
              {todo.title}
            </span>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && <p className="text-gray-400 mt-6">No todos yet.</p>}
    </div>
  )
}

export default App