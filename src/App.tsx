import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
import UserDisplayPage from './pages/UserDisplayPage';

// TODO: once app is hosted live, add URL to Ravelry app's allowed origins

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/user',
        element: <UserDisplayPage />,
        loader: UserDisplayPage.loader,
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
