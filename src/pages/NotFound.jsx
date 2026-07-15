import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>This page doesn't exist — maybe the link is broken, or the post was deleted.</p>
      <Link to="/" className="not-found-link">
        Back to Home
      </Link>
    </div>
  );
}

export default NotFound;