import { mount, createLocalVue } from '@vue/test-utils'
import TodoApp from '@/components/TodoApp/index.vue'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
const router = new VueRouter({
  linkActiveClass: 'selected'
})

/** @type {import('@vue/test-utils').Wrapper} */
let wrapper = null

beforeEach(async () => {
  wrapper = mount(TodoApp, {
    localVue,
    router
  })
})

describe('添加任务', () => {
  test('在输入框中输入内容敲回车，应该添加任务到列表中', async () => {
    // 找到输入框
    const input = wrapper.find('input[data-testid="new-todo"]')
    // 输入内容
    const text = 'Hello World'
    await input.setValue(text)

    // 敲回车
    await input.trigger('keyup.enter')

    // 结果：内容被添加到列表中
    expect(wrapper.find('[data-testid="todo-item"]')).toBeTruthy()
    expect(wrapper.find('[data-testid="todo-text"]').text()).toBe(text)
  })

  test('添加任务成功后，输入框内容应该被清空', async () => {
    // 找到输入框
    const input = wrapper.find('input[data-testid="new-todo"]')
    // 输入内容
    const text = 'Hello World'
    await input.setValue(text)

    // 敲回车
    await input.trigger('keyup.enter')

    // 结果：内容被添加到列表中
    expect(input.element.value).toBe('')
  })
})

describe('删除任务', () => {
  test('点击任务项中的删除按钮，任务应该被删除', async () => {
    // 准备测试环境数据
    await wrapper.setData({
      todos: [
        { id: 1, text: 'eat', done: false }
      ]
    })
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    // 找到任务项的删除按钮
    const delButton = wrapper.find('[data-testid="delete"]')

    // 删除之前是存在的
    expect(todoItem.exists()).toBeTruthy()

    // 点击删除按钮
    await delButton.trigger('click')

    // 删除之后就没有了
    expect(todoItem.exists()).toBeFalsy()
  })
})

describe('切换所有任务的完成状态', () => {
  test('选中切换所有按钮，所有的任务应该变成已完成', () => {

  })

  test('取消选中切换所有按钮，所有的任务应该变成未完成', () => {

  })

  test('当所有任务已完成的时候，全选按钮应该被选中，否则不选中', () => {

  })
})
