import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Paper,
  Popover,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  type FormControlProps,
} from '@mui/material'
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps, FormOption } from './types'
import { normalizeTextValue } from './valueNormalization'

export type FormRichTextProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  disabled?: boolean
  placeholder?: string
  /** Mention suggestions triggered by typing `@`. Inserted as data-mention spans. */
  mentionOptions?: FormOption[]
  minHeight?: number
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
}

type MentionState = {
  query: string
  range: Range
  anchorEl: HTMLElement
} | null

function exec(command: string, value?: string) {
  document.execCommand(command, false, value)
}

/**
 * Minimal, dependency-free HTML sanitizer tailored to this editor.
 *
 * Threat model: the field value can be prefilled from an untrusted source
 * (server response, URL params, another user's saved draft). Writing that
 * value into a contentEditable via `innerHTML` would execute payloads like
 * `<img src=x onerror=...>` or `<script>` on load. We defuse this by:
 *   1. Restricting tags to a small allowlist compatible with the editor's
 *      output (basic formatting, lists, links, and our mention spans).
 *   2. Stripping every `on*` event handler and any URL attribute whose value
 *      starts with `javascript:` (case- and whitespace-insensitive).
 *   3. Dropping non-allowlisted elements entirely (script/iframe/object/embed/
 *      style/link/meta/form/img/svg — everything that can execute or exfiltrate).
 *
 * This is defense-in-depth; servers must still sanitize on write.
 */
const RICH_TEXT_ALLOWED_TAGS = new Set([
  'A', 'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE',
  'BR', 'P', 'DIV', 'SPAN',
  'UL', 'OL', 'LI',
])
const RICH_TEXT_ALLOWED_ATTRS = new Set([
  'href', 'title', 'contenteditable', 'style', 'target', 'rel',
])
const RICH_TEXT_URL_ATTRS = new Set(['href', 'src', 'xlink:href'])
const JAVASCRIPT_URL = /^\s*javascript:/i

function sanitizeElement(el: Element): void {
  for (const attr of Array.from(el.attributes)) {
    const name = attr.name.toLowerCase()
    const isData = name.startsWith('data-')
    const isAria = name.startsWith('aria-')
    // `on*` handlers, or anything not in the allowlist / data-* / aria-* → drop.
    if (name.startsWith('on') || (!isData && !isAria && !RICH_TEXT_ALLOWED_ATTRS.has(name))) {
      el.removeAttribute(attr.name)
      continue
    }
    if (RICH_TEXT_URL_ATTRS.has(name) && JAVASCRIPT_URL.test(attr.value)) {
      el.removeAttribute(attr.name)
    }
  }
}

function sanitizeRichTextHtml(html: string): string {
  if (!html || typeof document === 'undefined') {
    return ''
  }

  const template = document.createElement('template')
  template.innerHTML = html

  // Iterative walk — snapshot first because we mutate the tree.
  const elements = Array.from(template.content.querySelectorAll('*'))
  for (const el of elements) {
    if (!RICH_TEXT_ALLOWED_TAGS.has(el.tagName)) {
      el.remove()
      continue
    }
    sanitizeElement(el)
  }

  return template.innerHTML
}

function RichTextEditor({
  value,
  disabled,
  placeholder,
  mentionOptions = [],
  minHeight = 140,
  onChange,
  onBlur,
  name,
  inputRef,
}: {
  value: string
  disabled?: boolean
  placeholder?: string
  mentionOptions?: FormOption[]
  minHeight?: number
  onChange: (html: string) => void
  onBlur: () => void
  name: string
  inputRef: (node: HTMLDivElement | null) => void
}) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [mention, setMention] = useState<MentionState>(null)

  useEffect(() => {
    const node = editorRef.current
    if (!node) {
      return
    }

    if (document.activeElement === node) {
      return
    }

    // Sanitize BEFORE writing to innerHTML — this is the primary XSS defense
    // for values that arrived from untrusted sources (server, URL params, etc).
    const next = sanitizeRichTextHtml(value || '')
    if (node.innerHTML !== next) {
      node.innerHTML = next
    }
  }, [value])

  const emitChange = () => {
    const raw = editorRef.current?.innerHTML ?? ''
    // Also sanitize on write so downstream consumers (RHF state, submit
    // handlers, network payloads) never see unsafe markup. This catches
    // pasted HTML and any execCommand edge cases.
    const html = sanitizeRichTextHtml(raw)
    onChange(html === '<br>' ? '' : html)
  }

  const detectMention = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0 || !editorRef.current) {
      setMention(null)
      return
    }

    const range = selection.getRangeAt(0)
    if (!editorRef.current.contains(range.startContainer)) {
      setMention(null)
      return
    }

    const prefixRange = range.cloneRange()
    prefixRange.selectNodeContents(editorRef.current)
    prefixRange.setEnd(range.endContainer, range.endOffset)
    const textBefore = prefixRange.toString()
    const match = textBefore.match(/@([^\s@]*)$/)

    if (!match) {
      setMention(null)
      return
    }

    setMention({
      query: match[1] ?? '',
      range: range.cloneRange(),
      anchorEl: editorRef.current,
    })
  }

  const insertMention = (option: FormOption) => {
    if (!mention) {
      return
    }

    const selection = window.getSelection()
    if (!selection) {
      return
    }

    const range = mention.range
    const queryLength = mention.query.length + 1
    range.setStart(range.endContainer, Math.max(0, range.endOffset - queryLength))
    range.deleteContents()

    const mentionNode = document.createElement('span')
    mentionNode.dataset.mention = String(option.value)
    mentionNode.contentEditable = 'false'
    mentionNode.style.color = 'var(--mui-palette-primary-main, #1976d2)'
    mentionNode.style.fontWeight = '600'
    mentionNode.textContent = `@${option.label}`

    range.insertNode(mentionNode)
    range.setStartAfter(mentionNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)

    setMention(null)
    emitChange()
    editorRef.current?.focus()
  }

  const filteredMentions = mention
    ? mentionOptions.filter((option) =>
        option.label.toLowerCase().includes(mention.query.toLowerCase()),
      )
    : []

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      <ToggleButtonGroup size="small" exclusive={false} sx={{ px: 1, py: 0.75, gap: 0.5 }}>
        <ToggleButton
          value="bold"
          disabled={disabled}
          onMouseDown={(event) => {
            event.preventDefault()
            exec('bold')
            emitChange()
          }}
          aria-label="bold"
        >
          <FormatBoldIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="italic"
          disabled={disabled}
          onMouseDown={(event) => {
            event.preventDefault()
            exec('italic')
            emitChange()
          }}
          aria-label="italic"
        >
          <FormatItalicIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="underline"
          disabled={disabled}
          onMouseDown={(event) => {
            event.preventDefault()
            exec('underline')
            emitChange()
          }}
          aria-label="underline"
        >
          <FormatUnderlinedIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton
          value="list"
          disabled={disabled}
          onMouseDown={(event) => {
            event.preventDefault()
            exec('insertUnorderedList')
            emitChange()
          }}
          aria-label="bulleted list"
        >
          <FormatListBulletedIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>

      <Box
        ref={(node: HTMLDivElement | null) => {
          editorRef.current = node
          inputRef(node)
        }}
        role="textbox"
        aria-multiline
        contentEditable={!disabled}
        suppressContentEditableWarning
        data-name={name}
        onInput={() => {
          // Delegate to emitChange so the sanitizer runs on every keystroke /
          // paste — otherwise a paste of `<img onerror=...>` would land in the
          // form state unmodified.
          emitChange()
          detectMention()
        }}
        onKeyUp={detectMention}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === 'Escape') {
            setMention(null)
          }
        }}
        onBlur={onBlur}
        sx={{
          minHeight,
          px: 1.5,
          py: 1.25,
          outline: 'none',
          typography: 'body2',
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          '&:empty:before': {
            content: 'attr(data-placeholder)',
            color: 'text.disabled',
          },
        }}
        data-placeholder={placeholder ?? ''}
      />

      <Popover
        open={Boolean(mention) && filteredMentions.length > 0}
        anchorEl={mention?.anchorEl ?? null}
        onClose={() => setMention(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        disableAutoFocus
        disableEnforceFocus
      >
        <Stack sx={{ minWidth: 180, py: 0.5 }}>
          {filteredMentions.slice(0, 8).map((option) => (
            <MenuItem
              key={String(option.value)}
              dense
              onMouseDown={(event) => {
                event.preventDefault()
                insertMention(option)
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>
      </Popover>
    </Paper>
  )
}

export function FormRichText<T extends FieldValues>({
  name,
  label,
  disabled,
  placeholder,
  mentionOptions,
  minHeight,
  formControlProps,
}: FormRichTextProps<T>) {
  const { control } = useFormContext<T>()

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl
          {...formControlProps}
          fullWidth
          error={Boolean(fieldState.error)}
          disabled={disabled}
        >
          {label && <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>}
          <RichTextEditor
            name={field.name}
            value={normalizeTextValue(field.value)}
            disabled={disabled}
            placeholder={placeholder}
            mentionOptions={mentionOptions}
            minHeight={minHeight}
            onChange={field.onChange}
            onBlur={field.onBlur}
            inputRef={field.ref}
          />
          {fieldState.error?.message ? (
            <FormHelperText role="alert">{fieldState.error.message}</FormHelperText>
          ) : mentionOptions && mentionOptions.length > 0 ? (
            <FormHelperText>
              <Typography component="span" variant="caption" color="text.secondary">
                Type @ to mention
              </Typography>
            </FormHelperText>
          ) : null}
        </FormControl>
      )}
    />
  )
}

export type FormRichTextMentionOption = FormOption
