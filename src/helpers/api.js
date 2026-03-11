export const api = async (path, options = {}) => {
  const token = localStorage.getItem('token')
  let res
  try {
    res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    })
  } catch {
    throw new Error('Unable to connect to server')
  }
  let data
  try {
    data = await res.json()
  } catch {
    throw new Error(res.ok ? 'Invalid response from server' : `Server error (${res.status})`)
  }
  if (!res.ok) throw new Error(data.error || Object.values(data.errors || {})[0]?.[0] || 'Request failed')
  return data
}
