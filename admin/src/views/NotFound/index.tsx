import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/admin/PageHeader'

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found" description="There’s nothing at this address in the admin." />
      <Link to="/" className="font-semibold text-accent hover:text-accent-strong">Back to the overview</Link>
    </>
  )
}
