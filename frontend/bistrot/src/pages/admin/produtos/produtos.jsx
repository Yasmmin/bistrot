import { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar/sidebar";
import { IoIosAddCircleOutline } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

import { FaPen } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import './style.css';

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
    <div className="d-flex">
      <Sidebar />
      <div className="content">
        <div className="d-flex justify-content-between align-items-center mt-3 mx-4">
          <form className="d-flex w-100 ">
            <div className="w-100">
              <input
                className="form-control flex-grow-1 mr-2 mb-3"
                type="search"
                placeholder="pesquisar"
                onChange={Filter}
                style={{ height: '3rem', width: '100%' }}
              />

            </div>
            <button onClick={handleAdicionarProdutoClick} className="btn mx-2" type="submit" style={{ whiteSpace: 'nowrap', background: '#1BAC4B', color: 'white', height: '3rem' }}>
              <IoIosAddCircleOutline size={20} /> Adicionar produto
            </button>
          </form>
        </div>
        <div className="d-flex justify-content-start align-items-start flex-wrap mx-3">
          {records.length === 0 ? (
            <div className="m-3">
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            records.map((produto) => (
              <div key={produto.id} className=" produto-card-admin m-3">
                <div className="produto-admin mx-3">
                  <img className="img-produto-admin" src={`http://localhost:6969/files/${produto.foto}`} alt="imagem do produto" />
                  <div className="info-produtos-admin w-100">
                    <h4 className="info-nome-admin">{produto.nome}</h4>
                    <h5 className="info-preco-admin">R$ {produto.preco}</h5>
                    <div className="d-flex flex-column mb-1">
                      <Link to={`/EditarProdutos/${produto.id}`} className="btn btn-primary">
                        <FaPen className="mx-1" />
                        editar
                      </Link>
                    </div>
                    <button className="btn btn-danger mt-2 mb-4 w-100" onClick={() => handleDelete(produto.id)} >
                      <IoTrash className="mx-1" />
                      excluir produto
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Produtos;
