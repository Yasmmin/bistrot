// importação das dependencias do projeto
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
//importação do css
import './sidebar.css';

//importação de icones e fotos
import logoAdm from '../../assets/logoAdmin.svg'
import { MdChecklist } from "react-icons/md";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { BsPersonLinesFill } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { FaUsersCog } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";


function Sidebar() {
    const [activeTab, setActiveTab] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const pathname = location.pathname;
        setActiveTab(pathname);
    }, [location]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const handleSidebarLogout = () => {
        axios.get("http://localhost:6969/logout")
            .then(() => {
                document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                window.location.href = "/login";
            })
            .catch(err => console.log(err));
    };

    return (
        <div className='body'>
            <div className="d-flex m-0">
                <div className="d-flex flex-column p-3 sidebar" style={{ width: '280px', height: '100vh' }}>

                    <div className="d-flex align-items-center justify-content-center mb-4">
                        <img
                            src={logoAdm}
                            alt="Logo de cadastro"
                            className="img-fluid img-responsive no-select mb-2 me-2"
                            style={{ width: '90%', height: 'auto' }}
                        />
                    </div>

                    <div className='servicos'>
                        <ul className="nav nav-pills flex-column mb-auto">
                            <li className="nav-item mb-2">
                                <Link
                                    to="/Pedidos"
                                    className={`nav-link ${activeTab === '/Pedidos' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('/Pedidos')}
                                >
                                    <div className="icon-sidebar">
                                        <MdChecklist />
                                    </div>
                                    Pedidos
                                </Link>
                            </li>

                            <li className="nav-item mb-2">
                                <Link
                                    to="/produtos"
                                    className={`nav-link ${activeTab === '/produtos' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('/produtos')}
                                >
                                    <div className="icon-sidebar">
                                        <MdOutlineSpaceDashboard />
                                    </div>
                                    Produtos
                                </Link>
                            </li>

                            <li className="nav-item mb-2">
                                <Link
                                    to="/todosOsPedidos"
                                    className={`nav-link ${activeTab === '/todosOsPedidos' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('/todosOsPedidos')}
                                >
                                    <div className="icon-sidebar">
                                        <MdChecklist />
                                    </div>
                                    Todos os Pedidos
                                </Link>
                            </li>

                            <hr className="my-3" style={{ borderTop: '1px solid rgba(0,0,0,0.5)', width: '100%' }} />

                            <p style={{ fontWeight: 'bold', color: '#202224', opacity: 0.7 }}>PÁGINAS</p>



                            <li className="nav-item mb-2">
                                <Link
                                    to="/cliente"
                                    className={`nav-link ${activeTab === '/cliente' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('/cliente')}
                                >
                                    <div className="icon-sidebar">
                                        <BsPersonLinesFill />
                                    </div>
                                    Clientes
                                </Link>
                            </li>

                            <li className="nav-item mb-2">
                                <Link
                                    to="#"
                                    className={`nav-link ${activeTab === '/Estatisticas' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('/Estatisticas')}
                                >
                                    <div className="icon-sidebar">
                                        <GoGraph />
                                    </div>
                                    Estatísticas
                                </Link>
                            </li>

                            <li className="nav-item">
                                <Link
                                    to="/funcionarios"
                                    className={`nav-link ${activeTab === '/funcionarios' ? 'active' : ''}`}
                                    onClick={() => handleTabClick('/funcionarios')}
                                >
                                    <div className="icon-sidebar">
                                        <FaUsersCog />
                                    </div>
                                    Funcionários
                                </Link>
                            </li>

                            <hr className="my-3" style={{ borderTop: '1px solid rgba(0,0,0,0.5)', width: '100%' }} />

                            <button className="btn btn-danger mx-3 mt-5" onClick={handleSidebarLogout}>
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