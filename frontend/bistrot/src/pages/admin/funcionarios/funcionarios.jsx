import { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/sidebar';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdOutlineWork } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

function Funcionarios() {
    const [funcionarios, setFuncionarios] = useState([]);
    const [records, setRecords] = useState([]);

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
        <div className="d-flex">
            <Sidebar />
            <div className="d-flex flex-column flex-grow-1 ml-2">
                <div className="d-flex justify-content-between align-items-center mt-3 mx-4">
                    <form className="d-flex w-100 ">
                        {/*campo de pesquisa com icone dentro*/}
                        <div className="input-group">
                            <input
                                className="form-control flex-grow-1 mr-2 mb-3"
                                type="search"
                                placeholder="pesquisar"
                                style={{ height: '3rem' }}
                            />
                        </div>
                        {/*Botão de add*/}
                        <Link to={'/AddFuncionarios'}>
                            <button className="btn mx-1" type="submit" style={{ whiteSpace: 'nowrap', background: '#1BAC4B', color: 'white', height: '3rem' }}>
                                <IoIosAddCircleOutline size={20} /> Adicionar funcionarios
                            </button>
                        </Link>
                    </form>
                </div>

                <div className="d-flex flex-wrap text-center">
                    {records.map((funcionario) => (
                        <div key={funcionario.id} className="produto-card m-3" style={{ flex: '100%', maxWidth: '20%' }}>
                            <img
                                className="mt-3 mb-3 img-fluid"
                                src={`http://localhost:6969/files/${funcionario.foto}`}
                                alt=""
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                    borderRadius: '50%', 
                                    border: '3px solid #1BAC4B'
                                }}
                            />
                            <div className="funcionarios text-center mx-3">
                                <h4 style={{ color: '#1BAC4B', fontWeight: '500', overflowWrap: 'break-word' }}>
                                    {funcionario.nome}
                                </h4>

                                <div className="d-flex align-items-center">
                                    <MdOutlineWork className='mb-3 mx-2' />
                                    <p className="funcionario-info" style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>{funcionario.funcao}</p>
                                </div>

                                <div className="d-flex align-items-center">
                                    <MdEmail className='mx-2 mb-2' />
                                    <p className="funcionario-info" style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>{funcionario.email}</p>
                                </div>

                                <div className="d-flex align-items-center">
                                    <FaPhoneAlt className='mx-2 mb-2' />
                                    <p className="funcionario-info" style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>{funcionario.telefone}</p>
                                </div>

                                {/* Botão para editar produtos */}
                                <div className="d-flex flex-column mb-1">

                                    <Link to={`/EditFuncionarios/${funcionario.id}`} className="btn" style={{ backgroundColor: '#5ec580', color: 'black', fontWeight: '450' }}>
                                        <FaPen className='mx-2 ' />
                                        Editar
                                    </Link>
                                </div>

                                {/* Botão para Excluir produtos */}
                                <div className='d-flex flex-column mb-1'>
                                    <button className="btn mt-2 mb-4 w-100" onClick={() => handleDelete(funcionario.id)} style={{ backgroundColor: '#ff4d4d', color: "white", fontWeight: '450' }}>
                                        <FaTrashAlt className='mx-2' />
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


            </div>
        </div>
    );
}

export default Funcionarios;
