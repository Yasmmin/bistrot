import { useState, useEffect } from "react";
import axios from "axios";
import { BsChevronExpand } from "react-icons/bs";
import Sidebar from "../../../components/sidebar/sidebar";
import "./todosOsPedidos.css";

function TodosOsPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [records, setRecords] = useState([]);
    const [orderAsc, setOrderAsc] = useState(true);
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [isFiltering, setIsFiltering] = useState(false);

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    const getStatusColor = (status) => {
        const statusColors = {
            'entregue': 'status-cor-green',
            'retirado': 'status-cor-green',
            'finalizado': 'status-cor-green',
            'saindo para entrega': 'status-cor-green',
            'recusado': 'status-cor-red',
            'expirado': 'status-cor-red',
            'em análise': 'status-cor-yellow'
        };
        return statusColors[status.toLowerCase()] || '';
    };

    const fetchPedidos = async () => {
        try {
            const res = await axios.get("http://localhost:6969/pedidos");
            const novosPedidos = res.data.map(pedido => ({
                ...pedido,
                produtos: pedido.produtos ? JSON.parse(pedido.produtos) : []
            }));
            setPedidos(novosPedidos);

            // Atualiza registros com o filtro ativo ou mantém os registros atuais
            if (!isFiltering) {
                setRecords(novosPedidos);
            } else {
                const registrosFiltrados = filtrarPedidos(novosPedidos, statusFilter);
                setRecords(registrosFiltrados);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPedidos();
        const intervalId = setInterval(fetchPedidos, 3000);
        return () => clearInterval(intervalId);
    }, [isFiltering, statusFilter]);

    const filtrarPedidos = (pedidos, searchTerm) => {
        const term = searchTerm.toLowerCase();
        if (term === 'todos') return pedidos;

        return pedidos.filter((pedido) => {
            if (['em análise', 'em processo', 'entregue', 'retirado', 'expirado'].includes(term)) {
                return pedido.status_pedido.toLowerCase() === term;
            }
            return (
                pedido.nome_cliente.toLowerCase().includes(term) ||
                pedido.numero_pedido.toString().includes(term) ||
                new Date(pedido.data).toLocaleDateString('pt-BR').includes(term) ||
                pedido.produtos.some(produto => produto.nome.toLowerCase().includes(term))
            );
        });
    };

    const filterRecords = (searchTerm) => {
        setIsFiltering(true);
        setStatusFilter(searchTerm);
        const registrosFiltrados = filtrarPedidos(pedidos, searchTerm);
        setRecords(registrosFiltrados);
    };

    const toggleOrder = () => {
        const orderedPedidos = [...records].sort((a, b) => {
            return orderAsc ? new Date(a.data) - new Date(b.data) : new Date(b.data) - new Date(a.data);
        });
        setRecords(orderedPedidos);
        setOrderAsc(!orderAsc);
    };

    return (
        <div className="allPedidos d-flex">
            <Sidebar />
            <div className="content">
                <div className="search-bar-pedidos w-100">
                    <form className="d-flex w-100 align-items-start">
                        <div className="search-section flex-grow-1 me-2">
                            <input
                                className="form-control formulario-todos mb-3"
                                type="search"
                                placeholder="Pesquise por Nº pedido, data..."
                                style={{ height: "3rem", width: "100%" }}
                                onChange={(e) => filterRecords(e.target.value)}
                            />
                        </div>
                        <div className="status-section me-4">
                            <p className="mb-0 mt-3 ms-1 fw-bold">Status</p>
                            <select
                                className="form-select drop-pedidos"
                                value={statusFilter}
                                onChange={(e) => filterRecords(e.target.value)}
                            >
                                <option value="Em análise">Em análise</option>
                                <option value="Em processo">Em processo</option>
                                <option value="Entregue">Entregue</option>
                                <option value="Retirado">Retirado</option>
                                <option value="Expirado">Expirado</option>
                                <option value="Todos">Todos</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div className="tabela-todos-pedidos me-4">
                    <div className="text-center">
                        <table className="table table-striped">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">Nº pedido</th>
                                    <th scope="col">Cliente (Id)</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">
                                        <button onClick={toggleOrder} className="btn-order">
                                            <BsChevronExpand className={orderAsc ? "rotate-up" : "rotate-down"} />
                                        </button>
                                        Data
                                    </th>
                                    <th scope="col">Produtos</th>
                                    <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">Nenhum resultado encontrado :(</td>
                                    </tr>
                                ) : (
                                    records.map((pedido) => (
                                        <tr key={pedido.numero_pedido}>
                                            <td>{pedido.numero_pedido}</td>
                                            <td>{pedido.nome_cliente} ({pedido.id_cliente})</td>
                                            <td>
                                                <span className={`status-cor ${getStatusColor(pedido.status_pedido)}`}>
                                                    {pedido.status_pedido}
                                                </span>
                                            </td>
                                            <td>{new Date(pedido.data).toLocaleDateString('pt-BR')}</td>
                                            <td>
                                                {pedido.produtos.length > 0 ? pedido.produtos.map((produto, index) => (
                                                    <span key={index}>{produto.nome}{index < pedido.produtos.length - 1 ? ', ' : ''}</span>
                                                )) : 'Produtos indisponíveis'}
                                            </td>
                                            <td>{formatCurrency(pedido.valor_total)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TodosOsPedidos;
