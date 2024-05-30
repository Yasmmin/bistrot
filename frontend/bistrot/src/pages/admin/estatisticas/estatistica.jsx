import { useState, useEffect } from 'react';
import Sidebar from '../../../components/sidebar/sidebar';
import './estatistica.css';
import Pedidos from './../../../../../../backend/image/dashboard/produtosVerde.svg';
import Delivery from './../../../../../../backend/image/dashboard/deliveryVerde.svg';
import Recusados from './../../../../../../backend/image/dashboard/canceladosVerde.svg';
import Faturamento from './../../../../../../backend/image/dashboard/faturamentoVerde.svg';
import LineChartComponent from './grafico';
import { ReactSVG } from 'react-svg';
import axios from 'axios';

export default function Estatistica() {
    const [filtroData, setFiltroData] = useState(new Date().toISOString().split('T')[0]);
    const [records, setRecords] = useState([]);
    const [faturamentoAtual, setFaturamentoAtual] = useState(0);

    const handleDataChange = (event) => {
        setFiltroData(event.target.value);
    };

    useEffect(() => {
        const fetchEstatistica = async () => {
            try {
                const res = await axios.get('http://localhost:6969/pedidos', {
                    params: {
                        date: filtroData,
                    },
                });
                setRecords([...res.data]);
    
                const pedidosFiltrados = res.data.filter((pedido) => {
                    const statusPermitidos = ['entregue', 'retirado', 'finalizado'];
                    return statusPermitidos.includes(pedido.status_pedido.toLowerCase());
                });
    
                const faturamentoTotal = pedidosFiltrados.reduce((total, pedido) => total + parseFloat(pedido.valor_total), 0);
                animacaoFaturamento(faturamentoTotal);
            } catch (err) {
                console.error(err);
            }
        };
    
        fetchEstatistica();
    }, [filtroData]);
    

    const animacaoFaturamento = (faturamentoTotal) => {
        let currentFaturamento = 0;
        const step = faturamentoTotal / 50; 

        const interval = setInterval(() => {
            currentFaturamento += step;
            setFaturamentoAtual(currentFaturamento);

            if (currentFaturamento >= faturamentoTotal) {
                clearInterval(interval);
            }
        }, 10); 
    };

    const filteredRecords = records.filter((pedido) => {
        const pedidoData = new Date(pedido.data).toISOString().split('T')[0];
        return pedidoData === filtroData;
    });

    return (
        <div className="d-flex body-estatistica">
            <Sidebar />
            <div className="content">
                <div className="line-1 d-flex justify-content-between align-items-center">
                    <div className="text-info-estatisticas ms-3">
                        <h3 className="mb-1 mt-2">Estatísticas</h3>
                        <p className="texto-welcome">Seja bem-vindo de volta! Aqui, você pode analisar seus rendimentos.</p>
                    </div>
                    <div className="filter-period me-4">
                        <div className="icon">
                            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M19 4H18V2H16V4H8V2H6V4H5C3.9 4 3 4.9 3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6C21 4.9 20.1 4 19 4ZM19 20H5V10H19V20ZM5 8V6H19V8H5ZM7 12H9V14H7V12ZM11 12H13V14H11V12ZM15 12H17V14H15V12Z"
                                    fill="#2196F3"
                                />
                            </svg>
                        </div>
                        <div className="details">
                            <span className="title">Filtrar</span>
                            <input type="date" className="calendario-estatistica" value={filtroData} onChange={handleDataChange} />
                        </div>
                    </div>
                </div>

                <div className="line-2 d-flex py-2 me-3 mt-3">
                    {/* Total de pedidos */}
                    <div className="stat-card">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon">
                                <ReactSVG src={Pedidos} />
                            </div>
                            <div>
                                <div className="stat-number">{filteredRecords.length}</div>
                                <div className="stat-label">Todos os Pedidos</div>
                            </div>
                        </div>
                    </div>
                    {/* Total de delivery */}
                    <div className="stat-card">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon">
                                <ReactSVG src={Delivery} />
                            </div>
                            <div>
                                <div className="stat-number">{filteredRecords.filter((pedido) => pedido.forma_entrega === 'Entregar').length}</div>
                                <div className="stat-label">Total de Delivery</div>
                            </div>
                        </div>
                    </div>
                    {/* Total de pedidos recusados */}
                    <div className="stat-card">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon">
                                <ReactSVG src={Recusados} />
                            </div>
                            <div>
                                <div className="stat-number">{filteredRecords.filter((pedido) => pedido.status_pedido === 'Recusado').length}</div>
                                <div className="stat-label">Recusados</div>
                            </div>
                        </div>
                    </div>

                    {/* Faturamento total */}
                    <div className="stat-card">
                        <div className="d-flex align-items-center">
                            <div className="stat-icon">
                                <ReactSVG src={Faturamento} />
                            </div>
                            <div>
                                <div className="stat-number">R$ {faturamentoAtual.toFixed(2).replace('.', ',')}</div>
                                <div className="stat-label">Faturamento de Pedidos Finalizados</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="line-3">
                    <div className=" mx-2 me-4 mt-4 mb-4">
                        <LineChartComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}
