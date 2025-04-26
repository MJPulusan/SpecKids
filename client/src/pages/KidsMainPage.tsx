import { Link } from 'react-router-dom';

export function KidsMain() {
  return (
    <div className="kidsMainPage">
      <h1>Welcome, Kiddo!</h1>
      <div className="appLinks">
        <Link to="/sketchpad" className="appLinkButton">
          Sketch Pad App
        </Link>
      </div>
    </div>
  );
}
