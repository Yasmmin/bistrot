import { useState, useEffect } from 'react';
import axios from 'axios';
import Circle from './circle';
import './progressbar.css';
import Swal from 'sweetalert2';
import { useParams } from 'react-router-dom'; 
function Progressbar() {
    const { numeroPedido } = useParams(); 
    const [active, setActive] = useState(1);
    const [height, setHeight] = useState(0);
    const circle = 4;

    const stepsText = [
        "Pedido criado e sendo analisado",
        "Pedido aceito e sendo preparado",
        "Pedido finalizado",
        "Pedido retirado"
    ];

    const handleConfirmarClick = async () => {
        try {
            console.log('Botão clicado');
            const formaEntrega = localStorage.getItem('formaEntrega');
            const novoStatus = formaEntrega === 'Retirar' ? 'Retirado' : 'Entregue';
            await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus });
            setActive(4);

            if (novoStatus === "Entregue" || novoStatus === "Retirado") {
                localStorage.removeItem('formaEntrega');

                Swal.fire({
                    icon: 'success',
                    title: 'Pedido confirmado com sucesso!',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = "/";
                });
            }
        } catch (error) {
            console.error('Erro ao atualizar status do pedido:', error.message);
        }
    };

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                console.log('Número do Pedido:', numeroPedido);
                const response = await axios.get(`http://localhost:6969/pedidos/${numeroPedido}/status`);
                console.log('Resposta da API:', response.data);
                const status = response.data.status;
                console.log('Status do Pedido:', status);

                switch (status) {
                    case "Em análise":
                        setActive(1);
                        break;
                    case "Em produção":
                        setActive(2);
                        break;
                    case "Finalizado":
                        setActive(3);
                        break;
                    case "Entregue":
                        setActive(4);
                        break;
                    default:
                        setActive(1);
                }
            } catch (error) {
                console.error('Erro ao buscar status do pedido:', error.message);
            }
        };

        if (numeroPedido) {
            fetchOrderStatus();
        }
    }, [numeroPedido]);

    useEffect(() => {
        setHeight((80 / (circle - 1)) * (active - 1));
    }, [circle, active]);

    const formaEntrega = localStorage.getItem('formaEntrega');
    const isRetirada = formaEntrega === 'Retirar';

    return (
        <div className="container">
            <div className="content-bar">
                <div className="progressBar">
                    <div className="progress" style={{ height: `${height}%`, background: '#1BAC4B' }}></div>
                    <div className="circleContainer">
                        {[...Array(circle).keys()].map((index) => (
                            <div key={index} className="circleWithText">
                                <Circle
                                    className={index + 1 <= active ? "circle active" : "circle"}
                                    onClick={() => setActive(index + 1)}
                                >
                                    {index + 1}
                                </Circle>
                                <div className="text">
                                    {isRetirada && index === 3 ? "Pedido retirado" : stepsText[index]}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <p className="mb-0 mt-3" style={{ fontWeight: 'bolder', fontSize: '13pt' }}>Tudo certo com o seu pedido?</p>
                    <p style={{ fontSize: '11pt' }}>Confirme assim que receber ou retirar o pedido e nos ajude a saber se deu tudo certo</p>
                </div>
                <div className="button-confirmar-variavel">
                    {active >= 3 ? (
                        <button
                            className="button-confirmar confirm-button-green"
                            onClick={handleConfirmarClick}
                        >
                            Confirmar
                        </button>
                    ) : (
                        <button
                            className="button-confirmar confirm-button-gray"
                            disabled
                        >
                            Confirmar
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Progressbar;
