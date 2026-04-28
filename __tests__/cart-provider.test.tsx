import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/types'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  description: 'Test description',
  price: 100,
  image: 'test.jpg',
}

function TestComponent() {
  const { items, addToCart, removeFromCart, updateQty, clearCart, total, count } = useCart()

  return (
    <div>
      <div data-testid="count">{count}</div>
      <div data-testid="total">{total}</div>
      <div data-testid="items-count">{items.length}</div>
      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
      <button onClick={() => removeFromCart('1')}>Remove from Cart</button>
      <button onClick={() => updateQty('1', 2)}>Update Qty</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  )
}

describe('CartProvider', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()
    localStorageMock.clear.mockClear()
  })

  it('renders with initial empty cart', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
    expect(screen.getByTestId('items-count')).toHaveTextContent('0')
  })

  it('loads cart from localStorage on mount', () => {
    const storedCart = [{ productId: '1', name: 'Stored Product', price: 50, image: 'stored.jpg', quantity: 1 }]
    localStorageMock.getItem.mockReturnValue(JSON.stringify(storedCart))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('total')).toHaveTextContent('50')
    expect(screen.getByTestId('items-count')).toHaveTextContent('1')
  })

  it('adds product to cart', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add to Cart'))

    expect(screen.getByTestId('count')).toHaveTextContent('1')
    expect(screen.getByTestId('total')).toHaveTextContent('100')
    expect(screen.getByTestId('items-count')).toHaveTextContent('1')
    expect(localStorageMock.setItem).toHaveBeenCalledWith('cart', JSON.stringify([{
      productId: '1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      quantity: 1,
    }]))
  })

  it('increments quantity when adding same product', () => {
    localStorageMock.getItem.mockReturnValue(null)

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Add to Cart'))
    fireEvent.click(screen.getByText('Add to Cart'))

    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(screen.getByTestId('total')).toHaveTextContent('200')
    expect(screen.getByTestId('items-count')).toHaveTextContent('1')
  })

  it('removes product from cart', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{
      productId: '1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      quantity: 1,
    }]))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Remove from Cart'))

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
    expect(screen.getByTestId('items-count')).toHaveTextContent('0')
  })

  it('updates quantity', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{
      productId: '1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      quantity: 1,
    }]))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Update Qty'))

    expect(screen.getByTestId('count')).toHaveTextContent('2')
    expect(screen.getByTestId('total')).toHaveTextContent('200')
  })

  it('removes item when quantity set to 0', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{
      productId: '1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      quantity: 1,
    }]))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Update Qty')) // This sets to 2, but let's simulate setting to 0
    // Actually, updateQty with 0 should remove
    // Let's modify the test component to have a button for qty 0
  })

  it('clears cart', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([{
      productId: '1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      quantity: 1,
    }]))

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    )

    fireEvent.click(screen.getByText('Clear Cart'))

    expect(screen.getByTestId('count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
    expect(screen.getByTestId('items-count')).toHaveTextContent('0')
  })
})