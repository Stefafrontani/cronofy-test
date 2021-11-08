import Navigation from './Navigation';
import Header from './components/Header/Header'
import './App.css';

function App() {

  return (
    <div className="App">
      <Header />
      <section className="content">
        <Navigation />
      </section>
    </div>
  );
}

export default App;