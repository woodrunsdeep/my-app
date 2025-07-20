<template>
  <div class="p-6 border rounded-lg">
    <h3 class="text-xl font-bold mb-4">
      Todo List
    </h3>

    <!-- Loading state -->
    <div
      v-if="pending"
      class="text-gray-500"
    >
      Loading todos...
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="text-red-500 mb-4"
    >
      Error loading todos: {{ error.message }}
    </div>

    <!-- Todos list -->
    <div v-else>
      <div
        v-if="data?.todos?.length === 0"
        class="text-gray-500 mb-4"
      >
        No todos found. Create your first todo below.
      </div>

      <div
        v-else
        class="space-y-2 mb-6"
      >
        <div
          v-for="todo in data?.todos"
          :key="todo.id"
          class="flex items-center justify-between p-3 border rounded-lg"
        >
          <div>
            <h4 class="font-medium">
              {{ todo.title }}
            </h4>
            <p class="text-sm text-gray-500">
              Created: {{ new Date(todo.createdAt).toLocaleDateString() }}
            </p>
          </div>
          <button
            class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            @click="deleteTodo(todo.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add todo form -->
    <div class="border-t pt-4">
      <h4 class="font-medium mb-3">
        Add New Todo
      </h4>

      <div
        v-if="createError"
        class="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm"
      >
        {{ createError }}
      </div>

      <form
        class="flex gap-2"
        @submit.prevent="createTodo"
      >
        <input
          v-model="newTodoTitle"
          type="text"
          required
          placeholder="Enter todo title..."
          class="flex-1 p-2 border rounded-md"
        >
        <button
          type="submit"
          :disabled="creating"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {{ creating ? 'Adding...' : 'Add' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
// Fetch todos with useFetch for reactivity
const { data, pending, error, refresh } = await useFetch('/api/todos')

const newTodoTitle = ref('')
const creating = ref(false)
const createError = ref(null)

const createTodo = async () => {
  creating.value = true
  createError.value = null

  try {
    await $fetch('/api/todos', {
      method: 'POST',
      body: {
        title: newTodoTitle.value
      }
    })

    // Reset form
    newTodoTitle.value = ''

    // Refresh the todos list
    await refresh()
  }
  catch (err) {
    console.error('Error creating todo:', err)
    createError.value = err.data?.message || err.message || 'Failed to create todo'
  }
  finally {
    creating.value = false
  }
}

const deleteTodo = async (todoId) => {
  try {
    await $fetch(`/api/todos/${todoId}`, {
      method: 'DELETE'
    })

    // Refresh the todos list
    await refresh()
  }
  catch (err) {
    console.error('Error deleting todo:', err)
    alert('Failed to delete todo')
  }
}
</script>
