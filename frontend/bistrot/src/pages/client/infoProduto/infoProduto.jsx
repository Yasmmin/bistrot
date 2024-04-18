//dependencias do projeto
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from 'sweetalert2';

//icones
import { IoIosArrowBack } from 'react-icons/io';

//arquivos
import Loading from "../../../components/loading/loading";
import SemPermissao from "../../../components/permissão/semPermissao";
import './style.css';

function InfoProduto({ userId }) {
    const { id } = useParams();
    const [auth, setAuth] = useState(false);
    const [produto, setProduto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [observacao, setObservacao] = useState("");
    const [contadorCaracteres, setContadorCaracteres] = useState(0);
    const [quantidade, setQuantidade] = useState(1);
    const [precoTotal, setPrecoTotal] = useState(0);
    const [carrinhoProdutos, setCarrinhoProdutos] = useState([]);

    useEffect(() => {
        const fetchProduto = async () => {
            try {
                const res = await axios.get(`http://localhost:6969/produtos/${id}`, { withCredentials: true });
                setProduto(res.data);
                setAuth(true);
            } catch (err) {
                console.error("Erro ao carregar produto:", err);
                setAuth(false);
            } finally {
                setLoading(false);
            }
        };
        fetchProduto();
    }, [id]);

    useEffect(() => {
        const storedCarrinhoProdutos = JSON.parse(localStorage.getItem(`carrinhoProdutos_${userId}`)) || [];
        setCarrinhoProdutos(storedCarrinhoProdutos);
    }, [userId]);

    const handleObservacaoChange = (event) => {
        const textoObservacao = event.target.value;
        if (textoObservacao.length <= 100) {
            setObservacao(textoObservacao);
            setContadorCaracteres(textoObservacao.length);
        }
    };

    const add = () => {
        setQuantidade(quantidade + 1);
    };

    const remove = () => {
        if (quantidade > 1) {
            setQuantidade(quantidade - 1);
        }
    };

    const adicionarProdutoAoCarrinho = () => {
        const userIdLocalStorage = localStorage.getItem('userId');
    
        if (!userIdLocalStorage) {
            // Tratar o caso em que o usuário não está autenticado
            Swal.fire({
                icon: 'error',
                text: 'Faça login para adicionar produtos ao carrinho!',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancelar',
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = '/login';
                }
            });
            return;
        }
    
        if (!produto) {
            console.error('Erro: Produto não selecionado.');
            return;
        }
    
        const precoTotalCalculado = produto.preco * quantidade;
        const produtoExistenteIndex = carrinhoProdutos.findIndex(item => item.produto.id === produto.id);
    
        if (produtoExistenteIndex !== -1) {
            const novoCarrinho = [...carrinhoProdutos];
            novoCarrinho[produtoExistenteIndex].quantidade += quantidade;
            novoCarrinho[produtoExistenteIndex].precoTotal += precoTotalCalculado;
            setCarrinhoProdutos(novoCarrinho);
            localStorage.setItem(`carrinhoProdutos_${userIdLocalStorage}`, JSON.stringify(novoCarrinho));
        } else {
            const produtoAdicionado = { produto: produto, quantidade: quantidade, precoTotal: precoTotalCalculado };
            const novoCarrinho = [...carrinhoProdutos, produtoAdicionado];
            setCarrinhoProdutos(novoCarrinho);
            localStorage.setItem(`carrinhoProdutos_${userIdLocalStorage}`, JSON.stringify(novoCarrinho));
        }
        // Exibir animação de sucesso
        Swal.fire({
            icon: 'success',
            text: 'Produto adicionado ao carrinho!',
            showConfirmButton: false,
            timer: 1500,
        });
    };
    
    useEffect(() => {
        setPrecoTotal(produto ? produto.preco * quantidade : 0);
    }, [quantidade, produto]);

    return (
        <div>
            {loading ? (
                <Loading message="Carregando produto..." />
            ) : auth ? (
                <div className="produto-detalhes">
                    <img
                        src={`http://localhost:6969/files/${produto.foto}`}
                        alt={produto.nome}
                        className="detalhe-foto"
                    />
                    <Link to="/" className="btn btn-voltar">
                        <IoIosArrowBack size={39} className="icon" />
                    </Link>
                    <div className="detalhes-info mx-3">
                        <p className="detalhe-categoria mt-4">{produto.categoria}</p>
                        <h1 className="detalhe-nome">{produto.nome}</h1>
                        <p className="detalhe-descricao mb-4">{produto.descricao}</p>
                        <hr />
                        <h2 style={{ fontWeight: 'bold' }}>Restrição alérgica </h2>
                        <ul className="mb-4">
                            <li className="detalhe-restricao">{produto.restricaoalergica}</li>
                        </ul>
                        <hr />
                        <h2 className="detalhe-preco mb-4">R$ {produto.preco}</h2>
                        <div className="observacao-container mx-1">
                            <h4 style={{ fontWeight: 'bold', marginRight: '10px' }}>Alguma observação?</h4>
                            <span className="contar-caracteres">{contadorCaracteres}/100</span>
                        </div>
                        <textarea
                            type="text"
                            placeholder="Ex: Tire a cebola, adicione maionese..."
                            className="obs"
                            value={observacao}
                            onChange={handleObservacaoChange}
                        />
                    </div>
                    <div className="tab-preco mb-3">
                        <div className="contador">
                            {quantidade > 1 && (
                                <button onClick={remove} className="remove">-</button>
                            )}
                            <span className="quantidade">{quantidade}</span>
                            <button onClick={add} className="add">+</button>
                        </div>
                        <div className="add-carrinho">
                            <button onClick={adicionarProdutoAoCarrinho} className="adicionar">
                                <span>Adicionar</span>
                                <span>{precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <SemPermissao message="Você não tem permissão para visualizar este produto. Por favor, faça login." />
            )}
        </div>
    );
}

InfoProduto.propTypes = {
    userId: PropTypes.string.isRequired
};

export default InfoProduto;
