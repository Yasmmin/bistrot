import { useState, useEffect } from "react";
import Circle from "./circle";
import axios from 'axios';
import './progressbar.css';

function Progressbar() {
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
            const numeroPedido = localStorage.getItem('numeroPedido');
            await axios.put(`http://localhost:6969/pedidos/${numeroPedido}/status`, { novoStatus: "Entregue" });
            setActive(4); 
        } catch (error) {
            console.error('Erro ao atualizar status do pedido:', error);
        }
    };

    useEffect(() => {
        const fetchOrderStatus = async () => {
            try {
                const numeroPedido = localStorage.getItem('numeroPedido');
                const response = await axios.get(`http://localhost:6969/pedidos/${numeroPedido}/status`);
                const status = response.data.status;

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
                console.error('Erro ao buscar status do pedido:', error);
            }
        };

        fetchOrderStatus();
    }, []);

    useEffect(() => {
        setHeight((80 / (circle - 1)) * (active - 1));
    }, [circle, active]);

    const formaEntrega = localStorage.getItem('formaEntrega');
    const isRetirada = formaEntrega === 'Retirar';

    return (
        <div className="container w-100 ms-3">
            <div className="content-bar">
                <div className="progressBar">
                    <div className="progress" style={{ height: height + "%", background: '#1BAC4B' }}></div>
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
                <div >
                    <p className="mb-0 mt-3" style={{ fontWeight: 'bolder', fontSize: '13pt' }}>Tudo certo com o seu pedido?</p>
                    <p style={{ fontSize: '11pt' }}>Confirme assim que receber ou retirar o pedidos e nos ajude a saber se deu tudo certo</p>
                </div>
                <div className="button-confirmar-variavel">
                    {active === circle ? (
                        isRetirada ? (
                            <button
                                className="button-confirmar confirm-button-green"
                                onClick={handleConfirmarClick}
                            >
                                Confirmar retirada
                            </button>
                        ) : (
                            <button
                                className="button-confirmar confirm-button-green"
                                onClick={handleConfirmarClick}
                            >
                                Confirmar
                            </button>
                        )
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
