import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div id="home-page">
      <Link to="/user">User display</Link>
    </div>
  );
}
