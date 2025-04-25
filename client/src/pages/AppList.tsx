import { Link } from 'react-router-dom';

export default function ListPage() {
  return (
    <>
      <div>
        <Link to="/sketchpad">Sketch Pad App</Link>
      </div>
      <div>
        <Link to="/register">Parent Registration Page</Link>
      </div>
    </>
  );
}
