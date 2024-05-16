import Sidebar from "../../../components/sidebar/sidebar";
import { IoIosAddCircleOutline } from "react-icons/io";
import './funcionarios.css';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import { MdWork } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Swal from 'sweetalert2';


function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [records, setRecords] = useState([]);

    const Filter = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setRecords(funcionarios.filter((produto) => produto.nome.toLowerCase().includes(searchTerm)));
        console.log('Filtrando...', event.target.value);
    };

    useEffect(() => {
        const fetchFuncionarios = async () => {
            try {
                const res = await axios.get("http://localhost:6969/funcionarios");
                setFuncionarios(res.data);
                setRecords([...res.data]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFuncionarios();
    }, []);

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
                await axios.delete(`http://localhost:6969/funcionarios/${id}`);
                setFuncionarios(funcionarios.filter(funcionarios => funcionarios.id !== id));
                Swal.fire('Excluído!', 'O funcinario foi excluído com sucesso.', 'success');

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
        <div className="d-flex funcionarios-page">
            <Sidebar />
            <div className="content mt-3">
                <form className="d-flex w-100">
                    <div className="w-100">
                        <input
                            className="form-control flex-grow-1 mr-2 mb-3"
                            type="search"
                            placeholder="pesquisar"
                            onChange={Filter}
                            style={{ height: '3rem', width: '100%' }}
                        />
                    </div>
                    <Link to='/addFuncionarios'>
                        <button className="btn mx-2" type="submit" style={{ whiteSpace: 'nowrap', background: '#1BAC4B', color: 'white', height: '3rem' }}>
                            <IoIosAddCircleOutline size={20} /> Adicionar funcionarios
                        </button>
                    </Link>
                </form>

                <div className="conteudo-funcionarios text-center">
                    {records.map((funcionario, index) => (
                        <div className="info-funcionarios" key={index}>
                            <div className="foto-funcionario">
                                <img
                                    className="imagem-funcionario mb-3 mt-3"
                                    src={`http://localhost:6969/files/${funcionario.foto}`}
                                    alt="imagem do funcionario"
                                />
                            </div>
                            <div className="info-text">
                                <p className="mb-1" style={{ fontSize: '13pt', color: '#1BAC4B', fontWeight: 'bold' }}>{funcionario.nome}</p>
                                <div className="icon-text">
                                    <MdWork />
                                    <p className="mb-0">{funcionario.funcao}</p>
                                </div>
                                <div className="icon-text">
                                    <MdEmail />
                                    <p className="mb-0">{funcionario.email}</p>
                                </div>
                                <div className="icon-text mb-3">
                                    <FaPhone />
                                    <p className="mb-0">{funcionario.telefone}</p>
                                </div>
                            </div>
                            {/* Botão para Editar produtos */}
                            <div className="d-flex flex-column mb-1 mx-3">
                                <Link to={`/EditFuncionarios/${funcionario.id}`} className="btn btn-primary" style={{ color: 'white', fontWeight: '450' }}>
                                    <FaPen className='mx-2 ' />
                                    Editar
                                </Link>
                            </div>

                            {/* Botão para Excluir produtos */}
                            <div className='d-flex flex-column mb-1 mx-3'>
                                <button className="btn btn-danger mt-2 mb-4 w-100" onClick={() => handleDelete(funcionario.id)} style={{ color: "white", fontWeight: '450' }}>
                                    <FaTrashAlt className='mx-2' />
                                    Remover
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Funcionarios;
