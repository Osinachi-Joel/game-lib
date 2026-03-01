import React from "react"

export function GhostIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      stroke="currentColor" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="0.5" 
      viewBox="0 0 24 24"
    >
      <path d="M6 12h.01M9 12h.01M15 12h.01M18 12h.01"></path>
      <path d="M21 12c0-3.3-2.7-6-6-6H9c-3.3 0-6 2.7-6 6 0 1.2.4 2.3 1 3.2C3.4 16.5 3 17.7 3 19c0 1.1.9 2 2 2 1.3 0 2.5-.4 3.4-1 1.1.6 2.4 1 3.6 1s2.5-.4 3.6-1c.9.6 2.1 1 3.4 1 1.1 0 2-.9 2-2 0-1.3-.4-2.5-1-3.8.6-.9 1-2 1-3.2z"></path>
      <circle cx="15.5" cy="11.5" fill="currentColor" r=".5"></circle>
      <circle cx="17.5" cy="13.5" fill="currentColor" r=".5"></circle>
      <path d="M7 11v4M5 13h4"></path>
    </svg>
  )
}
