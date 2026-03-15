import { render, screen } from '@testing-library/react'
import { PersonCard } from '../PersonCard'
import type { Person } from '@/types'

const person: Person = {
  id: '1', name: 'Ana García', nickname: 'Anita',
  photo_url: null, family_side: 'bride', bio: null, created_at: ''
}

describe('PersonCard', () => {
  it('renders person name', () => {
    render(<PersonCard person={person} />)
    expect(screen.getByText('Ana García')).toBeInTheDocument()
  })

  it('renders nickname when present', () => {
    render(<PersonCard person={person} />)
    expect(screen.getByText('"Anita"')).toBeInTheDocument()
  })

  it('renders placeholder when no photo', () => {
    render(<PersonCard person={person} />)
    // User icon rendered when no photo_url
    expect(screen.queryByRole('img')).toBeNull()
  })
})
