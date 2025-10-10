"use client"
import { useEffect, useState, type ReactElement } from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type PersonalStepProps = {
  value: {
    name: string
    role: string
  }
  onChange: (next: { name: string; role: string }) => void
  onValidationChange: (validation: {
    nameValid: boolean
    roleValid: boolean
  }) => void
}

const COMPANY_ROLES = [
  "Founder / CEO",
  "Co-Founder",
  "Product Manager",
  "Marketing Manager",
  "Growth Manager",
  "Community Manager",
  "Developer",
  "Designer",
  "Sales",
  "Customer Success",
  "Other",
]

export default function PersonalStep({
  value,
  onChange,
  onValidationChange,
}: PersonalStepProps): ReactElement {
  const [name, setName] = useState(value.name)
  const [role, setRole] = useState(value.role)

  // Validate name (at least 2 characters)
  const nameValid = name.trim().length >= 2
  // Validate role (must be selected)
  const roleValid = role !== ""

  // Bubble up state
  useEffect(() => {
    onChange({ name, role })
  }, [name, role, onChange])

  // Bubble up validation state
  useEffect(() => {
    onValidationChange({ nameValid, roleValid })
  }, [nameValid, roleValid, onValidationChange])

  return (
    <section className="space-y-4">
      <div>
        <Label htmlFor="full-name">Full name</Label>
        <Input
          id="full-name"
          type="text"
          placeholder="e.g. John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="role">Role at company</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger
            id="role"
            className="mt-1 w-full border-1 border-border"
          >
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  )
}
