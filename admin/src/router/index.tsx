import { createBrowserRouter } from 'react-router-dom'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { SessionProvider } from '@/components/admin/SessionProvider'
import Activity from '@/views/Activity'
import Members from '@/views/Members'
import NotFound from '@/views/NotFound'
import Overview from '@/views/Overview'
import Publishing from '@/views/Publishing'
import Section from '@/views/Section'
import SignIn from '@/views/SignIn'

export const router = createBrowserRouter([
  { path: '/sign-in', element: <SignIn /> },
  {
    element: <SessionProvider />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: 'sections/:sectionId', element: <Section /> },
          { path: 'publishing', element: <Publishing /> },
          { path: 'members', element: <Members /> },
          { path: 'activity', element: <Activity /> },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])
