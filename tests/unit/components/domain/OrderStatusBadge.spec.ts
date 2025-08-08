import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import OrderStatusBadge from '@/components/domain/OrderStatusBadge.vue'

describe('OrderStatusBadge', () => {
  it('renders with default status', () => {
    const wrapper = mount(OrderStatusBadge, {
      props: {
        status: 'pending'
      }
    })

    expect(wrapper.text()).toBe('待处理')
    expect(wrapper.classes()).toContain('bg-yellow-100')
    expect(wrapper.classes()).toContain('text-yellow-800')
  })

  it('renders different statuses correctly', () => {
    const statuses = [
      { status: 'pending', text: '待处理', classes: ['bg-yellow-100', 'text-yellow-800'] },
      { status: 'processing', text: '处理中', classes: ['bg-blue-100', 'text-blue-800'] },
      { status: 'shipped', text: '已发货', classes: ['bg-purple-100', 'text-purple-800'] },
      { status: 'delivered', text: '已送达', classes: ['bg-green-100', 'text-green-800'] },
      { status: 'cancelled', text: '已取消', classes: ['bg-red-100', 'text-red-800'] }
    ]

    statuses.forEach(({ status, text, classes }) => {
      const wrapper = mount(OrderStatusBadge, {
        props: { status }
      })

      expect(wrapper.text()).toBe(text)
      classes.forEach(className => {
        expect(wrapper.classes()).toContain(className)
      })
    })
  })

  it('has correct base classes', () => {
    const wrapper = mount(OrderStatusBadge, {
      props: {
        status: 'pending'
      }
    })

    expect(wrapper.classes()).toContain('inline-flex')
    expect(wrapper.classes()).toContain('items-center')
    expect(wrapper.classes()).toContain('px-2.5')
    expect(wrapper.classes()).toContain('py-0.5')
    expect(wrapper.classes()).toContain('rounded-full')
    expect(wrapper.classes()).toContain('text-xs')
    expect(wrapper.classes()).toContain('font-medium')
  })
}) 