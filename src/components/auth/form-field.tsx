import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  id: string
  name: string
  type: string
  label: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  labelClassName?: string
  extraContent?: React.ReactNode
}

/**
 * Reusable form field component that combines Label, Input, and error display
 * Used across authentication forms to maintain consistency and reduce code duplication
 */
export function FormField({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  onKeyDown,
  error,
  required = false,
  labelClassName,
  extraContent,
}: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor={id} className={labelClassName}>
          {label}
        </Label>
        {extraContent}
      </div>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
