'use client'
import type { FamilySide } from '@/types'

interface Props {
  selected: FamilySide | 'all'
  onChange: (side: FamilySide | 'all') => void
  brideLabel: string
  groomLabel: string
}

export function FamilyFilter({ selected, onChange, brideLabel, groomLabel }: Props) {
  const options: { value: FamilySide | 'all'; label: string }[] = [
    { value: 'all', label: 'Todos' },
    { value: 'bride', label: `Familia de ${brideLabel}` },
    { value: 'groom', label: `Familia de ${groomLabel}` },
  ]

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${
            selected === opt.value
              ? 'bg-rose-600 text-white border-rose-600'
              : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
