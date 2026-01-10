
import './App.css';
import Navbarr from './Components/Navbarr7';
import Content from './Components/Content';
import ShowTeam from './Components/ShowTeam';
import {
  BrowserRouter as Router7,
  Switch,
  Route,
  Routes,
} from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Router7>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Navbarr />
                <Content />
              </div>
            }
          />

          <Route
            path="/team"
            element={
              <div>
                <Navbarr />
                <ShowTeam />
              </div>
            }
          />
        </Routes>
      </Router7>
      {/* 
    <Navbarr/>
    <Content/> */}
    </div>
  );
}

export default App;
