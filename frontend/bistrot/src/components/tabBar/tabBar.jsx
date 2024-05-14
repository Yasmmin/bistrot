import { useState } from 'react';
import { GoHomeFill } from 'react-icons/go';
import { FaClipboardList, FaUser } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import './tabBar.css';

function TabBar() {
    const [activeTab, setActiveTab] = useState('inicio');
    const [inicioColor, setInicioColor] = useState('#1bac4b');
    const [pedidosColor, setPedidosColor] = useState('#888888');
    const [perfilColor, setPerfilColor] = useState('#888888');
    const [carrinhoColor, setCarrinhoColor] = useState('#888888');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        // Atualiza o estado da cor do ícone conforme o botão clicado
        switch (tabName) {
            case 'inicio':
                setInicioColor('#1bac4b');
                setPedidosColor('#888888');
                setPerfilColor('#888888');
                setCarrinhoColor('#888888');
                break;
            case 'pedidos':
                setInicioColor('#888888');
                setPedidosColor('#1bac4b');
                setPerfilColor('#888888');
                setCarrinhoColor('#888888');
                break;
            case 'perfil':
                setInicioColor('#888888');
                setPedidosColor('#888888');
                setPerfilColor('#1bac4b');
                setCarrinhoColor('#888888');
                break;
            case 'carrinho':
                setInicioColor('#888888');
                setPedidosColor('#888888');
                setPerfilColor('#888888');
                setCarrinhoColor('#1bac4b');
                break;
            default:
                break;
        }
    };

    return (
        <div className="tab-bar">
            {/* Botão de inicio */}
            <Link to='/'>
                <div className={`tab ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => handleTabClick('inicio')}>
                    <div className="tab-content">
                        <GoHomeFill style={{ color: inicioColor }} className="icon-tab m-3 mb-0 mt-0" />
                        Inicio
                    </div>
                </div>
            </Link>

            {/* Botão de pedidos */}
            <Link to='/pedidosAnteriores'>
                <div className={`tab ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => handleTabClick('pedidos')}>
                    <div className="tab-content">
                        <FaClipboardList style={{ color: pedidosColor }} className="icon-tab" />
                        Pedidos
                    </div>
                </div>
            </Link>

            {/* Botão de perfil */}
            <Link to='/perfil'>
                <div className={`tab ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => handleTabClick('perfil')}>
                    <div className="tab-content">
                        <FaUser style={{ color: perfilColor }} className="icon-tab mr-5" />
                        Perfil
                    </div>
                </div>
            </Link>

            {/* Botão de carrinho */}
            <Link to='/carrinho'>
                <div className={`tab ${activeTab === 'carrinho' ? 'active' : ''}`} onClick={() => handleTabClick('carrinho')}>
                    <div className="tab-content">
                        <AiOutlineShoppingCart style={{ color: carrinhoColor }} className="icon-tab" />
                        Carrinho
                    </div>
                </div>
            </Link>

        </div>
    );
}

export default TabBar;
