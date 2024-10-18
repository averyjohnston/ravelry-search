import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string = '';
  if (isRouteErrorResponse(error)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    errorMessage = error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'Unknown error';
  }

  return (
    <div id="error-page" className="page">
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{errorMessage}</p>
      <p>
        <Link to="/">Return to home page</Link>
      </p>
    </div>
  )
}
