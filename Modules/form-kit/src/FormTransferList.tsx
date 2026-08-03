import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  type FormControlProps,
} from '@mui/material'
import { useState } from 'react'
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form'
import type { FormControlNameProps, FormOption, ValueAs } from './types'
import { coerceSelectChange, normalizeMultiSelectValue } from './valueNormalization'

export type FormTransferListProps<T extends FieldValues> = FormControlNameProps<T> & {
  label?: string
  options: FormOption[]
  valueAs?: ValueAs
  disabled?: boolean
  leftTitle?: string
  rightTitle?: string
  formControlProps?: Omit<FormControlProps, 'error' | 'disabled'>
}

function not(a: Array<string | number>, b: Array<string | number>) {
  return a.filter((value) => !b.some((item) => String(item) === String(value)))
}

function intersection(a: Array<string | number>, b: Array<string | number>) {
  return a.filter((value) => b.some((item) => String(item) === String(value)))
}

function TransferListPane({
  title,
  items,
  options,
  checked,
  disabled,
  onToggle,
  onToggleAll,
}: {
  title: string
  items: Array<string | number>
  options: FormOption[]
  checked: Array<string | number>
  disabled?: boolean
  onToggle: (value: string | number) => void
  onToggleAll: () => void
}) {
  const selectedCount = checked.filter((c) => items.some((item) => String(item) === String(c))).length
  const allChecked = items.length > 0 && selectedCount === items.length
  const indeterminate = selectedCount > 0 && !allChecked

  return (
    <Card variant="outlined" sx={{ width: 220, maxWidth: '100%' }}>
      <CardHeader
        sx={{ px: 1.5, py: 1 }}
        avatar={
          <Checkbox
            size="small"
            disabled={disabled || items.length === 0}
            checked={allChecked}
            indeterminate={indeterminate}
            onChange={onToggleAll}
          />
        }
        title={title}
        subheader={`${selectedCount}/${items.length}`}
        titleTypographyProps={{ variant: 'subtitle2' }}
        subheaderTypographyProps={{ variant: 'caption' }}
      />
      <Divider />
      <List dense sx={{ height: 200, overflow: 'auto' }} component="div" role="list">
        {items.map((value) => {
          const option = options.find((item) => String(item.value) === String(value))
          const labelId = `transfer-list-item-${String(value)}-label`
          const isChecked = checked.some((item) => String(item) === String(value))

          return (
            <ListItemButton
              key={String(value)}
              role="listitem"
              disabled={disabled || option?.disabled}
              onClick={() => onToggle(value)}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Checkbox
                  size="small"
                  checked={isChecked}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={option?.label ?? String(value)} />
            </ListItemButton>
          )
        })}
      </List>
    </Card>
  )
}

export function FormTransferList<T extends FieldValues>({
  name,
  label,
  options,
  valueAs = 'string',
  disabled,
  leftTitle = 'Available',
  rightTitle = 'Selected',
  formControlProps,
}: FormTransferListProps<T>) {
  const { control } = useFormContext<T>()
  const [checked, setChecked] = useState<Array<string | number>>([])

  return (
    <Controller
      name={name as FieldPath<T>}
      control={control}
      render={({ field, fieldState }) => {
        const selected = normalizeMultiSelectValue(field.value, valueAs)
        const allValues = options.map((option) => coerceSelectChange(String(option.value), valueAs))
        const left = not(allValues, selected)
        const leftChecked = intersection(checked, left)
        const rightChecked = intersection(checked, selected)

        const toggle = (value: string | number) => {
          setChecked((current) =>
            current.some((item) => String(item) === String(value))
              ? current.filter((item) => String(item) !== String(value))
              : [...current, value],
          )
        }

        const toggleAll = (items: Array<string | number>) => {
          const allSelected =
            items.length > 0 &&
            items.every((item) => checked.some((c) => String(c) === String(item)))

          setChecked((current) =>
            allSelected
              ? not(current, items)
              : [...current, ...not(items, current)],
          )
        }

        return (
          <FormControl
            {...formControlProps}
            fullWidth
            error={Boolean(fieldState.error)}
            disabled={disabled}
            onBlur={field.onBlur}
          >
            {label && <FormLabel sx={{ mb: 1 }}>{label}</FormLabel>}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.5}
              sx={{ alignItems: { xs: 'stretch', sm: 'center' } }}
            >
              <TransferListPane
                title={leftTitle}
                items={left}
                options={options}
                checked={checked}
                disabled={disabled}
                onToggle={toggle}
                onToggleAll={() => toggleAll(left)}
              />

              <Stack spacing={1} sx={{ alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={disabled || leftChecked.length === 0}
                  onClick={() => {
                    field.onChange([...selected, ...leftChecked])
                    setChecked(not(checked, leftChecked))
                  }}
                  aria-label="move selected right"
                >
                  &gt;
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  disabled={disabled || rightChecked.length === 0}
                  onClick={() => {
                    field.onChange(not(selected, rightChecked))
                    setChecked(not(checked, rightChecked))
                  }}
                  aria-label="move selected left"
                >
                  &lt;
                </Button>
              </Stack>

              <TransferListPane
                title={rightTitle}
                items={selected}
                options={options}
                checked={checked}
                disabled={disabled}
                onToggle={toggle}
                onToggleAll={() => toggleAll(selected)}
              />
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
