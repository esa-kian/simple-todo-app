import { defineStore } from "pinia"
import { ref } from "vue"
import type { Todo } from "../types/todo"
import api from "../api/axios"

export const useTodoStore = defineStore('todo', () => {
    const todos = ref<Todo[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchTodos = async () => {
        loading.value = true;
        try {
            const res = await api.get<Todo[]>('/todos')
            todos.value = res.data
        } catch (err) {
            error.value = 'Failed to fetch todos'
        } finally {
            loading.value = false
        }
    }

    const addTodo = async (title: string, description: string) => {
        try {
            const res = await api.post<Todo>('/todos', { title, description, completed: false })
            todos.value.push(res.data)
        } catch (err) {
            error.value = 'Failed to add todo'
        }
    }

    const updateTodo = async (todo: Todo) => {
        try {
            await api.put(`/todos/${todo.id}`, todo)
            const index = todos.value.findIndex(t => t.id === todo.id)
            if (index !== -1) todos.value[index] = todo
        } catch (err) {
            error.value = 'Failed to update todo'
        }
    }

    const deleteTodo = async (id: number) => {
        try {
            await api.delete(`/todos/${id}`)
            todos.value = todos.value.filter(t => t.id !== id)
        } catch (err) {
            error.value = 'Failed to delete todo'
        }
    }

    return { todos, loading, error, fetchTodos, addTodo, updateTodo, deleteTodo }
})