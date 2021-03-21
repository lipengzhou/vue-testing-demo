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

  test('delete todo', async () => {
    const deleteBtn = wrapper.find('button[data-testid="delete"]')
    await deleteBtn.trigger('click')
    expect(wrapper.emitted()['delete-todo']).toBeTruthy()
    expect(wrapper.emitted()['delete-todo'][0][0]).toBe(wrapper.vm.todo.id)
  })

  test('edit todo', async () => {
    const label = wrapper.find('label[data-testid="todo-text"]')
    const todoItem = wrapper.find('li[data-testid="todo-item"]')
    const todoEdit = wrapper.find('input[data-testid="todo-edit"]')
    await label.trigger('dblclick')
    expect(todoItem.classes()).toContain('editing')

    await todoEdit.trigger('blur')
    expect(todoItem.classes('editing')).toBeFalsy()
  })
})
