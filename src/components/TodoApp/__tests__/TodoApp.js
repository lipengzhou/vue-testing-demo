import { shallowMount } from '@vue/test-utils'
import TodoApp from '@/components/TodoApp/index.vue'
import TodoItem from '@/components/TodoApp/TodoItem.vue'
// import Vue from 'vue'

describe('TodoApp.vue', () => {
  test('New todo', async () => {
    const wrapper = shallowMount(TodoApp)
    const text = 'play'
    wrapper.vm.handleNewTodo(text)
    const todo = wrapper.vm.todos.find(t => t.text === text)
    expect(todo).toBeTruthy()
  })

  test('Todo List', async () => {
    const wrapper = shallowMount(TodoApp)
    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false }
    ]
    await wrapper.setData({
      todos
    })
    expect(wrapper.findAllComponents(TodoItem).length).toBe(todos.length)
    // wrapper.vm.todos = [
    //   { id: 1, text: 'eat', done: false },
    //   { id: 2, text: 'play', done: true },
    //   { id: 3, text: 'sleep', done: false }
    // ]
    // await Vue.nextTick()
  })
})
