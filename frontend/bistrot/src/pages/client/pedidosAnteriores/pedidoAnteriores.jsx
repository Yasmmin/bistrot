import { Link } from "react-router-dom";
import { IoIosArrowBack } from 'react-icons/io';
import { BsCheckCircleFill } from "react-icons/bs";
import { IoMdAlert } from "react-icons/io";
import TabBar from "../../../components/tabBar/tabBar";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from 'date-fns';
import './pedidosAnteriores.css';
import { CiShare1 } from "react-icons/ci";

function PedidoAnteriores() {
    const [pedidosAnteriores, setPedidosAnteriores] = useState([]);
    const userId = localStorage.getItem('userId');

    // Função para buscar os pedidos
    const fetchPedidos = async () => {
        try {
            const res = await axios.get(`http://localhost:6969/pedidos/${userId}`);
            setPedidosAnteriores(res.data);
        } catch (error) {
            console.error('Erro ao buscar pedidos:', error);
        }
    };

    // Atualiza os pedidos a cada 3 segundos
    useEffect(() => {
        if (userId) {
            fetchPedidos(); // Buscar imediatamente ao montar o componente
            const intervalId = setInterval(fetchPedidos, 3000); // Atualiza a cada 3 segundos

            // Limpeza do intervalo quando o componente for desmontado
            return () => clearInterval(intervalId);
        }
    }, [userId]);

    return (
        <div className="pedidos-anteriores-container mx-auto ms-2">
            <TabBar />
            <div className="d-flex align-items-center mt-4 mb-4">
                <Link to="/">
                    <button className="btn border-0">
                        <IoIosArrowBack size={30} />
                    </button>
                </Link>
                <h1 className="ms-1 mb-2">Pedidos anteriores</h1>
            </div>

            <div className="info-pedidos-anteriores">
                {pedidosAnteriores
                    .filter(pedido => pedido.status_pedido.toLowerCase() !== "recusado")
                    .sort((a, b) => new Date(b.data) - new Date(a.data))
                    .map((pedido, index) => (
                        <div key={index} className="pedido">
                            <div className="status-pedidos-anteriores d-flex align-items-center">
                                {(pedido.status_pedido.toLowerCase() === "em processo" || pedido.status_pedido.toLowerCase() === "em análise") ? (
                                    <IoMdAlert className="icone-alerta ms-3 me-2" />
                                ) : (
                                    <BsCheckCircleFill className="icone-sucesso ms-3 me-2" />
                                )}
                                <div className="col">
                                    <p className="mb-0 me-4">{pedido.status_pedido} - Nº {pedido.numero_pedido}</p>
                                </div>

                                <div className="col acompanhar-redirect">
                                    <Link to={`/acompanhar/${pedido.numero_pedido}`} className="acompanhar-redirect ms-5"><CiShare1 /> Acompanhar</Link>
                                </div>
                            </div>
                            <div className="row ms-2">
                                <div className="col mb-2">
                                    {Array.isArray(pedido.produtos) && pedido.produtos.map((produto, index) => (
                                        <p key={index} className="produtos-pedidos-anteriores mb-0">{produto.quantidade}x {produto.nome}</p>
                                    ))}
                                </div>
                                <div className="col">
                                    <p className="data-pedidos-anteriores ms-5 mb-0">Data: {format(new Date(pedido.data), 'dd/MM/yyyy')}</p>

                                    <p className="preco-pedidos-anteriores text-start ms-5 ">
                                        Total: R$ {pedido.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </p>
                                </div>
                                <hr className="linha-pedidos-anteriores mx-auto " />
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default PedidoAnteriores;
