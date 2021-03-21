import { shallowMount } from '@vue/test-utils'
import TodoItem from '@/components/TodoApp/TodoItem.vue'

describe('TodoItem.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null
  beforeEach(() => {
    const todo = {
      id: 1,
      text: 'play',
      done: true
    }
    wrapper = shallowMount(TodoItem, {
      propsData: {
        todo
      }
    })
  })
  test('text', () => {
    expect(wrapper.find('[data-testid="todo-text"]').text()).toBe(wrapper.vm.todo.text)
  })

  test('done', async () => {
    const done = wrapper.find('[data-testid="todo-done"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    expect(done.element.checked).toBeTruthy()
    expect(todoItem.classes()).toContain('completed')

    await done.setChecked(false)
    expect(todoItem.classes('completed')).toBeFalsy()
  })
})
