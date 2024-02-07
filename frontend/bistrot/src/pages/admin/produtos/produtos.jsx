import { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar/sidebar";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

// icones 
import { FaPen } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { CiFilter } from "react-icons/ci";

//import de arquivos
import './style.css'

function Produtos() {
  const navigate = useNavigate();

  const handleAdicionarProdutoClick = (e) => {
    e.preventDefault();
    navigate('/CriarProduto');
  };

  const [produtos, setProdutos] = useState([]);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await axios.get("http://localhost:6969/produtos");
        setProdutos(res.data);
        setRecords([...res.data]); // Cópia dos produtos para o estado de records
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

  // deleta o prpduto e manda uma mensagem de confirmação
  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      try {
        await axios.delete(`http://localhost:6969/produtos/${id}`);
        setProdutos(produtos.filter(produto => produto.id !== id));
        Swal.fire('Excluído!', 'O produto foi excluído com sucesso.', 'success');
        
        // Aguarda 1,5 segundos antes de recarregar a página
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        
      } catch (err) {
        console.error(err);
        Swal.fire('Erro', 'Houve um erro ao excluir o produto.', 'error');
      }
    }
  };

  return (
    <div className="container-fluid d-flex">
      <Sidebar />
      <div className="d-flex flex-column w-100 ml-2">
        <div className="d-flex justify-content-between align-items-center mt-3 mx-4">
          <form className="d-flex w-100 ">

            {/*campo de pesquisa com icone dentro*/}
            <div className="input-group">
              <input
                className="form-control flex-grow-1 mr-2"
                type="search"
                placeholder="pesquisar"
                onChange={Filter}
                style={{ borderRight: "none" }}
              />
              <div className="input-group-prepend">
                <span className="input-group-text"
                  style={{ borderLeft: "none", borderRadius: "0", borderTopRightRadius: '5px', borderBottomRightRadius: '5px', backgroundColor: "#ffff" }}>
                  <CiFilter size={24} />
                </span>
              </div>
            </div>

            {/*Botão de add*/}
            <button onClick={handleAdicionarProdutoClick} className="btn mx-1" type="submit" style={{ whiteSpace: 'nowrap', background: '#1BAC4B', color: 'white' }}>
              <IoIosAddCircleOutline size={20} /> Adicionar produto
            </button>
          </form>
        </div>

        <div className="d-flex flex-wrap justify-content-start align-items-start mx-3">
          {records.map((produto) => (
            <div key={produto.id} className=" produto-card m-3" style={{ width: '13rem', height:'27rem' }}>
              <img
                src={`http://localhost:6969/files/${produto.foto}`}
                alt=""
                style={{ width: '100%', height: '230px', display: 'block', margin: '0 auto', objectFit: 'cover', borderTopLeftRadius: '5px', borderTopRightRadius: '5px' }}
              />
              <div className="produto mx-3">

                <h3 style={{ borderTop: '1px solid #E0E0E0' }}>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <h5 className="preco">R${produto.preco}</h5>

                {/*Botão para editar produtos*/}
                <div className="d-flex flex-column mb-1">
                  <Link to={`/EditarProdutos/${produto.id}`} className="btn btn-primary">
                    <FaPen className="mx-1" />
                    editar
                  </Link>
                </div>

                {/*Botão para Excluir produtos*/}
                <button className="btn btn-danger mt-2 mb-4 w-100" onClick={() => handleDelete(produto.id)} ><IoTrash className="mx-1" />
                  excluir produto
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Produtos;