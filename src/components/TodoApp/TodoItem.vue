<template>
  <li data-testid="todo-item" :class="{
    completed: todo.done,
    editing: isEditing
  }">
    <div class="view">
      <input v-model="todo.done" data-testid="todo-done" class="toggle" type="checkbox" />
      <label
        data-testid="todo-text"
        @dblclick="isEditing = true"
      >{{ todo.text }}</label>
      <button
        data-testid="delete"
        class="destroy"
        @click="$emit('delete-todo', todo.id)"
      ></button>
    </div>
    <input
      class="edit"
      value="Rule the web"
      data-testid="todo-edit"
      @blur="isEditing = false"
    />
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
  },
  data () {
    return {
      isEditing: false
    }
  }
}
</script>
