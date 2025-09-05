import type { Meta, StoryObj } from '@storybook/react-vite'
import { UseNonLocalGeneralStateTest } from './UseNonLocalGeneralStateTest'

const meta = {
  title: 'Vaultrice/UseNonLocalGeneralState',
  component: UseNonLocalGeneralStateTest,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    dataType: {
      control: 'select',
      options: ['string', 'number', 'object', 'array'],
      description: 'Type of data to demonstrate'
    }
  },
  args: {
    dataType: 'object'
  },
} satisfies Meta<typeof UseNonLocalGeneralStateTest>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const ObjectOperations: Story = {
  args: {
    dataType: 'object'
  }
}

export const ArrayOperations: Story = {
  args: {
    dataType: 'array'
  }
}

export const StringOperations: Story = {
  args: {
    dataType: 'string'
  }
}

export const NumberOperations: Story = {
  args: {
    dataType: 'number'
  }
}
