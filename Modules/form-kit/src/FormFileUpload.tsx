import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  alpha,
  useTheme,
  type FormControlProps,
} from '@mui/material'
import { useRef, useState, type DragEvent } from 'react'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps } from './types'

export type FormFileUploadProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  disabled?: boolean
  multiple?: boolean
  accept?: string
  buttonLabel?: string
  emptyLabel?: string
  /** Hint shown inside the drop zone. */
  dropLabel?: string
  /** When false, only the button is shown (no drag-and-drop zone). Default true. */
  enableDrop?: boolean
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
}

function toFileList(value: unknown, multiple: boolean): File[] {
  if (multiple) {
    if (Array.isArray(value)) {
      return value.filter((item): item is File => item instanceof File)
    }
    return []
  }

  if (value instanceof File) {
    return [value]
  }

  return []
}

function parseAccept(accept?: string): string[] {
  if (!accept) {
    return []
  }

  return accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
}

function fileMatchesAccept(file: File, acceptTokens: string[]): boolean {
  if (acceptTokens.length === 0) {
    return true
  }

  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()

  return acceptTokens.some((token) => {
    if (token.startsWith('.')) {
      return name.endsWith(token)
    }

    if (token.endsWith('/*')) {
      const prefix = token.slice(0, -1)
      return type.startsWith(prefix)
    }

    return type === token
  })
}

function filterFiles(files: File[], accept?: string): File[] {
  const tokens = parseAccept(accept)
  return files.filter((file) => fileMatchesAccept(file, tokens))
}

function mergeFiles(existing: File[], incoming: File[], multiple: boolean): File | File[] | null {
  if (!multiple) {
    return incoming[0] ?? null
  }

  const map = new Map<string, File>()
  for (const file of [...existing, ...incoming]) {
    map.set(`${file.name}:${file.size}:${file.lastModified}`, file)
  }
  return Array.from(map.values())
}

export function FormFileUpload<T extends FieldValues>({
  name,
  label,
  disabled,
  multiple = false,
  accept,
  buttonLabel = 'Choose file',
  emptyLabel = 'No file selected',
  dropLabel = 'Drag & drop files here, or click to browse',
  enableDrop = true,
  formControlProps,
}: FormFileUploadProps<T>) {
  const theme = useTheme()
  const { control } = useFormContext<T>()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const dragDepth = useRef(0)

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const files = toFileList(field.value, multiple)

        const applyFiles = (list: FileList | File[] | null | undefined) => {
          const incoming = filterFiles(Array.from(list ?? []), accept)
          if (incoming.length === 0) {
            return
          }

          field.onChange(mergeFiles(files, incoming, multiple))
          field.onBlur()
        }

        const clearInput = () => {
          if (inputRef.current) {
            inputRef.current.value = ''
          }
        }

        const onDragEnter = (event: DragEvent) => {
          event.preventDefault()
          event.stopPropagation()
          if (disabled) {
            return
          }
          dragDepth.current += 1
          setDragging(true)
        }

        const onDragOver = (event: DragEvent) => {
          event.preventDefault()
          event.stopPropagation()
          if (disabled) {
            return
          }
          event.dataTransfer.dropEffect = 'copy'
        }

        const onDragLeave = (event: DragEvent) => {
          event.preventDefault()
          event.stopPropagation()
          dragDepth.current = Math.max(0, dragDepth.current - 1)
          if (dragDepth.current === 0) {
            setDragging(false)
          }
        }

        const onDrop = (event: DragEvent) => {
          event.preventDefault()
          event.stopPropagation()
          dragDepth.current = 0
          setDragging(false)
          if (disabled) {
            return
          }
          applyFiles(event.dataTransfer.files)
        }

        const dropzoneSx = {
          border: '1px dashed',
          borderColor: dragging
            ? 'primary.main'
            : fieldState.error
              ? 'error.main'
              : 'divider',
          bgcolor: dragging
            ? alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.16 : 0.06)
            : alpha(theme.palette.text.primary, theme.palette.mode === 'dark' ? 0.04 : 0.02),
          borderRadius: 2,
          px: 2,
          py: 2.5,
          textAlign: 'center' as const,
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: theme.transitions.create(['border-color', 'background-color'], {
            duration: theme.transitions.duration.shorter,
          }),
          outline: dragging ? `2px solid ${alpha(theme.palette.primary.main, 0.35)}` : 'none',
          outlineOffset: 2,
        }

        return (
          <FormControl
            {...formControlProps}
            fullWidth
            error={Boolean(fieldState.error)}
            disabled={disabled}
          >
            {label && <FormLabel>{label}</FormLabel>}
            <Stack spacing={1} sx={{ mt: label ? 1 : 0 }}>
              <input
                ref={(node) => {
                  inputRef.current = node
                  field.ref(node)
                }}
                type="file"
                name={field.name}
                accept={accept}
                multiple={multiple}
                hidden
                disabled={disabled}
                onBlur={field.onBlur}
                onChange={(event) => {
                  applyFiles(event.target.files)
                  // Allow re-selecting the same file path later.
                  clearInput()
                }}
              />

              {enableDrop ? (
                <Box
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={dropLabel}
                  onKeyDown={(event) => {
                    if (disabled) {
                      return
                    }
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      inputRef.current?.click()
                    }
                  }}
                  onClick={() => {
                    if (!disabled) {
                      inputRef.current?.click()
                    }
                  }}
                  onDragEnter={onDragEnter}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  sx={dropzoneSx}
                >
                  <Stack spacing={1} sx={{ alignItems: 'center' }}>
                    <CloudUploadOutlinedIcon
                      color={dragging ? 'primary' : 'action'}
                      sx={{ fontSize: 36 }}
                    />
                    <Typography variant="body2" color={dragging ? 'primary' : 'text.secondary'}>
                      {dropLabel}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<UploadFileOutlinedIcon />}
                      disabled={disabled}
                      onClick={(event) => {
                        event.stopPropagation()
                        inputRef.current?.click()
                      }}
                    >
                      {buttonLabel}
                    </Button>
                  </Stack>
                </Box>
              ) : (
                <Box>
                  <Button
                    variant="outlined"
                    startIcon={<UploadFileOutlinedIcon />}
                    disabled={disabled}
                    onClick={() => inputRef.current?.click()}
                  >
                    {buttonLabel}
                  </Button>
                </Box>
              )}

              {files.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  {emptyLabel}
                </Typography>
              ) : (
                <List dense disablePadding>
                  {files.map((file, index) => (
                    <ListItem
                      key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="remove"
                          disabled={disabled}
                          onClick={() => {
                            if (!multiple) {
                              field.onChange(null)
                              clearInput()
                              return
                            }

                            const next = files.filter((_, i) => i !== index)
                            field.onChange(next)
                          }}
                        >
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        </IconButton>
                      }
                      sx={{ px: 0 }}
                    >
                      <ListItemText
                        primary={file.name}
                        secondary={`${Math.max(1, Math.round(file.size / 1024))} KB`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Stack>
            {fieldState.error?.message && (
              <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
            )}
          </FormControl>
        )
      }}
    />
  )
}
