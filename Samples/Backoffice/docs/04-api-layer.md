# 04 — API layer

This layer is the frontend counterpart to RaccoonLand’s **PipelineResponse** contract on .NET.

---

## `src/api/types/pipeline.ts`

Defines the **JSON shape** returned by the backend:

```ts
PipelineResponse<T> = {
  result: T | null           // success payload
  errors: PipelineMessage[]  // failure — request failed
  warnings: PipelineMessage[] // success with warnings
}
```

`PipelineMessage`: `{ code, message }`

`PipelineResult<T>` — clean output for app code after parsing:

```ts
{ data: T, warnings: [...] }
```

---

## `src/api/errors.ts`

Two error classes:

### `PipelineApiError`

When `errors.length > 0` in the API response.

- `errors` — messages from the server
- `status` — HTTP status code

### `NetworkError`

When fetch fails, JSON is invalid, or the body is not a Pipeline envelope.

**Why separate classes?** So the UI can show server messages vs a generic network error.

---

## `src/api/client.ts`

### `createPipelineClient(http)`

Binds PipelineResponse parsing to a specific **axios instance**. Use one client per API (different `baseURL` / interceptors). Auth middleware stays on the axios instance, not in this layer.

```ts
const billingHttp = axios.create({ baseURL: 'https://billing.example' })
const billingApi = createPipelineClient(billingHttp)

await billingApi.fetchPipeline<Invoice[]>('/api/Invoices')
```

### `pipelineClient` / `fetchPipeline<T>(path, config?)`

`pipelineClient` is the default client for this sample (`httpClient`).  
`fetchPipeline` is a convenience wrapper around `pipelineClient.fetchPipeline`.

Flow:

1. Request via the bound axios instance
2. Parse JSON body as PipelineResponse
3. Invalid envelope → `InvalidPipelineResponseError`
4. Non-empty `errors` → `PipelineApiError`
5. Transport failure → `NetworkError`
6. Success → `{ data: result, warnings }`

### `buildQueryString(params)`

Builds a query string from a plain object; skips `undefined` and `''`.

People search example:

```ts
buildQueryString({ Page: 1, PageSize: 10, FirstName: 'Ali' })
// ?Page=1&PageSize=10&FirstName=Ali
```

Parameter names are **PascalCase** to match the .NET API.

---

## `src/api/hooks/usePipelineRequest.ts`

Convenience layer on **TanStack Query** + automatic feedback.

### `usePipelineExecutor` (internal)

Wraps every request:

- On error → toast (unless `showErrorToast: false`)
- Optionally → `withLoading` (global backdrop)

### `usePipelineQuery`

For **reading** data (GET):

```tsx
const { data, isPending, isError } = usePipelineQuery({
  queryKey: ['people', 'search', page, filters],
  queryFn: () => peopleApi.search({ ... }),
})
```

- `queryKey` — cache id; changes trigger refetch
- `enabled` — if false, no fetch (e.g. closed modal)
- `showGlobalLoader: false` — spinner inside modal only

### `usePipelineMutation`

For **writing** (POST, PUT, DELETE):

```tsx
const mutation = usePipelineMutation({
  mutationFn: (data) => peopleApi.update(id, data),
  onSuccess: () => { ... },
})
mutation.mutate(formValues)
```

---

## Successful request flow

```text
Component
  → usePipelineQuery / usePipelineMutation
    → execute() with loader + toast
      → peopleApi.search()
        → fetchPipeline('/api/People/Search?...')
          → fetch → JSON → PipelineResponse
```

---

## Error flow

```text
PipelineApiError → toast each error.message
NetworkError     → translated networkError toast
Other            → unknownError toast
```

On the edit form, `showErrorToast: false` is sometimes used so errors show in an **Alert** under the form.

---

## Next

→ [05-feedback.md](./05-feedback.md)
