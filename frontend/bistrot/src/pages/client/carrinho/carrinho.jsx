//dependencias do arquivo
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

//icones
import { IoIosArrowBack, IoIosTrash } from 'react-icons/io';

//arquivos
import './Carrinho.css';
import TabBar from '../../../components/tabBar/tabBar';

function Carrinho({ userId }) {
  const [carrinhoProdutos, setCarrinhoProdutos] = useState([]);

  useEffect(() => {
    const storedCarrinhoProdutos = JSON.parse(localStorage.getItem(`carrinhoProdutos_${userId}`)) || [];
    setCarrinhoProdutos(storedCarrinhoProdutos);
  }, [userId]);

  const incrementarQuantidade = (index) => {
    const novosProdutos = [...carrinhoProdutos];
    novosProdutos[index].quantidade++;
    localStorage.setItem(`carrinhoProdutos_${userId}`, JSON.stringify(novosProdutos));
    setCarrinhoProdutos(novosProdutos);
  };

  const decrementarQuantidade = (index) => {
    const novosProdutos = [...carrinhoProdutos];
    if (novosProdutos[index].quantidade > 1) {
      novosProdutos[index].quantidade--;
    } else {
      novosProdutos.splice(index, 1);
    }
    localStorage.setItem(`carrinhoProdutos_${userId}`, JSON.stringify(novosProdutos));
    setCarrinhoProdutos(novosProdutos);
  };

  return (
    <div className="carrinho-container">
      <div className='header d-flex align-items-center mt-4 mb-4'>
        <Link to='/'>
          <button className='btn border-0'>
            <IoIosArrowBack size={30} />
          </button>
        </Link>
        <h1 className='ms-1 mb-2'>Carrinho</h1>
      </div>

      <div className="produtos">
        {carrinhoProdutos.map((produto, index) => (
          <div key={index} className="produto-item separador mb-3 d-flex">
            <img
              src={`http://localhost:6969/files/${produto.produto.foto}`}
              alt={produto.produto.nome}
              className="carrinho-foto mb-3"
            />
            <div className="info">
              <h2 className="carrinho-nome">{produto.produto.nome}</h2>
              <div className="carrinho-info d-flex justify-content-between">
                <div>
                  <p className="carrinho-preco ">{produto.precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                  <p className='carrinho-categoria'>{produto.categoria}</p>
                </div>
                <div className="quantidade-carrinho">
                  {produto.quantidade === 1 ? (
                    <button className="trash-icon mx-2" onClick={() => decrementarQuantidade(index)}>
                      <IoIosTrash size={20} className='mb-1 mr-2' style={{ color: 'red' }} />
                    </button>
                  ) : (
                    <button onClick={() => decrementarQuantidade(index)}>-</button>
                  )}
                  <span className='text-center'> {produto.quantidade}</span>
                  <button onClick={() => incrementarQuantidade(index)}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <TabBar />
    </div>
  );
}

Carrinho.propTypes = {
  userId: PropTypes.string.isRequired
};

export default Carrinho;
