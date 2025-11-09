import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import StatusBadge from '../StatusBadge.vue'

describe('StatusBadge.vue', () => {
  it('renders correctly for "enabled" status', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'enabled' },
    })
    expect(wrapper.text()).toBe('Enabled')
    expect(wrapper.classes()).toContain('bg-green-100')
    expect(wrapper.find('span > span').classes()).toContain('bg-green-600')
  })

  it('renders correctly for "pending" status', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'pending' },
    })
    expect(wrapper.text()).toBe('Pending')
    expect(wrapper.classes()).toContain('bg-yellow-100')
    expect(wrapper.find('span > span').classes()).toContain('bg-yellow-600')
  })

  it('renders correctly for "disabled" status', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'disabled' },
    })
    expect(wrapper.text()).toBe('Disabled')
    expect(wrapper.classes()).toContain('bg-red-100')
    expect(wrapper.find('span > span').classes()).toContain('bg-red-600')
  })

  it('renders correctly for an unknown status', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'unknown' },
    })
    expect(wrapper.text()).toBe('Unknown')
    expect(wrapper.classes()).toContain('bg-gray-100')
    expect(wrapper.find('span > span').classes()).toContain('bg-gray-600')
  })

  it('capitalizes the display text correctly', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'filled' },
    })
    expect(wrapper.text()).toBe('Filled')
  })
})
