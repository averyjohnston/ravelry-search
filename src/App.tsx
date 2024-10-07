import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorPage from './pages/ErrorPage';
import QueueSortPage from './pages/QueueSortPage';
import Root from './pages/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/queue-sort',
        element: <QueueSortPage />,
        loader: QueueSortPage.loader,
      },
    ],
  },
]);

export default function App() {
  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  )
}
