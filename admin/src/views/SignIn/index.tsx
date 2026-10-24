import { LogIn } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { FullPageMessage } from '@/components/admin/FullPageMessage'
import { Notice } from '@/components/admin/Notice'

const ERRORS: Record<string, string> = {
  not_a_member: 'That GitHub account isn’t on the member list. Ask an owner to add your username.',
  expired: 'That sign-in took too long or was started elsewhere. Try again.',
  github: 'GitHub didn’t confirm who you are. Try again.',
}

export default function SignIn() {
  const [params] = useSearchParams()
  const error = params.get('error')

  return (
    <FullPageMessage title="Chi-Square Admin">
      <p>Edit the site’s events, people and pages. Changes go live when an owner publishes them.</p>
      {error && <Notice tone="error" className="mt-4">{ERRORS[error] ?? 'Signing in failed. Try again.'}</Notice>}
      {/* A full page load, not a router link: GitHub's sign-in page is not part of this app. */}
      <a href="/api/auth/login" className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-ink font-semibold text-white hover:bg-ink-edge">
        <LogIn className="size-4" /> Sign in with GitHub
      </a>
    </FullPageMessage>
  )
}
