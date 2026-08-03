# 12 — People: forms and validation

Folder `features/people/forms/` + form components in `components/`.

---

## `forms/personValidation.ts`

### `PersonFieldLimits`

Min/max lengths — **single source** for validation and `maxLength`:

```ts
firstName: { min: 2, max: 50 }
mobileNumber: { min: 11, max: 11 }
// ...
```

### Form value types

- `PersonCreateFormValues` — all create fields
- `PersonEditFormValues` — editable fields only

### `validatePersonCreate` / `validatePersonEdit`

Pure functions returning `FieldErrors` — no react-hook-form dependency.

Messages use `t('validationRequired')`, etc. with `{label}` placeholders.

### `createEmptyPersonCreateForm()`

Default values for the create form.

---

## `forms/personFormResolvers.ts`

**Resolver** = bridge between react-hook-form and our validators.

```ts
createPersonCreateResolver(t, labels)
createPersonEditResolver(t, labels)
```

Returns a `Resolver<FormValues>` that:

1. Calls `validatePerson*`
2. Returns errors in react-hook-form shape

**Why separate from validation?** Pages only build the resolver; business rules stay in `personValidation`.

---

## `components/FormTextField.tsx`

MUI TextField + error display:

```tsx
<FormTextField error={!!error} errorMessage={error?.message} />
```

Red border and helper text.

---

## `components/RhfFormTextField.tsx`

**react-hook-form** integration:

- `RhfFormTextField` — `Controller` + `FormTextField`
- `RhfSelectField` — for `<Select>` / MenuItem

`name` must be a valid form key (TypeScript generic `T extends FieldValues`).

---

## `components/personFormLayout.tsx`

### `PersonFormSection`

Card with icon + section title (identity, contact, employment).

### `PersonFormActions`

Bottom action bar:

- Left: delete (edit only)
- Right: cancel + save
- Sticky at bottom on mobile

---

## `components/PersonCreateForm.tsx`

Create form — three sections:

1. Identity: employeeCode, nationalCode, firstName, lastName
2. Contact: email, mobile
3. Employment: employmentDate

`FormProvider` + `handleSubmit` → `onValidSubmit` from the page.

---

## `components/PersonEditForm.tsx`

Similar to create but:

- Read-only: employeeCode, nationalCode, employmentDate (disabled TextField)
- Editable `status`
- Delete button in `PersonFormActions`

Uses `formatDateDisplay` from utils for dates.

---

## Submit flow

```text
User clicks Save
  → react-hook-form resolver
    → personValidation
  → onValidSubmit in Page
    → usePipelineMutation.mutate
      → peopleApi.create/update
```

---

## Next

→ [13-people-components.md](./13-people-components.md)
