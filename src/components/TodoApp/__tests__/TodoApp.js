import { shallowMount } from '@vue/test-utils'
import TodoApp from '@/components/TodoApp/index.vue'
import TodoItem from '@/components/TodoApp/TodoItem.vue'
// import Vue from 'vue'

describe('TodoApp.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null

  beforeEach(async () => {
    wrapper = shallowMount(TodoApp)
    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false }
    ]
    await wrapper.setData({
      todos
    })
  })

  test('New todo', async () => {
    const wrapper = shallowMount(TodoApp)
    const text = 'play'
    wrapper.vm.handleNewTodo(text)
    const todo = wrapper.vm.todos.find(t => t.text === text)
    expect(todo).toBeTruthy()
  })

  test('Todo List', async () => {
    expect(wrapper.findAllComponents(TodoItem).length).toBe(wrapper.vm.todos.length)
  })

  test('Delete Todo', async () => {
    await wrapper.vm.handleDelteTodo(1)
    expect(wrapper.vm.todos.length).toBe(2)
    expect(wrapper.findAllComponents(TodoItem).length).toBe(2)
  })

  test('Delete Todo', async () => {
    await wrapper.vm.handleDelteTodo(123)
    expect(wrapper.vm.todos.length).toBe(3)
    expect(wrapper.findAllComponents(TodoItem).length).toBe(3)
  })

  test('Edit Todo', async () => {
    const todo = { id: 2, text: 'abc' }
    await wrapper.vm.handleEditTodo(todo)
    expect(wrapper.vm.todos[1].text).toBe(todo.text)

    todo.text = ''
    await wrapper.vm.handleEditTodo(todo)
    expect(wrapper.vm.todos.find(t => t.id === todo.id)).toBeFalsy()
  })
})
