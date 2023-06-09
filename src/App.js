import {Routes,Route,BrowserRouter} from 'react-router-dom';
import  MostrarElementos from './components/MostrarElementos';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<MostrarElementos></MostrarElementos>}></Route>
      </Routes>
       
    </BrowserRouter>
  );
}

export default App;
