import  { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar/sidebar";
import axios from "axios";

function Cliente() {
    const [cliente, setCliente] = useState([]);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const res = await axios.get("http://localhost:6969/cliente");
                setCliente(res.data);
                setCliente([...res.data]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchClientes();
    }, []);

    const pesquisar = (event) => {
        setSearchText(event.target.value);
    };

    const Clientes = cliente.filter((cliente) =>
        cliente.nome.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="content d-flex flex-column flex-grow-1 ml-2 column">
                <div className="d-flex flex-column flex-grow-1 ml-2 column">
                    <div className="d-flex justify-content-between align-items-center mt-3 mx-4">
                        <form className="d-flex w-100 ">
                            <div className="input-group">
                                <input
                                    className="form-control flex-grow-1 mr-2 mb-3"
                                    type="search"
                                    placeholder="pesquisar"
                                    style={{ height: '3rem' }}
                                    value={searchText}
                                    onChange={pesquisar}
                                />
                            </div>
                        </form>
                    </div>
                    <div className="table-responsive mx-4">
                        <table className="table table-bordered text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Foto</th>
                                    <th>Código</th>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Bairro</th>
                                    <th>Rua</th>
                                    <th>Nº da casa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Clientes.map((cliente) => (
                                    <tr key={cliente.id}>
                                        <td>{cliente.foto}</td>
                                        <td>#{cliente.id}</td>
                                        <td>{cliente.nome}</td>
                                        <td>{cliente.email}</td>
                                        <td>{cliente.bairro}</td>
                                        <td>{cliente.rua}</td>
                                        <td>{cliente.numero_casa}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cliente;
