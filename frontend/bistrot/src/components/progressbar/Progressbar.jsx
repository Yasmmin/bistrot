import { useState, useEffect } from 'react';
import axios from 'axios';
import Circle from './circle';
import './progressbar.css';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';

function Progressbar() {
    const { numeroPedido } = useParams();
    const [active, setActive] = useState(1);
    const [height, setHeight] = useState(0);
    const circle = 5;
    const navigate = useNavigate();

    const stepsText = [
        "Pedido criado e sendo analisado",
        "Pedido aceito e sendo preparado",
        "Pedido finalizado",
        "Saindo para entrega",
        "Pedido entregue ou retirado"
    ];

    const handleConfirmarClick = async () => {
        try {
            const formaEntrega = localStorage.getItem('formaEntrega');
            const novoStatus = formaEntrega === 'Retirar' ? 'Retirado' : 'Entregue';
            await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus });
            setActive(5);

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
                const response = await axios.get(`http://localhost:6969/pedidos/${numeroPedido}/status`);
                const status = response.data.status;

                if (status.toLowerCase() === "recusado") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Pedido Cancelado',
                        text: 'O seu pedido foi recusado.',
                        showConfirmButton: false,
                        timer: 2000
                    }).then(() => {
                        navigate('/pedidosanteriores'); 
                    });
                } else {
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
                        case "Saindo para entrega":
                            setActive(4);
                            break;
                        case "Entregue":
                        case "Retirado":
                            setActive(5);
                            break;
                        default:
                            setActive(1);
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar status do pedido:', error.message);
            }
        };

        if (numeroPedido) {
            fetchOrderStatus();
            const intervalId = setInterval(fetchOrderStatus, 1000);

            return () => clearInterval(intervalId);
        }
    }, [numeroPedido, navigate]);

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
                            (isRetirada && index === 3) ? null : ( // Omitir o quarto círculo se for retirada
                            <div key={index} className="circleWithText">
                                <Circle
                                    className={index + 1 <= active ? "circle active" : "circle"}
                                    onClick={() => setActive(index + 1)}
                                >
                                    {index + 1}
                                </Circle>
                                <div className="text">
                                    {isRetirada && index === 4 ? "Pedido retirado" : stepsText[index]}
                                </div>
                            </div>
                            )
                        ))}
                    </div>
                </div>
                <div>
                    <p className="mb-0 mt-3" style={{ fontWeight: 'bolder', fontSize: '13pt' }}>Tudo certo com o seu pedido?</p>
                    <p style={{ fontSize: '11pt' }}>Confirme assim que receber ou retirar o pedido e nos ajude a saber se deu tudo certo</p>
                </div>
                <div className="button-confirmar-variavel">
                    {(isRetirada && active >= 3) || (!isRetirada && active >= 4) ? (
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
