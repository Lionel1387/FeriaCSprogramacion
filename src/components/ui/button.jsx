import React from 'react'

export default function Button({ children, className = '', variant, size, ...rest }) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2'
  const v = variant === 'outline' ? 'border' : ''
  const s = size === 'lg' ? 'text-lg py-3' : ''
  return (
    <button className={`${base} ${v} ${s} ${className}`} {...rest}>
      {children}
    </button>
  )
}
