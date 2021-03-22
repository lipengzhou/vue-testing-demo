import { shallowMount } from '@vue/test-utils'
import TodoFooter from '@/components/TodoApp/TodoFooter.vue'

describe('TodoFooter.vue', () => {
  /** @type {import('@vue/test-utils').Wrapper} */
  let wrapper = null

  beforeEach(async () => {
    const todos = [
      { id: 1, text: 'eat', done: false },
      { id: 2, text: 'play', done: true },
      { id: 3, text: 'sleep', done: false }
    ]
    wrapper = shallowMount(TodoFooter, {
      propsData: {
        todos
      }
    })
  })

  test('Done Todos Count', async () => {
    const count = wrapper.vm.todos.filter(t => !t.done).length
    const countEl = wrapper.find('[data-testid="done-todos-count"]')
    expect(Number.parseInt(countEl.text())).toBe(count)
  })

  test('Clear Completed Show', async () => {
    const button = wrapper.find('[data-testid="clear-completed"]')
    expect(button.exists()).toBeTruthy()

    // 清除所有任务的完成状态，判断 button 不存在
    wrapper = shallowMount(TodoFooter, {
      propsData: {
        todos: [
          { id: 1, text: 'eat', done: false },
          { id: 2, text: 'play', done: false },
          { id: 3, text: 'sleep', done: false }
        ]
      }
    })
    expect(wrapper.find('[data-testid="clear-completed"]').exists()).toBeFalsy()
  })

  test('Clear Completed', () => {

  })
})
