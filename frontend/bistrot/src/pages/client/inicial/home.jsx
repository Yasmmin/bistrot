import { useState, useEffect } from "react";

import axios from "axios";
import './style.css'

// icones 

import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get("http://localhost:6969/produtos");
        setProdutos(res.data);
        setRecords([...res.data]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProdutos();
  }, []);

  const Filter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setRecords(produtos.filter((produto) => produto.nome.toLowerCase().includes(searchTerm)));
    console.log('Filtrando...', event.target.value);
  };

  return (

    <div className="d-flex flex-column w-100 ml-2">
      <div className="d-flex justify-content-between align-items-center mt-3 mx-4">

        <form className="d-flex w-100 ">

          {/*campo de pesquisa*/}
          <input
            className="search-input"
            type="search"
            placeholder="pesquisar"
            onChange={Filter}
          />
          <button type="button" className="card-button">
            <CiHeart />
            <span className="cart-status">1</span>
          </button>

          <button type="button" className="card-button">
            <AiOutlineShoppingCart />
            <span className="cart-status">1</span>
          </button>
        </form>
      </div>

      <div className="d-flex flex-wrap justify-content-start align-items-start mx-3">
        {records.length === 0 ? (
          <div className="m-3">
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          records.map((produto) => (
            <div key={produto.id} className="produto-card m-3" >
              <img
                className="rounded "
                src={`http://localhost:6969/files/${produto.foto}`}
                alt=""
              />
              <div className="info-produtos mx-3">
                <h4 className="produto-nome">{produto.nome}</h4>
                <h3 className="produto-preco">R$ {produto.preco}</h3>
              </div>

            </div>
          ))
        )}
      </div>
    </div>

  )
}

export default Home