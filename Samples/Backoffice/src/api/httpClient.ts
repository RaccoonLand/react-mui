import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * App-owned axios instance for the primary API.
 * Attach auth/refresh interceptors here. Pass additional instances to createPipelineClient for other APIs.
 */
export const httpClient = axios.create({
  baseURL: apiBaseUrl || undefined,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})
