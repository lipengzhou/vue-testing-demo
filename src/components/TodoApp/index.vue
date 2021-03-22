<template>
  <section class="todoapp">
    <TodoHeader @new-todo="handleNewTodo"/>
    <!-- This section should be hidden by default and shown when there are todos -->
    <section class="main">
      <input
        v-model="toggleAll"
        data-testid="toggle-all"
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class `editing` when editing and `completed` when marked as completed -->
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @delete-todo="handleDelteTodo"
          @edit-todo="handleEditTodo"
        />
      </ul>
    </section>
    <!-- This footer should be hidden by default and shown when there are todos -->
    <TodoFooter :todos="todos"/>
  </section>
</template>

<script>
import TodoHeader from './TodoHeader'
import TodoFooter from './TodoFooter'
import TodoItem from './TodoItem'

export default {
  name: 'TodoApp',
  components: {
    TodoHeader,
    TodoFooter,
    TodoItem
  },
  data () {
    return {
      todos: []
    }
  },
  computed: {
    toggleAll: {
      get () {
        // 设置 toggleALl 的选中状态
        return this.todos.length && this.todos.every(t => t.done)
      },
      set (checked) {
        this.todos.forEach(todo => {
          todo.done = checked
        })
      }
    }
  },
  methods: {
    handleNewTodo (text) {
      const lastTodo = this.todos[this.todos.length - 1]
      this.todos.push({
        id: lastTodo ? lastTodo.id + 1 : 1,
        text,
        done: false
      })
    },
    handleDelteTodo (todoId) {
      const index = this.todos.findIndex(t => t.id === todoId)
      if (index !== -1) {
        this.todos.splice(index, 1)
      }
    },
    handleEditTodo ({ id, text }) {
      const todo = this.todos.find(t => t.id === id)
      if (!todo) {
        return
      }
      if (!text.trim().length) {
        // 执行删除操作
        return this.handleDelteTodo(id)
      }
      // 执行修改操作
      todo.text = text
    }
  }
}
</script>
