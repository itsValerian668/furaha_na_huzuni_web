import { useState } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { Modal } from '@/components/ui/Modal'

function EditableModal() {
  const [value, setValue] = useState('')
  const [open, setOpen] = useState(true)

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="Edit details"
    >
      <input
        aria-label="Expense description"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    </Modal>
  )
}

describe('Modal', () => {
  it('keeps focus in an input while its value updates', async () => {
    const user = userEvent.setup()
    render(<EditableModal />)

    const input = screen.getByRole('textbox', {
      name: 'Expense description',
    })
    await user.click(input)
    await user.type(input, 'Venue hire')

    expect(input).toHaveValue('Venue hire')
    expect(input).toHaveFocus()
  })

  it('supports a dialog label without rendering a visible title', () => {
    render(
      <Modal
        open
        onClose={() => {}}
        dialogLabel="Record expense form"
      >
        <p>Expense details</p>
      </Modal>,
    )

    expect(
      screen.getByRole('dialog', { name: 'Record expense form' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
})
