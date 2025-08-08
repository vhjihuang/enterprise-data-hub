import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFetch } from '@/composables/api/useFetch'

// Mock fetch
global.fetch = vi.fn()

describe('useFetch', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const { data, error, loading } = useFetch('/api/test')
    
    expect(data.value).toBe(null)
    expect(error.value).toBe(null)
    expect(loading.value).toBe(false)
  })

  it('should execute fetch request successfully', async () => {
    const mockResponse = { id: 1, name: 'test' }
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    })
    global.fetch = mockFetch

    const { execute, data, loading } = useFetch('/api/test')
    
    await execute()
    
    expect(loading.value).toBe(false)
    expect(data.value).toEqual(mockResponse)
    expect(mockFetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json',
      }
    })
  })

  it('should handle fetch errors', async () => {
    const mockError = new Error('Network error')
    const mockFetch = vi.fn().mockRejectedValue(mockError)
    global.fetch = mockFetch

    const { execute, error, loading } = useFetch('/api/test')
    
    await expect(execute()).rejects.toThrow('Network error')
    
    expect(loading.value).toBe(false)
    expect(error.value).toEqual(mockError)
  })

  it('should handle HTTP errors', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found'
    })
    global.fetch = mockFetch

    const { execute, error, loading } = useFetch('/api/test')
    
    await expect(execute()).rejects.toThrow('HTTP error! status: 404')
    
    expect(loading.value).toBe(false)
    expect(error.value).toBeInstanceOf(Error)
  })
}) 