import type { Meta, StoryObj } from '@storybook/react-vite'
import { UseNonLocalObjectTest } from './UseNonLocalObjectTest'

const meta = {
  title: 'Vaultrice/UseNonLocalObject',
  component: UseNonLocalObjectTest,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    initialData: {
      control: 'object',
      description: 'Initial object data'
    }
  },
  args: {
    initialData: {
      name: 'John Doe',
      email: 'john@example.com',
      preferences: {
        theme: 'dark',
        notifications: true
      }
    }
  },
} satisfies Meta<typeof UseNonLocalObjectTest>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const UserProfile: Story = {
  args: {
    initialData: {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      preferences: {
        theme: 'dark',
        notifications: true,
        language: 'en'
      }
    }
  }
}

export const Settings: Story = {
  args: {
    initialData: {
      theme: 'light',
      language: 'en',
      notifications: {
        email: true,
        push: false,
        sms: false
      },
      privacy: {
        publicProfile: true,
        showEmail: false
      }
    }
  }
}

export const EmptyObject: Story = {
  args: {
    initialData: {}
  }
}

export const NestedObject: Story = {
  args: {
    initialData: {
      user: {
        profile: {
          name: 'Alice',
          avatar: 'avatar.jpg'
        },
        settings: {
          theme: 'auto',
          notifications: {
            email: true,
            push: true
          }
        }
      },
      app: {
        version: '1.0.0',
        features: ['feature1', 'feature2']
      }
    }
  }
}
