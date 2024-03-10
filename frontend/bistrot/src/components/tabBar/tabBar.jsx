import { useState } from 'react';
import { GoHomeFill } from 'react-icons/go';
import { FaClipboardList, FaUser } from 'react-icons/fa';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom'
import './tabBar.css'

function TabBar() {
    const [activeTab, setActiveTab] = useState('inicio');

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    return (
        <div className="tab-bar">

            {/*Botão de inicio*/}
            <Link to='/'>
                <div className={`tab ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => handleTabClick('inicio')} >
                    <div className="tab-content">
                        <GoHomeFill className="icon-tab m-3 mb-0 mt-0 " />
                        Inicio
                    </div>
                </div>
            </Link>

            {/*Botão de pedidos*/}
            <Link to='/pedidos'>
                <div className={`tab ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => handleTabClick('pedidos')}>
                    <div className="tab-content">
                        <FaClipboardList className="icon-tab" />
                        Pedidos
                    </div>
                </div>
            </Link>

            {/*Botão de perfil*/}
            <Link to='/perfil'>
                <div className={`tab ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => handleTabClick('perfil')} >
                    <div className="tab-content">
                        <FaUser className="icon-tab mr-5" />
                        Perfil
                    </div>
                </div>
            </Link>

            {/*Botão de carrinho*/}
            <Link to='/carrinho'>
                <div className={`tab ${activeTab === 'carrinho' ? 'active' : ''}`} onClick={() => handleTabClick('carrinho')}>
                    <div className="tab-content">
                        <AiOutlineShoppingCart className="icon-tab" />
                        Carrinho
                    </div>
                </div>
            </Link>


        </div>
    );
}

export default TabBar;
