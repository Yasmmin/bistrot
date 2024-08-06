import { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import { AiOutlineShoppingCart, AiOutlineFilter } from "react-icons/ai";
import { IoIosInformationCircle } from "react-icons/io";
import { CiSearch } from "react-icons/ci";
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
  const [searchFocused, setSearchFocused] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({});

  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const hour = now.getHours();
      const dayOfWeek = now.getDay();
      
      // Horário de funcionamento das 11 da manhã até as 14 da tarde
      return dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 11 && hour < 14;
    };

    setIsOpen(checkOpenStatus());

    const fetchProdutos = async () => {
      try {
        const res = await axios.get("http://localhost:6969/produtos");
        const produtosData = res.data;
        setProdutos(produtosData);
        setRecords(produtosData);
        setLoading(false);
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

    // Atualizar produtos a cada 3 segundos
    const intervalId = setInterval(fetchProdutos, 3000);

    return () => clearInterval(intervalId);
  }, []);

  const Filter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setRecords(
      produtos.filter((produto) =>
        produto.nome.toLowerCase().includes(searchTerm)
      )
    );
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSearchFocus = (focused) => {
    setSearchFocused(focused);
  };

  const toggleCategories = () => {
    setShowCategories(!showCategories);
    const filterIcon = document.querySelector(".filter-icon");
    if (filterIcon) {
      const rect = filterIcon.getBoundingClientRect();
    
      const dropdownLeft = rect.left - 50; 
      setDropdownPosition({ top: rect.bottom, left: dropdownLeft });
    }
  };

  const selectCategory = (category) => {
    if (category === "") {
      setRecords(produtos); 
    } else {
      // Filtra os produtos pela categoria selecionada
      const filteredProdutos = produtos.filter(
        (produto) => produto.categoria.toLowerCase() === category
      );
      setRecords(filteredProdutos);
    }
    setShowCategories(false);
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
          <div
            className="popup-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Horários de Funcionamento</h2>
            <p>Segunda a Sexta: 07:00 - 12:55</p>
            <p>Sábado e Domingo: Fechado</p>
            <button className="btn btn-primary" onClick={togglePopup}>
              Fechar
            </button>
          </div>
        </div>
      )}

      <div className="content-container d-flex flex-column justify-content-between align-items-center mt-3 mx-2 mx-md-4">
        <form className="search-form w-100">
          <div className="search-container position-relative">
            {!searchFocused && <CiSearch className="search-icon" />}
            <input
              className="search-input"
              type="search"
              placeholder="pesquisar"
              onChange={Filter}
              onFocus={() => handleSearchFocus(true)}
              onBlur={() => handleSearchFocus(false)}
              disabled={!isOpen}
            />
            {!searchFocused && (
              <AiOutlineFilter
                className="filter-icon"
                onClick={toggleCategories}
              />
            )}
            {showCategories && (
              <div
                className="category-dropdown"
                style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
              >
                <ul>
                  <li onClick={() => selectCategory("")}>Tudo</li>
                  <li onClick={() => selectCategory("marmita")}>Marmitas</li>
                  <li onClick={() => selectCategory("porção")}>Porção</li>
                  <li onClick={() => selectCategory("bebida")}>Bebidas</li>
                </ul>
              </div>
            )}
          </div>
          <Link
            to="/carrinho"
            onClick={(e) => !isOpen && e.preventDefault()}
          >
            <button
              type="button"
              className="card-button mx-1 mx-sm-2 mx-md-2"
              disabled={!isOpen}
            >
              <AiOutlineShoppingCart />
              <span className="cart-status">{cartItems}</span>
            </button>
          </Link>
        </form>

        {loading ? (
          <Loading />
        ) : (
          <div className="products-container d-flex flex-wrap justify-content-start align-items-center ">
            {records.length === 0 ? (
              <div className="m-3">
                <p>Nenhum produto encontrado.</p>
              </div>
            ) : (
              records.map((produto) =>
                isOpen ? (
                  <Link
                    to={`/infoproduto/${produto.id}`}
                    key={produto.id}
                    className="produto-card mb-3 mx-1"
                  >
                    <img
                      className="produto-foto mt-2"
                      src={`http://localhost:6969/files/${produto.foto}`}
                      alt=""
                    />
                    <div className="info-produtos mx-3 mt-2">
                      <h4 className="produto-nome">{produto.nome}</h4>
                      <h3 className="produto-preco">
                        {formatCurrency(produto.preco)}
                      </h3>
                    </div>
                  </Link>
                ) : (
                  <div
                    key={produto.id}
                    className="produto-card m-3 mb-1"
                    style={{ pointerEvents: "none", opacity: 0.5 }}
                  >
                    <img
                      className="produto-foto mt-2"
                      src={`http://localhost:6969/files/${produto.foto}`}
                      alt=""
                    />
                    <div className="info-produtos mx-3 mt-2">
                      <h4 className="produto-nome">{produto.nome}</h4>
                      <h3 className="produto-preco">
                        {formatCurrency(produto.preco)}
                      </h3>
                    </div>
                  </div>
                )
              )
            )}
          </div>
        )}
      </div>
      <TabBar />
    </div>
  );
}

export default Home;
