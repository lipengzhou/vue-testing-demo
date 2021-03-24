import { mount, createLocalVue } from '@vue/test-utils'
import TodoApp from '@/components/TodoApp/index.vue'
import VueRouter from 'vue-router'
import Vue from 'vue'

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

describe('切换单个任务完成状态', () => {
  test('选中任务完成状态按钮，任务的样式变成已完成状态', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: false }
      ]
    })

    const todoDone = wrapper.find('[data-testid="todo-done"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')

    // 初始未选中
    expect(todoDone.element.checked).toBeFalsy()
    // 初始没有完成样式
    expect(todoItem.classes('completed')).toBeFalsy()

    // 选中任务项的复选框
    await todoDone.setChecked()

    // 断言结果
    expect(todoDone.element.checked).toBeTruthy()
    expect(todoItem.classes('completed')).toBeTruthy()
  })

  test('取消选中任务完成状态按钮，任务的样式变成未完成状态', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true }
      ]
    })

    const todoDone = wrapper.find('[data-testid="todo-done"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')

    expect(todoDone.element.checked).toBeTruthy()
    expect(todoItem.classes('completed')).toBeTruthy()

    // 选中任务项的复选框
    await todoDone.setChecked(false)

    // 断言结果
    expect(todoDone.element.checked).toBeFalsy()
    expect(todoItem.classes('completed')).toBeFalsy()
  })
})

describe('切换所有任务的完成状态', () => {
  test('选中切换所有按钮，所有的任务应该变成已完成', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: false },
        { id: 2, text: 'eat', done: false },
        { id: 3, text: 'sleep', done: true }
      ]
    })
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')
    const todoDones = wrapper.findAll('[data-testid="todo-done"]')

    expect(toggleAll.element.checked).toBeFalsy()

    await toggleAll.setChecked()

    for (let i = 0; i < todoDones.length; i++) {
      expect(todoDones.at(i).element.checked).toBeTruthy()
    }
  })

  test('取消选中切换所有按钮，所有的任务应该变成未完成', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true },
        { id: 2, text: 'eat', done: true },
        { id: 3, text: 'sleep', done: true }
      ]
    })

    const toggleAll = wrapper.find('[data-testid="toggle-all"]')
    const todoDones = wrapper.findAll('[data-testid="todo-done"]')

    expect(toggleAll.element.checked).toBeTruthy()

    await toggleAll.setChecked(false)

    for (let i = 0; i < todoDones.length; i++) {
      expect(todoDones.at(i).element.checked).toBeFalsy()
    }
  })

  test('当所有任务已完成的时候，全选按钮应该被选中，否则不选中', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true },
        { id: 2, text: 'eat', done: false },
        { id: 3, text: 'sleep', done: false }
      ]
    })
    const toggleAll = wrapper.find('[data-testid="toggle-all"]')
    const todoDones = wrapper.findAll('[data-testid="todo-done"]')

    expect(toggleAll.element.checked).toBeFalsy()

    for (let i = 0; i < todoDones.length; i++) {
      todoDones.at(i).setChecked()
    }
    await Vue.nextTick()
    expect(toggleAll.element.checked).toBeTruthy()

    // 取消选中任意任务项
    await todoDones.at(0).setChecked(false)

    // 全选也应该取消选中
    expect(toggleAll.element.checked).toBeFalsy()
  })
})

describe('编辑任务', () => {
  test('双击任务项文本，应该获得编辑状态', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true }
      ]
    })
    const todoText = wrapper.find('[data-testid="todo-text"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')

    // 双击之前确认任务项不是编辑状态
    expect(todoItem.classes('editing')).toBeFalsy()

    // 双击任务项文本
    await todoText.trigger('dblclick')

    // 双击之后，任务项应该获得编辑状态
    expect(todoItem.classes('editing')).toBeTruthy()
  })

  test('修改任务项文本敲回车之后，应该保存修改以及取消编辑状态', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true }
      ]
    })
    const todoText = wrapper.find('[data-testid="todo-text"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')

    // 双击任务项文本获得编辑状态
    await todoText.trigger('dblclick')

    // 修改任务项文本
    const text = 'hello'
    await todoEdit.setValue(text)

    // 回车保存
    await todoEdit.trigger('keyup.enter')

    // 任务项文本被修改了
    expect(todoText.text()).toBe(text)
    // 任务项的编辑状态取消了
    expect(todoItem.classes('editing')).toBeFalsy()
  })

  test('清空任务项文本，保存编辑应该删除任务项', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true }
      ]
    })
    const todoText = wrapper.find('[data-testid="todo-text"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')

    // 双击任务项文本获得编辑状态
    await todoText.trigger('dblclick')

    // 修改任务项文本
    await todoEdit.setValue('')

    // 回车保存
    await todoEdit.trigger('keyup.enter')

    // 内容被清空了，任务项应该被删除
    expect(todoItem.exists()).toBeFalsy()
  })

  test('修改任务项文本按下 ESC 后，应该取消编辑状态以及任务项文本保持不变', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true }
      ]
    })
    const todoText = wrapper.find('[data-testid="todo-text"]')
    const todoItem = wrapper.find('[data-testid="todo-item"]')
    const todoEdit = wrapper.find('[data-testid="todo-edit"]')

    // 双击任务项文本获得编辑状态
    await todoText.trigger('dblclick')

    // 修改任务项文本
    const originText = todoText.text()
    await todoEdit.setValue('hello')

    // ESC 取消
    await todoEdit.trigger('keyup.esc')

    // 取消保存，文本不变，任务项还在，并且取消编辑状态
    expect(todoItem.exists()).toBeTruthy()
    expect(todoText.text()).toBe(originText)
    expect(todoItem.classes('editing')).toBeFalsy()
  })
})

describe('删除所有已完成任务', () => {
  test('如果所有任务已完成，清除按钮应该不展示，否则展示', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: false },
        { id: 2, text: 'eat', done: false },
        { id: 3, text: 'sleep', done: false }
      ]
    })

    // const clearCompleted = wrapper.find('[data-testid="clear-completed"]')
    const todoDones = wrapper.findAll('[data-testid="todo-done"]')
    expect(wrapper.find('[data-testid="clear-completed"]').exists()).toBeFalsy()

    // 设置某个任务变为完成状态
    await todoDones.at(0).setChecked()

    // 清除按钮应该是展示状态
    expect(wrapper.find('[data-testid="clear-completed"]').exists()).toBeTruthy()
  })

  test('点击清除按钮，应该删除所有已完成任务', async () => {
    await wrapper.setData({
      todos: [
        { id: 1, text: 'play', done: true },
        { id: 2, text: 'eat', done: false },
        { id: 3, text: 'sleep', done: true }
      ]
    })
    const clearCompleted = wrapper.find('[data-testid="clear-completed"]')
    // 点击清除按钮
    await clearCompleted.trigger('click')
    // 任务列表应该只剩1个
    const todoItems = wrapper.findAll('[data-testid="todo-item"]')
    expect(todoItems.length).toBe(1)
    expect(todoItems.at(0).text()).toBe('eat')
    expect(wrapper.find('[data-testid="clear-completed"]').exists()).toBeFalsy()
  })
})
