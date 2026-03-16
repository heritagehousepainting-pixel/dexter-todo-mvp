'use client'

import { useState, useEffect } from 'react'

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [mounted, setMounted] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('dexter-todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
    setMounted(true)
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('dexter-todos', JSON.stringify(todos))
    }
  }, [todos, mounted])

  const addTodo = () => {
    if (!input.trim()) return
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: input.trim(),
      completed: false,
    }
    setTodos([...todos, newTodo])
    setInput('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addTodo()
  }

  if (!mounted) return null

  return (
    <main className="max-w-md mx-auto pt-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        ✓ Todo List
      </h1>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={200}
          placeholder="Add a task..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {todos.length === 0 ? (
          <li className="text-center text-gray-500 py-8">
            No tasks yet. Add one above!
          </li>
        ) : (
          todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-gray-100 group"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {todo.completed && (
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
              <span
                className={`flex-1 ${
                  todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                }`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>

      {/* Stats */}
      {todos.length > 0 && (
        <p className="text-center text-gray-500 mt-6 text-sm">
          {todos.filter(t => !t.completed).length} remaining • {todos.filter(t => t.completed).length} done
        </p>
      )}
    </main>
  )
}
