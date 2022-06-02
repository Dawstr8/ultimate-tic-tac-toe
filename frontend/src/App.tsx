import './App.css';
import Board from './components/Board/Board';
import LobbyList from './components/LobbyList/LobbyList';

function App() {
  return (
    <div className="App">
      <LobbyList />
      <Board />
    </div>
  );
}

export default App;
