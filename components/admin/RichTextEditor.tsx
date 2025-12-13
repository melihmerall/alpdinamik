"use client"
import { ChangeEvent } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = 'İçerik girin...' }: RichTextEditorProps) {
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
  }

  return (
    <div style={{ 
      width: '100%',
      marginBottom: '1rem'
    }}>
      <textarea
        value={value || ''}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          minHeight: '400px',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontSize: '1rem',
          fontFamily: 'inherit',
          resize: 'vertical',
          lineHeight: '1.6',
        }}
      />
    </div>
  )
}
