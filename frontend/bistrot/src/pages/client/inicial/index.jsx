import { useState, useEffect } from "react";
import axios from "axios";
import './style.css'
import { AiOutlineShoppingCart } from "react-icons/ai";

import TabBar from "../../../components/tabBar/tabBar";
import Loading from "../../../components/loading/loading";
import { Link } from "react-router-dom";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        // Verifica se os produtos estão armazenados no localStorage
        const cachedProdutos = localStorage.getItem("produtos");
        if (cachedProdutos) {
          setProdutos(JSON.parse(cachedProdutos));
          setRecords(JSON.parse(cachedProdutos));
          setLoading(false);
        } else {
          const res = await axios.get("http://localhost:6969/produtos");
          setProdutos(res.data);
          setRecords([...res.data]);
          setLoading(false);
          // Armazena os produtos no localStorage
          localStorage.setItem("produtos", JSON.stringify(res.data));
        }
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchProdutos();
    const userId = localStorage.getItem("userId");
    const cartKey = `carrinhoProdutos_${userId}`;
    const cartItems = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCartItems(cartItems.length);
  }, []);


  

  const Filter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setRecords(produtos.filter((produto) => produto.nome.toLowerCase().includes(searchTerm)));
  };

  return (
    <div className="d-flex flex-column w-100 home-geral">
      <div className="d-flex justify-content-center align-items-center mt-3 mx-2 mx-md-4">
        <form className="d-flex w-100 justify-content-center align-items-center">
          <input
            className="search-input mx-1 mx-sm-2 mx-md-2"
            type="search"
            placeholder="pesquisar"
            onChange={Filter}
          />
          <Link to='/carrinho'>
            <button type="button" className="card-button mx-1 mx-sm-2 mx-md-2">
              <AiOutlineShoppingCart />
              <span className="cart-status">{cartItems}</span>
            </button>
          </Link>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="d-flex flex-wrap justify-content-start align-items-center mx-3">
          {records.length === 0 ? (
            <div className="m-3">
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            records.map((produto) => (
              <Link to={`/infoproduto/${produto.id}`} key={produto.id} className="produto-card m-3 mb-1">
                <img
                  className="produto-foto mt-2"
                  src={`http://localhost:6969/files/${produto.foto}`}
                  alt=""
                />
                <div className="info-produtos mx-3 mt-2">
                  <h4 className="produto-nome">{produto.nome}</h4>
                  <h3 className="produto-preco">R$ {produto.preco}</h3>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
      <TabBar />
    </div>
  );
}

export default Home;
