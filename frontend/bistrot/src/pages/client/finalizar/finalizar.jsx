import { useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link,useNavigate } from 'react-router-dom';
import { FaMoneyBill, FaRegCreditCard } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import './finalizar.css';
import { format } from 'date-fns-tz';

function Finalizar() {
  const [endereco, setEndereco] = useState({});
  const [entregaCasa, setEntregaCasa] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [horaPedido, setHoraPedido] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const usuarioId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [observacao, setObservacao] = useState("");
  const [contadorCaracteres, setContadorCaracteres] = useState(0);
  const [opcoesSelecionadas, setOpcoesSelecionadas] = useState({
    enderecoSelecionado: false,
    formaPagamentoSelecionada: false
  });
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      window.location.href = '/login';
      return;
    }
  }, []);
  const getLocalTime = () => {
    const timeZone = 'America/Sao_Paulo';
    const now = new Date();
    return format(now, 'HH:mm', { timeZone });
  };


  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const fetchCartData = async () => {
      const carrinhoProdutos = localStorage.getItem(`carrinhoProdutos_${usuarioId}`);
      if (carrinhoProdutos) {
        const produtos = JSON.parse(carrinhoProdutos);
        const subtotalCalculado = produtos.reduce((acc, { produto, quantidade }) => acc + (produto.preco * quantidade), 0);
        setSubtotal(subtotalCalculado);
        setProdutos(produtos);
      }

      try {
        const res = await axios.get('http://localhost:6969/endereco');
        if (res.data.Status === 'Sucesso!') {
          setEndereco(res.data);
        } else {
          console.error('Erro ao carregar:', res.data.Error);
        }
      } catch (err) {
        console.log('Erro na requisição:', err);
      }
    };

    fetchCartData();
  }, [usuarioId]);

  const handleEntregaCasaChange = (value) => {
    setEntregaCasa(value);
    setOpcoesSelecionadas({
      ...opcoesSelecionadas,
      enderecoSelecionado: value !== '',
      formaPagamentoSelecionada: formaPagamento !== ''
    });
    if (value === 'Retirar') {
      setFormaPagamento('');
    }
  };

  const handleFormaPagamentoChange = (value) => {
    setFormaPagamento(value);
    setOpcoesSelecionadas({
      ...opcoesSelecionadas,
      enderecoSelecionado: entregaCasa !== '',
      formaPagamentoSelecionada: value !== ''
    });
  };

  const taxaFrete = entregaCasa === 'Entregar' ? 5 : 0;
  const total = subtotal + taxaFrete;

  const handleFinalizarPedido = async () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('userId');

    if (!token || !usuarioId) {
      navigate('/login');
      return;
    }

    if (entregaCasa === '' || formaPagamento === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Oops...',
        text: 'Por favor, selecione uma forma de entrega e uma forma de pagamento.',
        confirmButtonText: 'OK',
      });
      return;
    }

    const data = new Date();
    const dataAtual = data.toISOString().slice(0, 10);
    const horaAtual = getLocalTime();
    console.log(horaAtual);
    setHoraPedido(horaAtual);

    const produtosParaEnviar = produtos.map(({ produto, quantidade }) => ({
      nome: produto.nome,
      quantidade,
    }));

    try {
      const res = await axios.post('http://localhost:6969/finalizar', {
        entregaCasa,
        formaPagamento,
        horaAtual,
        total,
        dataAtual,
        usuarioId,
        produtos: produtosParaEnviar,
        userName,
        observacao,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      localStorage.removeItem(`carrinhoProdutos_${usuarioId}`);
      const numeroPedido = res.data.numero_pedido;
      localStorage.setItem('numeroPedido', numeroPedido);
      localStorage.setItem('formaEntrega', entregaCasa);
      console.log(res.data);
      Swal.fire({
        icon: 'success',
        title: 'Pedido Finalizado!',
        text: 'Seu pedido foi finalizado com sucesso.',
        confirmButtonText: 'OK',
      });
       navigate('/acompanhar'); 
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Erro ao finalizar o pedido. Por favor, tente novamente mais tarde.',
        confirmButtonText: 'OK',
      });
    }
  };
  const handleObservacaoChange = (event) => {
    const textoObservacao = event.target.value;
    if (textoObservacao.length <= 100) {
      setObservacao(textoObservacao);
      setContadorCaracteres(textoObservacao.length);
    }
  };
 

  return (
    <div className="finalizar container-flex mx-3 ">
      <div className="header mt-4 mb-2">
        <div className="d-flex align-items-center">
          <Link to="/">
            <button className="btn border-0">
              <IoIosArrowBack size={30} />
            </button>
          </Link>
          <h1 className="ms-1 mb-0">Finalizar</h1>
        </div>
      </div>

      <div className="conteudo  mx-auto">
        <div className="endereco">
          <div className="endereco-info">
            <p className="mx-2 mt-2">Selecione a forma de entrega</p>
            <button className="add-endereco mx-1">
              <Link to="/novoendereco" style={{ textDecoration: 'none', color: 'white' }}>Novo endereço</Link>
            </button>
          </div>

          <div className="outras-informacoes mt-4">
            <div className="estabelecimento">
              <h5>Retirar no estabelecimento:</h5>
              <div className="checkbox-container">
                <p className="info-estabelecimento">Avenida Prefeito Francisco Lummertz Júnior, 612, Sombrio - SC</p>
                <input type="radio" className="checkbox" checked={entregaCasa === 'Retirar'} onChange={() => handleEntregaCasaChange('Retirar')} />
              </div>
            </div>

            {endereco.rua && (
              <div className="entrega-casa mt-3">
                <h5>Entregar no endereço:</h5>
                <div className="checkbox-container">
                  <p className="info-estabelecimento">
                    {endereco.rua}, {endereco.casa}, {endereco.bairro} {endereco.complemento}
                  </p>
                  <input type="radio" className="checkbox" checked={entregaCasa === 'Entregar'} onChange={() => handleEntregaCasaChange('Entregar')} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="forma-pagamento mt-4">
          <div className="endereco-info">
            <p className="mx-2 mb-0">Selecione a forma de pagamento</p>
          </div>
          <div className="outras-informacoes-pagamento">
            <div className="checkbox-container">
              <p className="info-pagamento">
                <FaMoneyBill size={25} style={{ marginRight: '5px' }} />Dinheiro
              </p>
              <input type="radio" className="checkbox" checked={formaPagamento === 'dinheiro'} onChange={() => handleFormaPagamentoChange('dinheiro')} />
            </div>

            <div className="linha-separadora mt-2 mb-2"></div>

            <div className="checkbox-container">
              <p className="info-pagamento">
                <FaRegCreditCard size={25} style={{ marginRight: '5px' }} />Cartão
              </p>
              <input type="radio" className="checkbox" checked={formaPagamento === 'cartão'} onChange={() => handleFormaPagamentoChange('cartão')} />
            </div>
          </div>
        </div>

        <div className="info-obs mt-4">
          <div className="endereco-info">
            <p className="mx-2 mb-0">Alguma observação?</p>
          </div>
          <div className="outras-informacoes-obs">
            <div className="container-obs">
              <div className="textarea-wrapper">
                <textarea
                  type="text"
                  placeholder="Ex: Tire a cebola, adicione maionese..."
                  className="obs-finalizar"
                  value={observacao}
                  onChange={handleObservacaoChange}
                />
                <span className="contar-caracteres">{contadorCaracteres}/100</span>
              </div>
            </div>
          </div>
        </div>

        <div className="preco mt-4">
          <div className="row">
            <div className="col">
              <p>Subtotal</p>
              <p>Taxa de entrega</p>
              <h3>Total</h3>
            </div>
            <div className="col text-end">
              <p>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <p>{taxaFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
              <h3>{total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</h3>
            </div>
          </div>
        </div>

        <div className="finalizar-enviar mt-4">
          <button className="btn btn-danger w-100 mb-4" onClick={handleFinalizarPedido} disabled={!opcoesSelecionadas.enderecoSelecionado || !opcoesSelecionadas.formaPagamentoSelecionada}>Finalizar</button>
        </div>
      </div>
    </div>
  );
}

export default Finalizar;
