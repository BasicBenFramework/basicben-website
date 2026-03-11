export function Alert({ type = 'error', children }) {
  const styles = {
    error: 'text-red-500 bg-red-500/10',
    success: 'text-emerald-500 bg-emerald-500/10'
  }
  return (
    <p className={`text-xs p-2 rounded-lg ${styles[type]}`}>
      {children}
    </p>
  )
}
