import { RouterProvider } from 'react-router-dom'
import { router } from '@/router'

// The router boundary only: page behaviour belongs in its view under src/views.
export default function App() {
  return <RouterProvider router={router} />
}
