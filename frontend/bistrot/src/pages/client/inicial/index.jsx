import { useState, useEffect } from "react";
import axios from "axios";
import './style.css';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoIosInformationCircle } from "react-icons/io";
import TabBar from "../../../components/tabBar/tabBar";
import Loading from "../../../components/loading/loading";
import { Link } from "react-router-dom";

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
   
    const checkOpenStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay(); 
      // Verifica se é segunda a sexta-feira e está dentro do horário de funcionamento
      //horario de funcionamento das 11 da manhã até as 14 da tarde
      if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 11 && hour < 19) {
        return true;
      } else {
        return false;
      }
    };

    setIsOpen(checkOpenStatus());

    const fetchProdutos = async () => {
      try {
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="d-flex flex-column w-100 home-geral">
      {!isOpen && (
        <div className="alert alert-warning text-center mb-0" role="alert">
          <p className="info-button-horarios">
            <button className="button-horarios" onClick={togglePopup}>
              <IoIosInformationCircle />
            </button>
            Estamos fechados. Clique para conhecer nossos horários
          </p>
        </div>
      )}

      {showPopup && (
        <div className="popup-overlay" onClick={togglePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <h2>Horários de Funcionamento</h2>
            <p>Segunda a Sexta: 07:00 - 12:55</p>
            <p>Sábado e Domingo: Fechado</p>
            <button className="btn btn-primary" onClick={togglePopup}>Fechar</button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-center align-items-center mt-3 mx-2 mx-md-4">
        <form className="d-flex w-100 justify-content-center align-items-center">
          <input
            className="search-input mx-1 mx-sm-2 mx-md-2"
            type="search"
            placeholder="pesquisar"
            onChange={Filter}
            disabled={!isOpen}
          />
          <Link to='/carrinho' onClick={(e) => !isOpen && e.preventDefault()}>
            <button type="button" className="card-button mx-1 mx-sm-2 mx-md-2" disabled={!isOpen}>
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
              isOpen ? (
                <Link to={`/infoproduto/${produto.id}`} key={produto.id} className="produto-card m-3 mb-1">
                  <img
                    className="produto-foto mt-2"
                    src={`http://localhost:6969/files/${produto.foto}`}
                    alt=""
                  />
                  <div className="info-produtos mx-3 mt-2">
                    <h4 className="produto-nome">{produto.nome}</h4>
                    <h3 className="produto-preco">{formatCurrency(produto.preco)}</h3>
                  </div>
                </Link>
              ) : (
                <div key={produto.id} className="produto-card m-3 mb-1" style={{ pointerEvents: 'none', opacity: 0.5 }}>
                  <img
                    className="produto-foto mt-2"
                    src={`http://localhost:6969/files/${produto.foto}`}
                    alt=""
                  />
                  <div className="info-produtos mx-3 mt-2">
                    <h4 className="produto-nome">{produto.nome}</h4>
                    <h3 className="produto-preco">{formatCurrency(produto.preco)}</h3>
                  </div>
                </div>
              )
            ))
          )}
        </div>
      )}
      <TabBar />
    </div>
  );
}

export default Home;
