import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import Header from './components/Header/Header'
import './App.css';

function App() {

  return (
    <div className="App">
      <Header />
      <Navigation />
    </div>
  );
}

export default App;