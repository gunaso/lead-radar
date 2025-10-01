"use client"

import { useEffect, useRef, useState } from "react"

import { AlertCircleIcon, Check, Loader2, X } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input, type InputProps } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type AsyncValidationObjectResult = {
  ok: boolean
  message?: string
  detail?: string
  [key: string]: unknown
}

type AsyncInputProps = Omit<InputProps, "onChange"> & {
  valueState: [string, (value: string) => void]
  setValid: (valid: boolean) => void
  validate: (
    value: string,
    signal: AbortSignal
  ) => Promise<Response | AsyncValidationObjectResult>
  debounceMs?: number
  skipValidation?: boolean
}

export default function AsyncInput({
  valueState,
  setValid,
  validate,
  debounceMs = 300,
  skipValidation = false,
  ...inputProps
}: AsyncInputProps) {
  const [errorDescription, setErrorDescription] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(skipValidation)
  const [value, setValue] = valueState
  const [shouldSkipValidation, setShouldSkipValidation] =
    useState(skipValidation)
  const initialValueRef = useRef<string>(value)
  const hasInitializedRef = useRef(false)

  useEffect(() => {
    setValid(success)
  }, [success, setValid])

  // Only skip validation on initial mount, not on subsequent renders
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

  useEffect(() => {
    if (shouldSkipValidation) return

    setError(null)
    setSuccess(false)
    if (!value.trim()) {
      setLoading(false)
      setSuccess(false)
      return
    }
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
          setErrorDescription((data.detail as string | undefined) || null)
          setSuccess(false)
        } else {
          setSuccess(true)
          setError(null)
          setErrorDescription(null)

          // Attempt to detect a normalized value from the response and update upstream value.
          // Priority order: explicit `value` field, otherwise the first string field that
          // isn't one of the known meta keys.
          const metaKeys = new Set(["ok", "message", "detail"]) as Set<string>
          let nextValue: string | undefined
          if (typeof data.value === "string") {
            nextValue = data.value
          } else {
            for (const [k, v] of Object.entries(data)) {
              if (metaKeys.has(k)) continue
              if (typeof v === "string") {
                nextValue = v
                break
              }
            }
          }
          if (nextValue && nextValue !== latestValueRef.current) {
            setValue(nextValue)
          }
        }
      } catch (e) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          setError("Network error")
        }
      } finally {
        setLoading(false)
      }
    }, debounceMs)
    return () => {
      controller.abort()
      clearTimeout(t)
    }
  }, [value, debounceMs, shouldSkipValidation])

  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setError(null)
    setSuccess(false)
    setLoading(!!newValue)

    // If value changes from initial value, re-enable validation
    if (shouldSkipValidation && newValue !== initialValueRef.current) {
      setShouldSkipValidation(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        {(() => {
          const { className, ...restInputProps } = inputProps
          return (
            <Input
              {...restInputProps}
              value={value}
              onChange={inputOnChange}
              aria-invalid={!!error && !success}
              className={cn(
                "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/40",
                className
              )}
            />
          )
        })()}
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted-foreground">
          {loading && (
            <Loader2 className="size-4 animate-spin" strokeWidth={3} />
          )}
          {value && !loading && success && (
            <Check className="size-4 text-green-600" strokeWidth={3} />
          )}
          {error && !loading && !success && (
            <X className="size-4 text-destructive" strokeWidth={3} />
          )}
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircleIcon className="size-4" />
          <AlertTitle>{error}</AlertTitle>
          {errorDescription && (
            <AlertDescription>{errorDescription}</AlertDescription>
          )}
        </Alert>
      )}
    </div>
  )
}
