import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom';
import './App.css';

// Home page component
const Home = () => {
  return (
    <div className='home-container'>
      <h1>Metrics Demo Application</h1>
      <p>
        This is a demo application showcasing how to send metrics and monitor
        application performance.
      </p>
      <div className='navigation-buttons'>
        <Link to='/users' className='nav-button'>
          Users
        </Link>
        <Link to='/settings' className='nav-button'>
          Settings
        </Link>
        <Link to='/groups' className='nav-button'>
          Groups
        </Link>
      </div>
    </div>
  );
};

// Users page component
const Users = () => {
  const navigate = useNavigate();

  return (
    <div className='page-container'>
      <h1>Users Page</h1>
      <p>Mock users page for demo purposes.</p>
      <button onClick={() => navigate('/')} className='home-button'>
        Go to Home
      </button>
    </div>
  );
};

// Settings page component
const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className='page-container'>
      <h1>Settings Page</h1>
      <p>Mock settings page for demo purposes.</p>
      <button onClick={() => navigate('/')} className='home-button'>
        Go to Home
      </button>
    </div>
  );
};

// Groups page component
const Groups = () => {
  const navigate = useNavigate();

  return (
    <div className='page-container'>
      <h1>Groups Page</h1>
      <p>Mock groups page for demo purposes.</p>
      <button onClick={() => navigate('/')} className='home-button'>
        Go to Home
      </button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/users' element={<Users />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/groups' element={<Groups />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
