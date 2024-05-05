import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosTrash } from 'react-icons/io';
import './carrinho.css';
import img from './../../../assets/SemProdutosNoCarrinho.svg';
import Loading from '../../../components/loading/loading';

function Carrinho() {
  const [carrinhoProdutos, setCarrinhoProdutos] = useState([]);
  const [precoTotal, setPrecoTotal] = useState(0);
  const [loading, setLoading] = useState(true); // Iniciar com loading true
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    setUserId(storedUserId);
    const carrinho = JSON.parse(localStorage.getItem(`carrinhoProdutos_${storedUserId}`));
    if (carrinho) {
      setCarrinhoProdutos(carrinho);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const total = carrinhoProdutos.reduce((acc, produto) => {
      return acc + produto.produto.preco * produto.quantidade;
    }, 0);
    setPrecoTotal(total);
  }, [carrinhoProdutos]);

  const incrementarQuantidade = (index) => {
    const novoProduto = { ...carrinhoProdutos[index] };
    novoProduto.quantidade++;
    novoProduto.precoTotal = novoProduto.produto.preco * novoProduto.quantidade; 
    const novosProdutos = [...carrinhoProdutos];
    novosProdutos[index] = novoProduto;
    setCarrinhoProdutos(novosProdutos);
    localStorage.setItem(`carrinhoProdutos_${userId}`, JSON.stringify(novosProdutos));
  };

  const decrementarQuantidade = (index) => {
    const novosProdutos = [...carrinhoProdutos];
    const produto = novosProdutos[index];
    
    if (produto.quantidade > 1) {
      produto.quantidade--;
      produto.precoTotal = produto.produto.preco * produto.quantidade;
    } else {
      novosProdutos.splice(index, 1);
    }
    const novoPrecoTotal = novosProdutos.reduce((acc, prod) => acc + prod.precoTotal, 0);
    
    setPrecoTotal(Math.max(novoPrecoTotal, 0));
    setCarrinhoProdutos(novosProdutos);
    localStorage.setItem(`carrinhoProdutos_${userId}`, JSON.stringify(novosProdutos));
  };

  const quantidadeTotalProdutos = carrinhoProdutos.reduce((acc, produto) => acc + produto.quantidade, 0);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="carrinho-container">
      <div className="d-flex align-items-center mt-4 mb-4">
        <Link to="/">
          <button className="btn border-0">
            <IoIosArrowBack size={30} />
          </button>
        </Link>
        <h1 className="ms-1 mb-2">Carrinho</h1>
      </div>

      {carrinhoProdutos.length === 0 ? (
        <div className="mt-5 mx-4">
          <img src={img} className="img-vazio" alt="carrinho vazio" />
          <h3>ops..!</h3>
          <p>Parece que você ainda não tem nada em seu carrinho :(</p>
        </div>
      ) : (
        <>
          <div className="produtos-carrinho">
            {carrinhoProdutos.map((produto, index) => (
              <div key={index} className="produto-item separador mb-3 d-flex">
                <img
                  src={`http://localhost:6969/files/${produto.produto.foto}`}
                  alt={produto.produto.nome}
                  className="carrinho-foto mb-3"
                />
                <div className="info-carrinho">
                  <h2 className="carrinho-nome">{produto.produto.nome}</h2>
                  <div className="carrinho-info d-flex justify-content-between">
                    <div>
                      <p className="carrinho-preco">
                        {produto.precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                      <p className="carrinho-categoria">{produto.categoria}</p>
                    </div>
                    <div className="quantidade-carrinho">
                      {produto.quantidade === 1 ? (
                        <button className="trash-icon mx-2" onClick={() => decrementarQuantidade(index)}>
                          <IoIosTrash size={20} className="mb-1 mr-2" style={{ color: 'red' }} />
                        </button>
                      ) : (
                        <button onClick={() => decrementarQuantidade(index)}>-</button>
                      )}
                      <span className="text-center"> {produto.quantidade}</span>
                      <button onClick={() => incrementarQuantidade(index)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="tab-pedido">
            <div className="finalizar d-flex justify-content-between ">
              <span className="precoTotal me-5">
                {precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </span>
              <Link to="/finalizar" className="finalizar-pedido ms-5">
                FINALIZAR({quantidadeTotalProdutos})
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Carrinho;
