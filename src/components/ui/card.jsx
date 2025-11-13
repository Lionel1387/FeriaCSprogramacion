import React from 'react'

export default function Card({ children, className = '', ...rest }) {
  return (
    <div className={`bg-card text-card-foreground rounded-lg shadow-sm ${className}`} {...rest}>
      {children}
    </div>
  )
}
