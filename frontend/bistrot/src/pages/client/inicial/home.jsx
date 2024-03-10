import  { useState, useEffect } from "react";
import axios from "axios";
import './style.css'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { CiHeart } from "react-icons/ci";
import TabBar from "../../../components/tabBar/tabBar";
import Loading from "../../../components/loading/loading";
import { Link } from "react-router-dom";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get("http://localhost:6969/produtos");
        setProdutos(res.data);
        setRecords([...res.data]);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProdutos();
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
          <Link to="/favoritos">
            <button type="button" className="card-button mx-1 mx-sm-2 mx-md-2">
              <CiHeart />
              <span className="cart-status">1</span>
            </button>
          </Link>
          <Link to='/carrinho'>
            <button type="button" className="card-button mx-1 mx-sm-2 mx-md-2">
              <AiOutlineShoppingCart />
              <span className="cart-status">1</span>
            </button>
          </Link>
        </form>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="d-flex flex-wrap justify-content-start align-items-center mx-1">
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
