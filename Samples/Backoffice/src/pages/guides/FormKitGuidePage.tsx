import { Alert, Button, MenuItem, Paper, Stack, Typography } from '@mui/material'
import {
  FormAsyncAutocomplete,
  FormAutocomplete,
  FormCheckbox,
  FormCheckboxGroup,
  FormChipInput,
  FormColorPicker,
  FormDateLocalizationProvider,
  FormDatePicker,
  FormDateTimePicker,
  FormFileUpload,
  FormMultiSelect,
  FormRadioGroup,
  FormRating,
  FormRichText,
  FormSelect,
  FormSlider,
  FormSwitch,
  FormTextField,
  FormTimePicker,
  FormToggleButtonGroup,
  FormTransferList,
  FormPersianDatePicker,
  coerceSelectChange,
} from '@raccoonland/form-kit'
import { Page } from '@raccoonland/page'
import { useRaccoonTheme } from '@raccoonland/theme'
import { FormProvider, useForm } from 'react-hook-form'
import { packageGuideBreadcrumbs } from '../../layout/breadcrumbIcons'
import { useLocale } from '../../i18n/LocaleProvider'
import { GuideUsageSection } from './GuideUsageSection'

type FormKitDemoValues = {
  name: string
  role: string
  status: number | ''
  tags: string[]
  city: string | null
  asyncCity: string | null
  volume: number
  rating: number | null
  dueDate: string | null
  dueTime: string | null
  appointment: string | null
  jalaliDate: string | null
  jalaliRange: [string | null, string | null]
  attachment: File | null
  channels: string[]
  viewMode: string
  accent: string
  chips: string[]
  transferred: string[]
  notesHtml: string
  notify: boolean
  darkMode: boolean
  priority: number | ''
}

const emptyDefaults: FormKitDemoValues = {
  name: '',
  role: '',
  status: '',
  tags: [],
  city: null,
  asyncCity: null,
  volume: 40,
  rating: 3,
  dueDate: null,
  dueTime: null,
  appointment: null,
  jalaliDate: null,
  jalaliRange: [null, null],
  attachment: null,
  channels: [],
  viewMode: 'list',
  accent: '#2e7d32',
  chips: [],
  transferred: [],
  notesHtml: '',
  notify: false,
  darkMode: true,
  priority: '',
}

const FORM_KIT_USAGE_CODE = `import {
  FormAsyncAutocomplete,
  FormAutocomplete,
  FormCheckboxGroup,
  FormChipInput,
  FormColorPicker,
  FormDateLocalizationProvider,
  FormDatePicker,
  FormFileUpload,
  FormRating,
  FormRichText,
  FormSlider,
  FormTimePicker,
  FormToggleButtonGroup,
  FormTransferList,
  FormPersianDatePicker,
  FormTextField,
} from '@raccoonland/form-kit'
import { FormProvider, useForm } from 'react-hook-form'

type Values = {
  city: string | null
  asyncCity: string | null
  volume: number
  rating: number | null
  dueDate: string | null
  jalaliDate: string | null
  jalaliRange: [string | null, string | null]
  attachment: File | null
  channels: string[]
  viewMode: string
  accent: string
  chips: string[]
  transferred: string[]
  notesHtml: string
}

export function ExtendedForm() {
  const methods = useForm<Values>({ /* defaults */ })

  return (
    <FormDateLocalizationProvider>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(console.log)}>
          <FormAutocomplete<Values>
            name="city"
            label="City"
            options={[
              { value: 'teh', label: 'Tehran' },
              { value: 'isf', label: 'Isfahan' },
            ]}
          />
          <FormAsyncAutocomplete<Values>
            name="asyncCity"
            label="City (server)"
            loadOptions={async (query, signal) => {
              const rows = await api.searchCities(query, { signal })
              return rows.map((row) => ({ value: row.id, label: row.name }))
            }}
          />
          <FormSlider<Values> name="volume" label="Volume" sliderProps={{ min: 0, max: 100 }} />
          <FormRating<Values> name="rating" label="Rating" />
          <FormDatePicker<Values> name="dueDate" label="Due date" />
          <FormPersianDatePicker<Values> name="jalaliDate" label="تاریخ شمسی" />
          <FormPersianDatePicker<Values>
            name="jalaliRange"
            label="بازه شمسی"
            range
            valueFormat="iso"
          />
          <FormFileUpload<Values> name="attachment" label="Attachment" accept=".pdf,image/*" />
          <FormToggleButtonGroup<Values>
            name="viewMode"
            label="View"
            options={[
              { value: 'list', label: 'List' },
              { value: 'grid', label: 'Grid' },
            ]}
          />
          <FormCheckboxGroup<Values>
            name="channels"
            label="Channels"
            options={[
              { value: 'email', label: 'Email' },
              { value: 'sms', label: 'SMS' },
            ]}
          />
          <FormColorPicker<Values> name="accent" label="Accent" />
          <FormChipInput<Values> name="chips" label="Tags" options={['urgent', 'billing']} />
          <FormTransferList<Values>
            name="transferred"
            label="Permissions"
            options={[
              { value: 'read', label: 'Read' },
              { value: 'write', label: 'Write' },
            ]}
          />
          <FormRichText<Values>
            name="notesHtml"
            label="Notes"
            mentionOptions={[{ value: 'ali', label: 'Ali' }]}
          />
        </form>
      </FormProvider>
    </FormDateLocalizationProvider>
  )
}`

export function FormKitGuidePage() {
  const { t, direction } = useLocale()
  const raccoon = useRaccoonTheme()
  const methods = useForm<FormKitDemoValues>({ defaultValues: emptyDefaults })

  const onSubmit = methods.handleSubmit((values) => {
    const payload = {
      ...values,
      attachment: values.attachment
        ? { name: values.attachment.name, size: values.attachment.size }
        : null,
    }
    window.alert(JSON.stringify(payload, null, 2))
  })

  const cityOptions = [
    { value: 'teh', label: 'Tehran' },
    { value: 'isf', label: 'Isfahan' },
    { value: 'shir', label: 'Shiraz' },
    { value: 'mash', label: 'Mashhad' },
  ]

  return (
    <Page
      title={t('guideFormKitTitle')}
      direction={direction}
      breadcrumbs={packageGuideBreadcrumbs(t, 'formKit')}
    >
      <Stack spacing={2}>
        <Paper
          elevation={0}
          sx={{ p: 2, bgcolor: raccoon.background.elevated, border: `1px solid ${raccoon.border.subtle}` }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('guideFormKitBody')}
          </Typography>
        </Paper>

        <GuideUsageSection
          description={t('guideUsageDescription')}
          demo={
            <Stack spacing={2}>
              <Alert severity="info">
                Empty numeric select stays <code>&apos;&apos;</code> (not <code>0</code>).{' '}
                coerceSelectChange(&apos;&apos;, &apos;number&apos;) →{' '}
                {JSON.stringify(coerceSelectChange('', 'number'))}
              </Alert>
              <Alert severity="info">{t('formKitDemoHint')}</Alert>
              <FormDateLocalizationProvider>
                <FormProvider {...methods}>
                  <Stack component="form" spacing={2} onSubmit={onSubmit}>
                    <FormTextField<FormKitDemoValues> name="name" label={t('formKitTitle')} fullWidth />
                    <FormSelect<FormKitDemoValues> name="role" label={t('formKitRole')} fullWidth>
                      <MenuItem value="">—</MenuItem>
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="editor">Editor</MenuItem>
                    </FormSelect>
                    <FormSelect<FormKitDemoValues>
                      name="status"
                      label={t('colStatus')}
                      valueAs="number"
                      fullWidth
                    >
                      <MenuItem value="">—</MenuItem>
                      <MenuItem value={1}>Active</MenuItem>
                      <MenuItem value={2}>Inactive</MenuItem>
                    </FormSelect>
                    <FormMultiSelect<FormKitDemoValues>
                      name="tags"
                      label={t('formKitTags')}
                      fullWidth
                      options={[
                        { value: 'alpha', label: t('formKitTagAlpha') },
                        { value: 'beta', label: t('formKitTagBeta') },
                        { value: 'gamma', label: t('formKitTagGamma') },
                      ]}
                    />

                    <FormAutocomplete<FormKitDemoValues>
                      name="city"
                      label={t('formKitCity')}
                      options={cityOptions}
                      textFieldProps={{ fullWidth: true }}
                    />
                    <FormAsyncAutocomplete<FormKitDemoValues>
                      name="asyncCity"
                      label={t('formKitAsyncCity')}
                      textFieldProps={{ fullWidth: true }}
                      loadOptions={async (query, signal) => {
                        await new Promise((resolve) => {
                          const timer = window.setTimeout(resolve, 350)
                          signal.addEventListener('abort', () => window.clearTimeout(timer))
                        })
                        if (signal.aborted) {
                          return []
                        }
                        const q = query.trim().toLowerCase()
                        return cityOptions.filter(
                          (option) =>
                            !q ||
                            option.label.toLowerCase().includes(q) ||
                            String(option.value).includes(q),
                        )
                      }}
                    />
                    <FormSlider<FormKitDemoValues>
                      name="volume"
                      label={t('formKitVolume')}
                      sliderProps={{ min: 0, max: 100, valueLabelDisplay: 'auto' }}
                    />
                    <FormRating<FormKitDemoValues> name="rating" label={t('formKitRating')} />
                    <FormDatePicker<FormKitDemoValues> name="dueDate" label={t('formKitDueDate')} />
                    <FormTimePicker<FormKitDemoValues> name="dueTime" label={t('formKitDueTime')} />
                    <FormDateTimePicker<FormKitDemoValues>
                      name="appointment"
                      label={t('formKitAppointment')}
                    />
                    <FormPersianDatePicker<FormKitDemoValues>
                      name="jalaliDate"
                      label={t('formKitJalaliDate')}
                      placeholder={t('formKitJalaliPlaceholder')}
                    />
                    <FormPersianDatePicker<FormKitDemoValues>
                      name="jalaliRange"
                      label={t('formKitJalaliRange')}
                      range
                      rangeLabels={{
                        start: t('formKitJalaliRangeStart'),
                        end: t('formKitJalaliRangeEnd'),
                      }}
                      placeholder={t('formKitJalaliRangePlaceholder')}
                    />
                    <FormFileUpload<FormKitDemoValues>
                      name="attachment"
                      label={t('formKitAttachment')}
                      accept=".pdf,image/*"
                      buttonLabel={t('formKitChooseFile')}
                      emptyLabel={t('formKitNoFile')}
                      dropLabel={t('formKitDropFile')}
                    />
                    <FormToggleButtonGroup<FormKitDemoValues>
                      name="viewMode"
                      label={t('formKitViewMode')}
                      options={[
                        { value: 'list', label: t('formKitViewList') },
                        { value: 'grid', label: t('formKitViewGrid') },
                      ]}
                    />
                    <FormCheckboxGroup<FormKitDemoValues>
                      name="channels"
                      label={t('formKitChannels')}
                      row
                      options={[
                        { value: 'email', label: t('formKitChannelEmail') },
                        { value: 'sms', label: t('formKitChannelSms') },
                        { value: 'push', label: t('formKitChannelPush') },
                      ]}
                    />
                    <FormColorPicker<FormKitDemoValues> name="accent" label={t('formKitAccent')} />
                    <FormChipInput<FormKitDemoValues>
                      name="chips"
                      label={t('formKitFreeTags')}
                      options={['urgent', 'billing', 'vip']}
                      textFieldProps={{ fullWidth: true }}
                    />
                    <FormTransferList<FormKitDemoValues>
                      name="transferred"
                      label={t('formKitPermissions')}
                      leftTitle={t('formKitAvailable')}
                      rightTitle={t('formKitSelected')}
                      options={[
                        { value: 'read', label: t('formKitPermRead') },
                        { value: 'write', label: t('formKitPermWrite') },
                        { value: 'delete', label: t('formKitPermDelete') },
                        { value: 'admin', label: t('formKitPermAdmin') },
                      ]}
                    />
                    <FormRichText<FormKitDemoValues>
                      name="notesHtml"
                      label={t('formKitNotes')}
                      placeholder={t('formKitNotesPlaceholder')}
                      mentionOptions={[
                        { value: 'ali', label: 'Ali' },
                        { value: 'sara', label: 'Sara' },
                        { value: 'reza', label: 'Reza' },
                      ]}
                    />

                    <FormCheckbox<FormKitDemoValues> name="notify" label={t('formKitNotify')} />
                    <FormSwitch<FormKitDemoValues> name="darkMode" label={t('formKitDarkMode')} />
                    <FormRadioGroup<FormKitDemoValues>
                      name="priority"
                      label={t('formKitPriority')}
                      valueAs="number"
                      row
                      options={[
                        { value: 1, label: t('formKitPriorityLow') },
                        { value: 2, label: t('formKitPriorityMedium') },
                        { value: 3, label: t('formKitPriorityHigh') },
                      ]}
                    />
                    <Button type="submit" variant="contained">
                      {t('formKitSubmit')}
                    </Button>
                  </Stack>
                </FormProvider>
              </FormDateLocalizationProvider>
            </Stack>
          }
          code={FORM_KIT_USAGE_CODE}
        />
      </Stack>
    </Page>
  )
}
