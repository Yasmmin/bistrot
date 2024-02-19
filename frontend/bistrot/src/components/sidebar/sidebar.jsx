// importação das dependencias do projeto
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//importação do css
import './sidebar.css';

//importação de icones e fotos
import logoAdm from '../../assets/logoAdmin.svg'
import { MdChecklist } from "react-icons/md";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { MdLocalOffer } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { FaUsersCog } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";


function Sidebar() {
    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new window.bootstrap.Tooltip(tooltipTriggerEl);
        });
    }, []);

    // Função de logout específica para a Sidebar
    const handleSidebarLogout = () => {
        axios.get("http://localhost:8081/logout")
            .then(() => {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = "/login";
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='body'>
            <div className="d-flex flex-nowrap">
                <div className="d-flex flex-column flex-shrink-0 p-3 sidebar" style={{ width: '280px' }}>

                    {/*div para logo*/}
                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <img
                            src={logoAdm}
                            alt="Logo de cadastro"
                            className="img-fluid img-responsive no-select mb-2 me-2"
                            style={{ width: '90%', height: 'auto' }}
                        />
                    </div>

                    <div className='servicos'>
                        {/*Opção Pedidos*/}
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item mb-2">
                                <Link to="#" className="nav-link" aria-current="page">
                                    <div className="icon">
                                        <MdChecklist />
                                    </div>
                                    Pedidos
                                </Link>
                            </li>

                            {/*Opção Produtos*/}
                            <li className="nav-item mb-2">
                                <Link to="/produtos" className="nav-link " aria-current="page">
                                    <div className="icon">
                                        <MdOutlineSpaceDashboard />
                                    </div>
                                    Produtos
                                </Link>
                            </li>

                            {/*Finalizados*/}
                            <li className="nav-item mb-2">
                                <Link to="#" className="nav-link " aria-current="page">
                                    <div className="icon">
                                        <MdChecklist />
                                    </div>
                                    Finalizados
                                </Link>
                            </li>

                            <hr className="my-3" style={{ borderTop: '1px solid rgba(0,0,0,0.5)', width: '100%' }} />

                            <p style={{ fontWeight: 'bold', color: '#202224', opacity: 0.7 }}>PÁGINAS</p>

                            {/*Promoções*/}
                            <li className="nav-item">
                                <Link to="#" className="nav-link " aria-current="page">
                                    <div className="icon">
                                        <MdLocalOffer />
                                    </div>
                                    Promoções
                                </Link>
                            </li>

                            {/*Clientes*/}
                            <li className="nav-item">
                                <Link to="/cliente" className="nav-link " aria-current="page">
                                    <div className="icon">
                                        <BsPersonLinesFill />
                                    </div>
                                    Clientes
                                </Link>
                            </li>

                            {/*Estatisticas*/}
                            <li className="nav-item">
                                <Link to="#" className="nav-link " aria-current="page">
                                    <div className="icon">
                                        <GoGraph />
                                    </div>
                                    Estatísticas
                                </Link>
                            </li>

                            {/*Funcionários*/}
                            <li className="nav-item">
                                <Link to="/funcionarios" className="nav-link " aria-current="page">
                                    <div className="icon">
                                        <FaUsersCog />
                                    </div>
                                    Funcionários
                                </Link>
                            </li>

                            <hr className="my-3" style={{ borderTop: '1px solid rgba(0,0,0,0.5)', width: '100%' }} />

                            <button className="btn btn-danger mx-3 mb-4" onClick={handleSidebarLogout}>
                                <FaPowerOff style={{ marginRight: '5px' }} />
                                Sair
                            </button>

                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
