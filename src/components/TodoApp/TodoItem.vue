<template>
  <li data-testid="todo-item" :class="{
    completed: todo.done
  }">
    <div class="view">
      <input v-model="todo.done" data-testid="todo-done" class="toggle" type="checkbox" />
      <label data-testid="todo-text">{{ todo.text }}</label>
      <button class="destroy"></button>
    </div>
    <input class="edit" value="Rule the web" />
  </li>
</template>

<script>
export default {
  name: 'TodoItem',
  props: {
    todo: {
      type: Object,
      required: true
    }
  }
}
</script>
