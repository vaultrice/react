import type { Meta, StoryObj } from '@storybook/react-vite'
import { UseNonLocalArrayTest } from './UseNonLocalArrayTest'

const meta = {
  title: 'Vaultrice/UseNonLocalArray',
  component: UseNonLocalArrayTest,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    initialItems: {
      control: 'object',
      description: 'Initial array items to populate the storage'
    }
  },
  args: {
    initialItems: ['Task 1', 'Task 2', 'Task 3']
  },
} satisfies Meta<typeof UseNonLocalArrayTest>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const TodoList: Story = {
  args: {
    initialItems: ['Buy groceries', 'Walk the dog', 'Finish project']
  }
}

export const NumberArray: Story = {
  args: {
    initialItems: [1, 2, 3, 4, 5]
  }
}

export const EmptyArray: Story = {
  args: {
    initialItems: []
  }
}

export const StringArray: Story = {
  args: {
    initialItems: ['apple', 'banana', 'cherry', 'date']
  }
}
