import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Inicial from './pages/client/inicial/inicial'
import Cadastro from './pages/auth/cadastro/cadastro';
import Login from './pages/auth/login/login';
import EditarProdutos from './pages/admin/produtos/editarProdutos';

//Rotas que serão privadas
import Sidebar from './components/sidebar/sidebar';
import Produtos from './pages/admin/produtos/produtos';
import CriarProduto from './pages/admin/produtos/criarProduto';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Inicial />}></Route>
        <Route path='/cadastro' element={<Cadastro />}></Route>
        <Route path='/login' element={<Login/>}></Route>

        {/*Rotas que serão privadas - tem que fazer*/}
        <Route path='/sidebar' element={<Sidebar/>}></Route>
        <Route path='/produtos' element={<Produtos/>}></Route>
        <Route path='/criarproduto' element={<CriarProduto/>}></Route>
        <Route path='/EditarProdutos/:id' element={<EditarProdutos/>}></Route>

      </Routes>
    </BrowserRouter>
  )
}

export default App
