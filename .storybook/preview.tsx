import type { Preview } from '@storybook/nextjs'
import { Fragment } from 'react'
import { Toaster } from 'sonner'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Fragment>
        <Story />
        <Toaster position="top-center" richColors />
      </Fragment>
    ),
  ],
}

export default preview
