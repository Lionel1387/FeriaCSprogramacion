import React, { forwardRef } from 'react'

const Input = forwardRef(({ className = '', ...props }, ref) => {
  return <input ref={ref} className={`rounded-md border px-3 py-2 ${className}`} {...props} />
})

export default Input
