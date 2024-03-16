import { useState } from "react";
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastro from './pages/auth/cadastro/cadastro';
import Login from './pages/auth/login/login';
import Senha from './pages/auth/senha/Senha';
import Home from './pages/client/inicial/home'; // Rota definitiva da tela Inicial
import Perfil from './../src/pages/client/perfil/perfil'
import SemPermissao from './components/permissão/semPermissao';
import Carrinho from './pages/client/carrinho/carrinho';
import Pedidos from './pages/client/pedidos/pedidos';
import InfoProduto from './pages/client/infoProduto/infoProduto';

//Rotas que serão privadas/admin
import Sidebar from './components/sidebar/sidebar';
import Produtos from './pages/admin/produtos/produtos';
import CriarProduto from './pages/admin/produtos/criarProduto';
import EditarProdutos from './pages/admin/produtos/editarProdutos';
import Funcionarios from './pages/admin/funcionarios/funcionarios';
import AddFuncionarios from './pages/admin/funcionarios/addFuncionarios';
import EditFuncionarios from './pages/admin/funcionarios/editFuncionario';
import Cliente from './pages/admin/clientes/cliente';

function App() {
  const [carrinhoProdutos, setCarrinhoProdutos] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    setCarrinhoProdutos([...carrinhoProdutos, produto]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/cadastro' element={<Cadastro />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/senha' element={<Senha />}></Route>
        <Route path='/perfil' element={<Perfil />}></Route>
        <Route path='/permissao' element={<SemPermissao />}></Route>
        <Route path='/carrinho' element={<Carrinho carrinhoProdutos={carrinhoProdutos} />}></Route>
        <Route path='/pedidos' element={<Pedidos />}></Route>
        <Route path='/infoproduto/:id' element={<InfoProduto adicionarAoCarrinho={adicionarAoCarrinho} />}></Route>

        {/*Rotas que serão privadas - tem que fazer*/}
        <Route path='/sidebar' element={<Sidebar />}></Route>
        <Route path='/produtos' element={<Produtos />}></Route>
        <Route path='/criarproduto' element={<CriarProduto />}></Route>
        <Route path='/EditarProdutos/:id' element={<EditarProdutos />}></Route>
        <Route path='/funcionarios' element={<Funcionarios />}></Route>
        <Route path='/Addfuncionarios' element={<AddFuncionarios />}></Route>
        <Route path='/EditFuncionarios/:id' element={<EditFuncionarios />}></Route>
        <Route path='/cliente' element={<Cliente />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
