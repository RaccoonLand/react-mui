import { useEffect, useState } from 'react'

export type HeaderUser = {
  name: string
  role: string
  initials: string
}

type HeaderUserState = {
  isLoading: boolean
  user: HeaderUser | null
}

/**
 * Header user info — replace the mock loader with a real API call later.
 */
export function useHeaderUser() {
  const [state, setState] = useState<HeaderUserState>({
    isLoading: true,
    user: null,
  })

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      // TODO: replace with e.g. usePipelineQuery → GET /api/Me
      await Promise.resolve()

      if (cancelled) {
        return
      }

      setState({
        isLoading: false,
        user: {
          name: 'Hassan',
          role: 'Admin',
          initials: 'H',
        },
      })
    }

    void loadUser()

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
