import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import ErrorPage from './pages/ErrorPage';
import ProjectToQueuePage from './pages/ProjectToQueuePage';
import QueueSortPage from './pages/QueueSortPage';
import RandomPickerPage from './pages/RandomPickerPage';
import Root from './pages/Root';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <Navigate to="/queue-sort" replace={true} />,
          },
          {
            path: '/queue-sort',
            element: <QueueSortPage />,
            loader: QueueSortPage.loader,
          },
          {
            path: '/random-picker',
            element: <RandomPickerPage />,
            loader: RandomPickerPage.loader,
          },
          {
            path: '/project-to-queue',
            element: <ProjectToQueuePage />,
            loader: ProjectToQueuePage.loader,
            action: ProjectToQueuePage.action,
            shouldRevalidate: ProjectToQueuePage.shouldRevalidate,
          },
        ],
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
