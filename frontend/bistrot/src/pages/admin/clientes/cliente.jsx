import { useState, useEffect } from "react";
import axios from "axios";
import { BsChevronExpand } from "react-icons/bs";
import Sidebar from "../../../components/sidebar/sidebar";
import "./cliente.css";

function Cliente() {
    const [cliente, setCliente] = useState([]);
    const [records, setRecords] = useState([]);
    const [orderAsc, setOrderAsc] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const res = await axios.get("http://localhost:6969/cliente");
                setCliente(res.data);
                setRecords(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCliente();
    }, []);

    useEffect(() => {
        const filterRecords = (term) => {
            if (!term) {
                setRecords(cliente);
                return;
            }
            const filtroCliente = cliente.filter((cliente) => {
                const combinedString = `${cliente.id} ${cliente.nome} ${cliente.email} ${cliente.bairro} ${cliente.rua} ${cliente.casa}`.toLowerCase();
                return combinedString.includes(term.toLowerCase());
            });
            setRecords(filtroCliente);
        };

        filterRecords(searchTerm);
    }, [searchTerm, cliente]);

    const toggleOrderCliente = (e) => {
        e.preventDefault();
        const orderedCliente = [...records].sort((a, b) => {
            return orderAsc ? a.id - b.id : b.id - a.id;
        });
        setRecords(orderedCliente);
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
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <div className="tabela-todos-pedidos me-4">
                    <div className="text-center">
                        <table className="table table-striped">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">
                                        <button onClick={toggleOrderCliente} className="btn-order-cliente">
                                            <BsChevronExpand className={orderAsc ? "rotate-up" : "rotate-down"} />
                                        </button>
                                        Id
                                    </th>
                                    <th scope="col">Nome</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Bairro</th>
                                    <th scope="col">Rua</th>
                                    <th scope="col">Nº casa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.length === 0 ? (
                                    <tr>
                                        <td colSpan="6">Nenhum resultado encontrado :(</td>
                                    </tr>
                                ) : (
                                    records.map((cliente) => (
                                        <tr key={cliente.id}>
                                            <td>{cliente.id}</td>
                                            <td>{cliente.nome}</td>
                                            <td>{cliente.email}</td>
                                            <td>{cliente.bairro}</td>
                                            <td>{cliente.rua}</td>
                                            <td>{cliente.casa}</td>
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

export default Cliente;
