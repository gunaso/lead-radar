"use client"

import { WorkspaceAvatar } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  SettingsContainerElem,
  SettingsContainer,
} from "@/components/ui/settings-container"
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  Select,
} from "@/components/ui/select"

import { EMPLOYEE_RANGES } from "@/types/onboarding"

export default function WorkspacePage() {
  return (
    <section className="settings-section">
      <SettingsContainer>
        <SettingsContainerElem title="Logo" commingSoon>
          <WorkspaceAvatar logo={null} company="Acme Inc." />
        </SettingsContainerElem>
        <SettingsContainerElem
          title="Company name"
          childrenClassName="max-w-45"
        >
          <Input />
        </SettingsContainerElem>
        <SettingsContainerElem title="Website" childrenClassName="max-w-60">
          <Input />
        </SettingsContainerElem>
        <SettingsContainerElem
          title="Number of employees"
          childrenClassName="max-w-40"
        >
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_RANGES.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingsContainerElem>
      </SettingsContainer>
    </section>
  )
}
