"use client"

import { useEffect, useRef, useState } from "react"

import { Check, X } from "lucide-react"

import { Input, type InputProps } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type AsyncValidationObjectResult = {
  ok: boolean
  message?: string
  detail?: string
  value?: string
  [key: string]: unknown
}

type AsyncBareInputProps = Omit<InputProps, "onChange" | "size" | "variant"> & {
  valueState?: [string, (value: string) => void]
  setValid?: (valid: boolean) => void
  validate: (
    value: string,
    signal: AbortSignal
  ) => Promise<Response | AsyncValidationObjectResult>
  debounceMs?: number
  skipValidation?: boolean
}

export default function AsyncBareInput({
  valueState,
  setValid,
  validate,
  debounceMs = 300,
  skipValidation = false,
  className,
  ...inputProps
}: AsyncBareInputProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(skipValidation)
  const [shouldSkipValidation, setShouldSkipValidation] =
    useState(skipValidation)
  const [loading, setLoading] = useState(false)
  // Support internal state when valueState isn't provided (uncontrolled usage)
  const [internalValue, setInternalValue] = useState("")
  const [value, setValue] = (valueState ?? [
    internalValue,
    setInternalValue,
  ]) as [string, (value: string) => void]

  const hasInitializedRef = useRef(false)
  const initialValueRef = useRef<string>(value)

  useEffect(() => {
    if (setValid) {
      setValid(success)
    }
  }, [success, setValid])

  useEffect(() => {
    if (!hasInitializedRef.current && skipValidation && value.trim()) {
      setSuccess(true)
      setError(null)
      setLoading(false)
      setShouldSkipValidation(true)
      initialValueRef.current = value
      hasInitializedRef.current = true
    }
  }, [skipValidation, value])

  const latestValueRef = useRef<string>(value)
  latestValueRef.current = value
  const latestValidateRef = useRef(validate)

  useEffect(() => {
    latestValidateRef.current = validate
  }, [validate])

  const suppressNextValidationRef = useRef<boolean>(false)

  useEffect(() => {
    if (shouldSkipValidation) return
    if (suppressNextValidationRef.current) {
      suppressNextValidationRef.current = false
      setLoading(false)
      setSuccess(true)
      setError(null)
      return
    }

    setError(null)
    setSuccess(false)
    if (!value.trim()) {
      setLoading(false)
      setSuccess(false)
      return
    }
    setLoading(true)
    const controller = new AbortController()
    const t = setTimeout(async () => {
      try {
        const result = await latestValidateRef.current(
          value.trim(),
          controller.signal
        )

        let data: AsyncValidationObjectResult
        if (result instanceof Response) {
          try {
            data = (await result.json()) as AsyncValidationObjectResult
          } catch {
            data = { ok: false, message: "Invalid server response" }
          }
        } else {
          data = result as AsyncValidationObjectResult
        }

        if (!data.ok) {
          setError(data.message || "Validation failed")
          setSuccess(false)
        } else {
          setSuccess(true)
          setError(null)
          const maybeNext =
            typeof data.value === "string"
              ? data.value
              : Object.entries(data).find(
                  ([k, v]) =>
                    !["ok", "message", "detail"].includes(k) &&
                    typeof v === "string"
                )?.[1]
          if (
            typeof maybeNext === "string" &&
            maybeNext !== latestValueRef.current
          ) {
            suppressNextValidationRef.current = true
            setValue(maybeNext)
          }
        }
      } catch (e: any) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          const message =
            (e && typeof e.message === "string" && e.message) || "Network error"
          setError(message)
        }
      } finally {
        setLoading(false)
      }
    }, debounceMs)
    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [value, debounceMs, shouldSkipValidation, setValue])

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setError(null)
    setSuccess(false)
    setLoading(!!newValue)
    if (shouldSkipValidation && newValue !== initialValueRef.current) {
      setShouldSkipValidation(false)
    }
  }

  return (
    <div className="relative">
      <Input
        {...inputProps}
        type="text"
        value={value}
        size="creating"
        variant="creating"
        onChange={inputOnChange}
        onInput={inputOnChange}
        autoComplete="off"
        aria-invalid={!!error && !success}
        className={cn(
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/40",
          className
        )}
      />
      <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
        {loading && <Spinner className="size-4" />}
        {value && !loading && success && (
          <Check className="size-4 text-green-600" strokeWidth={3} />
        )}
        {error && !loading && !success && (
          <X className="size-4 text-destructive" strokeWidth={3} />
        )}
      </div>
    </div>
  )
}
