import Sidebar from "../../../components/sidebar/sidebar";
import './pedidos.css';
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from 'react-bootstrap';
//icones análise
import { CiClock2 } from "react-icons/ci";
import { LuRefreshCcw } from "react-icons/lu";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Pedidos() {
    const [records, setRecords] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handleShowModal = (pedido) => {
        setModalData(pedido);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setModalData(null);
        setShowModal(false);
    };

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const res = await axios.get("http://localhost:6969/pedidos");
                const formattedRecords = res.data.map(pedido => ({
                    ...pedido,
                    produtos: JSON.parse(pedido.produtos),
                }));

                if (formattedRecords.length > records.length) {
                    console.log('Novo pedido recebido, tentando tocar som...');
                    const audio = new Audio('./../../../assets/som1.wav');
                    audio.play().catch(err => console.error('Erro ao tocar o som:', err));
                    toast.info("Novo pedido recebido!");
                    setRecords(formattedRecords);


                } else {
                    setRecords(formattedRecords);
                }
            } catch (err) {
                console.error(err);
            }
        };
        // Configurar intervalo para verificar novos pedidos
        const intervalId = setInterval(fetchPedido, 1000);

        return () => clearInterval(intervalId);
    }, [records]);


    function formatarTroco(valor) {
        // Se o valor do troco for 0, retornar 'Sem troco'
        if (valor === 'Sem troco') {
            return 'Sem troco';
        }
        return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    async function handleAceitarPedido(numeroPedido) {
        try {
            await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus: "Em produção" });
            const novoRecords = records.map(pedido => {
                if (pedido.numero_pedido === numeroPedido) {
                    return { ...pedido, status_pedido: "Em produção" };
                }
                return pedido;
            });
            setRecords(novoRecords);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleRecusar(numeroPedido) {
        try {
            await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus: "Recusado" });

            const novoRecords = records.filter(pedido => pedido.numero_pedido !== numeroPedido);
            setRecords(novoRecords);
        } catch (err) {
            console.error(err);
        }
    }
    async function handleFinalizarPedido(numeroPedido) {
        try {
            const pedido = records.find(pedido => pedido.numero_pedido === numeroPedido);
            if (pedido.forma_entrega === "Retirar") {
                await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus: "Finalizado" });
                const novoRecords = records.filter(pedido => pedido.numero_pedido !== numeroPedido);
                setRecords(novoRecords);
            } else {
                await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus: "Finalizado" });
                const novoRecords = records.map(pedido => {
                    if (pedido.numero_pedido === numeroPedido) {
                        return { ...pedido, status_pedido: "Finalizado" };
                    }
                    return pedido;
                });
                setRecords(novoRecords);
            }
        } catch (err) {
            console.error(err);
        }
    }

    async function handleEntrega(numeroPedido) {
        try {
            await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus: "Saindo para entrega" });

            const novoRecords = records.filter(pedido => pedido.numero_pedido !== numeroPedido);
            setRecords(novoRecords);
        } catch (err) {
            console.error(err);
        }
    }

    function formatarHora(horaString) {
        const [horas, minutos] = horaString.split(':');
        return `${horas}:${minutos}`;
    }

    return (
        <div className="pedidos-body d-flex">
            <Sidebar />
            <div className="content flex-grow-1">
                <div className="search-pedido mb-2 ">
                    <form className="d-flex mx-auto mt-3 mb-0" style={{ width: '99%' }}>
                        <div className="input-group">
                            <input
                                className="form-control "
                                type="search"
                                placeholder="Pesquisar por produto, nº pedido, cliente.."
                                style={{ height: "3rem" }}
                            />
                        </div>
                    </form>
                </div>

                <div className="container-flex text-center ">
                    <div className="row">
                        <div className="analise col ">
                            <div className="titulo d-flex justify-content-between">
                                <h4>Em análise</h4>
                                <h4 className="me-4">{records.filter(pedido => pedido.status_pedido === 'Em análise').length}</h4>
                            </div>
                            {records.filter(pedido => pedido.status_pedido === 'Em análise').map((pedido, index) => (
                                <div className="conteudo" key={index}>
                                    <div className="d-flex justify-content-between mx-2">
                                        <div className="d-flex align-items-center">

                                            <button
                                                className="button-info-pedido"
                                                onClick={() => handleShowModal(pedido)}
                                            >
                                                <span><CiClock2 className="me-2" /> Pedido #{pedido.numero_pedido}</span>
                                            </button>
                                            <Modal show={showModal} onHide={handleCloseModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Detalhes do Pedido #{modalData?.numero_pedido}</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    {modalData && (
                                                        <div>
                                                            <p><b>Cliente:</b> {modalData.nome_cliente}</p>
                                                            <p><b>Email:</b> {modalData.email}</p>
                                                            <p><b>Forma de Entrega:</b> {modalData.forma_entrega}</p>
                                                            <p><b>observações:</b> {modalData.obs}</p>
                                                            {modalData.forma_entrega === "Entregar" && (
                                                                <p><b>Endereço:</b> {modalData.bairro}, {modalData.rua}, {modalData.casa}</p>
                                                            )}
                                                            <p><b>Produtos:</b></p>
                                                            <ul>
                                                                {modalData.produtos.map((produto, index) => (
                                                                    <li key={index}>{produto.quantidade}x {produto.nome}</li>
                                                                ))}
                                                            </ul>
                                                            <p><b>Total:</b> {Number(modalData.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                                        </div>
                                                    )}
                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleCloseModal}>
                                                        Fechar
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>

                                        </div>
                                        <span><CiClock2 size={20} />{formatarHora(pedido.hora_pedido)} </span>
                                    </div>
                                    <hr className="mx-auto mt-1" style={{ width: '95%' }} />

                                    {/*sessão de informações do pedido*/}
                                    <div className="info-pedido row mt-1">
                                        <div className="info-produtos-pedido col-6 ">
                                            {pedido.produtos.map((produto, index) => (
                                                <p key={index} className="ms-3 text-start mb-0">{produto.quantidade}x {produto.nome} </p>
                                            ))}
                                        </div>
                                        <div className="info-cliente-pedido col-6 text-start ">
                                            <p><b>Pagamento:</b> {pedido.forma_pagamento}</p>
                                            <p><b>Cliente:</b> {pedido.nome_cliente}</p>
                                            <p><b>Email:</b> {pedido.email}</p>

                                            {pedido.forma_pagamento === "dinheiro" && (
                                                <p><b>Troco:</b> {formatarTroco(pedido.troco)}</p>
                                            )}

                                        </div>
                                    </div>
                                    <hr className="mx-auto mb-2" style={{ width: '95%' }} />
                                    <div className="info-endereco-pedido text-start ms-3">
                                        <p className="mb-0"><b>Forma de entrega:</b> {pedido.forma_entrega}</p>
                                        {pedido.forma_entrega === "Entregar" && (
                                            <p className="mb-0"><b>Endereço:</b> {pedido.bairro}, {pedido.rua}, {pedido.casa}</p>
                                        )}
                                        <p><b>Total: {Number(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></p>
                                    </div>
                                    <div className="info-pedido-botoes row ">
                                        <div className="col mb-4">
                                            <button className="info-btn-recusar" onClick={() => handleRecusar(pedido.numero_pedido)}>Recusar</button>
                                        </div>
                                        <div className="col">
                                            <button className="info-btn-aceitar" onClick={() => handleAceitarPedido(pedido.numero_pedido)}>
                                                Aceitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="producao col">
                            <div className="titulo d-flex justify-content-between">
                                <h4>Em produção</h4>
                                <h4 className="me-4">{records.filter(pedido => pedido.status_pedido === 'Em produção').length}</h4>
                            </div>
                            {records.filter(pedido => pedido.status_pedido === 'Em produção').map((pedido, index) => (
                                <div className="conteudo" key={index}>
                                    <div className="d-flex justify-content-between mx-2">
                                        <div className="d-flex align-items-center">

                                            <p className="mb-0 fw-bold">Pedido #{pedido.numero_pedido}</p>
                                        </div>
                                        <span><CiClock2 size={20} />{formatarHora(pedido.hora_pedido)} </span>
                                    </div>
                                    <hr className="mx-auto mt-1" style={{ width: '95%' }} />
                                    {/*sessão de informações do pedido*/}
                                    <div className="info-pedido row mt-1">
                                        <div className="info-produtos-pedido col-6 ">
                                            {pedido.produtos.map((produto, index) => (
                                                <p key={index} className="ms-3 text-start mb-0">{produto.quantidade}x {produto.nome} </p>
                                            ))}
                                        </div>
                                        <div className="info-cliente-pedido col-6 text-start ">
                                            <p><b>Pagamento:</b> {pedido.forma_pagamento}</p>
                                            <p><b>Cliente:</b> {pedido.nome_cliente}</p>
                                            <p><b>Email:</b> {pedido.email}</p>
                                            {pedido.forma_pagamento === "dinheiro" && (
                                                <p><b>Troco:</b> {Number(pedido.troco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                            )}
                                        </div>

                                    </div>
                                    <hr className="mx-auto mb-2" style={{ width: '95%' }} />
                                    <div className="info-endereco-pedido text-start ms-3">
                                        <p className="mb-0"><b>Forma de entrega:</b> {pedido.forma_entrega}</p>
                                        {pedido.forma_entrega === "Entregar" && (
                                            <p className="mb-0"><b>Endereço:</b> {pedido.bairro}, {pedido.rua}, {pedido.casa}</p>
                                        )}
                                        <p><b>Total: {Number(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></p>
                                    </div>
                                    <div className="info-producao-botoes row ">
                                        <div className="col">
                                            <button className="info-btn-aceitar mb-3" onClick={() => handleFinalizarPedido(pedido.numero_pedido)}>
                                                <LuRefreshCcw /> Atualizar para finalizado
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="finalizado col">
                            <div className="titulo d-flex justify-content-between">
                                <h4>Finalizados</h4>
                                <h4 className="me-4">{records.filter(pedido => pedido.status_pedido === 'Finalizado').length}</h4>
                            </div>
                            {records.filter(pedido => pedido.status_pedido === 'Finalizado').map((pedido, index) => (
                                <div className="conteudo" key={index}>
                                    <div className="d-flex justify-content-between mx-2">
                                        <div className="d-flex align-items-center">

                                            <p className="mb-0 fw-bold">Pedido #{pedido.numero_pedido}</p>
                                        </div>
                                        <span><CiClock2 size={20} />{formatarHora(pedido.hora_pedido)} </span>
                                    </div>
                                    <hr className="mx-auto mt-1" style={{ width: '95%' }} />
                                    {/*sessão de informações do pedido*/}
                                    <div className="info-pedido row mt-1">
                                        <div className="info-produtos-pedido col-6 ">
                                            {pedido.produtos.map((produto, index) => (
                                                <p key={index} className="ms-3 text-start mb-0">{produto.quantidade}x {produto.nome} </p>
                                            ))}
                                        </div>
                                        <div className="info-cliente-pedido col-6 text-start ">
                                            <p><b>Pagamento:</b> {pedido.forma_pagamento}</p>
                                            <p><b>Cliente:</b> {pedido.nome_cliente}</p>
                                            <p><b>Email:</b> {pedido.email}</p>
                                        </div>
                                    </div>
                                    <hr className="mx-auto mb-2" style={{ width: '95%' }} />
                                    <div className="info-endereco-pedido text-start ms-3">
                                        <p className="mb-0"><b>Forma de entrega:</b> {pedido.forma_entrega}</p>
                                        {pedido.forma_entrega === "Entregar" && (
                                            <p className="mb-0"><b>Endereço:</b> {pedido.bairro}, {pedido.rua}, {pedido.casa}</p>
                                        )}
                                        <p><b>Total: {String(pedido.valor_total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</b></p>
                                    </div>
                                    <div className="info-producao-botoes row ">
                                        <div className="col">
                                            <button className="info-btn-aceitar mb-3" onClick={() => handleEntrega(pedido.numero_pedido)}>
                                                <LuRefreshCcw /> Atualizar para saindo para entrega
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default Pedidos;
