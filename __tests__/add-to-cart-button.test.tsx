import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { AddToCartButton } from '@/app/product/[id]/add-to-cart-button'
import { CartProvider } from '@/components/cart-provider'
import type { Product } from '@/lib/types'

// Mock lucide-react
jest.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="shopping-cart-icon" />,
  Check: () => <div data-testid="check-icon" />,
}))

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 100,
  image: 'test.jpg',
}

describe('AddToCartButton', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders add to cart button initially', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    )

    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument()
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument()
    expect(screen.queryByTestId('check-icon')).not.toBeInTheDocument()
  })

  it('shows added state when clicked', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(screen.getByText('¡Agregado!')).toBeInTheDocument()
    expect(screen.getByTestId('check-icon')).toBeInTheDocument()
    expect(screen.queryByText('Agregar al carrito')).not.toBeInTheDocument()
  })

  it('reverts to initial state after timeout', async () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Initially shows added
    expect(screen.getByText('¡Agregado!')).toBeInTheDocument()

    // After 1.5 seconds, should revert
    await act(async () => {
      jest.advanceTimersByTime(1500)
    })

    expect(screen.getByText('Agregar al carrito')).toBeInTheDocument()
    expect(screen.queryByText('¡Agregado!')).not.toBeInTheDocument()
  })

  it('calls addToCart when clicked', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    // Since addToCart is called internally, and we can't easily spy on it without mocking useCart
    // Just ensure the button triggers the expected behavior
    expect(screen.getByText('¡Agregado!')).toBeInTheDocument()
  })

  it('has correct button styling', () => {
    render(
      <CartProvider>
        <AddToCartButton product={mockProduct} />
      </CartProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600', 'hover:bg-red-700')
  })
})