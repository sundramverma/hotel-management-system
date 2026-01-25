import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App Component', () => {
  test('renders navbar brand name', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    // Navbar brand text
    const brandElement = screen.getByText(/AASIYANA/i)
    expect(brandElement).toBeInTheDocument()
  })

  test('renders landing page text', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )

    const landingText = screen.getByText(/There is only one boss/i)
    expect(landingText).toBeInTheDocument()
  })
})
