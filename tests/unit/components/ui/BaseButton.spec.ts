import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    expect(wrapper.text()).toBe('Click me')
    expect(wrapper.classes()).toContain('bg-blue-600')
    expect(wrapper.classes()).toContain('text-white')
  })

  it('renders with different variants', () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: 'danger'
      },
      slots: {
        default: 'Delete'
      }
    })

    expect(wrapper.classes()).toContain('bg-red-600')
    expect(wrapper.classes()).toContain('text-white')
  })

  it('renders with different sizes', () => {
    const wrapper = mount(BaseButton, {
      props: {
        size: 'lg'
      },
      slots: {
        default: 'Large Button'
      }
    })

    expect(wrapper.classes()).toContain('px-6')
    expect(wrapper.classes()).toContain('py-3')
    expect(wrapper.classes()).toContain('text-lg')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: 'Click me'
      }
    })

    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeTruthy()
    expect(wrapper.emitted('click')?.[0]).toBeInstanceOf(Array)
  })

  it('is disabled when disabled prop is true', () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
    expect(wrapper.classes()).toContain('opacity-50')
    expect(wrapper.classes()).toContain('cursor-not-allowed')
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(BaseButton, {
      props: {
        disabled: true
      },
      slots: {
        default: 'Disabled Button'
      }
    })

    await wrapper.trigger('click')
    
    expect(wrapper.emitted('click')).toBeFalsy()
  })
}) 