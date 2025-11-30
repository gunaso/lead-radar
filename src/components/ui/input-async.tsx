"use client"

import { useEffect, useRef, useState } from "react"

import { AlertCircleIcon, Check, X } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input, type InputProps } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"

import { cn, generateInputId } from "@/lib/utils"

type AsyncValidationObjectResult = {
  ok: boolean
  message?: string
  detail?: string
  [key: string]: unknown
}

type AsyncInputProps = Omit<InputProps, "onChange"> & {
  label: string
  valueState: [string, (value: string) => void]
  setValid: (valid: boolean) => void
  validate: (
    value: string,
    signal: AbortSignal
  ) => Promise<Response | AsyncValidationObjectResult>
  debounceMs?: number
  skipValidation?: boolean
  helperText?: string
}

export default function AsyncInput({
  label,
  valueState,
  setValid,
  validate,
  debounceMs = 300,
  skipValidation = false,
  helperText,
  ...inputProps
}: AsyncInputProps) {
  const [errorDescription, setErrorDescription] = useState<string | null>(null)
  const [inputId, setInputId] = useState<string>(generateInputId(label))
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(skipValidation)
  const [shouldSkipValidation, setShouldSkipValidation] =
    useState(skipValidation)
  const [loading, setLoading] = useState(false)
  const hasInitializedRef = useRef(false)
  const [value, setValue] = valueState

  const initialValueRef = useRef<string>(value)

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

  // When the server returns a normalized value (e.g., adds https://) we update the input value.
  // That local update would normally trigger a second validation call immediately.
  // Use this flag to suppress the very next validation pass since we already know it's valid.
  const suppressNextValidationRef = useRef<boolean>(false)

  useEffect(() => {
    if (shouldSkipValidation) return

    // If last change came from server-side normalization on a successful validation,
    // skip this immediate validation cycle to avoid a duplicate request.
    if (suppressNextValidationRef.current) {
      suppressNextValidationRef.current = false
      setLoading(false)
      setSuccess(true)
      setError(null)
      setErrorDescription(null)
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
            suppressNextValidationRef.current = true
            setValue(nextValue)
          }
        }
      } catch (e: any) {
        if (!(e instanceof DOMException && e.name === "AbortError")) {
          const message =
            (e && typeof e.message === "string" && e.message) || "Network error"
          setError(message)
          // Try to surface server-provided detail if available
          const maybeData = e?.data as unknown
          if (
            maybeData &&
            typeof maybeData === "object" &&
            typeof (maybeData as any).detail === "string"
          ) {
            setErrorDescription((maybeData as any).detail as string)
          }
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

  useEffect(() => {
    setInputId(generateInputId(label))
  }, [label])

  return (
    <div className="flex flex-col gap-1">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={inputId}>{label}</Label>
        <div className="flex flex-col gap-2">
          <div className="relative">
            {(() => {
              const { className, ...restInputProps } = inputProps
              return (
                <Input
                  id={inputId}
                  {...restInputProps}
                  value={value}
                  size="onboarding"
                  variant="onboarding"
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
                <Spinner className="size-4" />
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
      </div>
      <span className="text-xs text-muted-foreground pl-1">{helperText}</span>
    </div>
  )
}
