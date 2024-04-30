import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FaMoneyBill } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import './finalizar.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

function Finalizar() {
  const [endereco, setEndereco] = useState({});
  const [entregaCasa, setEntregaCasa] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [horaPedido, setHoraPedido] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const usuarioId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  const taxaFrete = 5;
  const total = subtotal + taxaFrete;

  useEffect(() => {
    const carrinhoProdutos = localStorage.getItem(`carrinhoProdutos_${usuarioId}`);
    if (carrinhoProdutos) {
      const produtos = JSON.parse(carrinhoProdutos);
      const subtotalCalculado = produtos.reduce((acc, item) => {
        const { produto, quantidade } = item;
        return acc + (produto.preco * quantidade);
      }, 0);
      setSubtotal(subtotalCalculado);
      setProdutos(produtos);
    }

    axios.get('http://localhost:6969/endereco', { withCredentials: true })
      .then(res => {
        if (res.data.Status === 'Sucesso!') {
          setEndereco(res.data);
        } else {
          console.error('Erro ao carregar perfil:', res.data.Error);
        }
      })
      .catch(err => {
        console.log('Erro na requisição:', err);
      });
  }, [usuarioId]);

  const handleFinalizarPedido = () => {
    const data = new Date();
    const dataAtual = data.toISOString().slice(0, 10);
    const horaAtual = `${data.getHours()}:${data.getMinutes()}`;
    setHoraPedido(horaAtual);
    
    const produtosParaEnviar = produtos.map(({ produto, quantidade }) => ({
      nome: produto.nome,
      quantidade
    }));

    axios.post('http://localhost:6969/finalizar', {
      withCredentials: true,
      entregaCasa,
      formaPagamento,
      horaPedido,
      total,
      dataAtual,
      usuarioId,
      produtos: produtosParaEnviar,
      userName,
    })
      .then(res => {
        console.log(res.data);
        Swal.fire({
          icon: 'success',
          title: 'Pedido Finalizado!',
          text: 'Seu pedido foi finalizado com sucesso.',
          confirmButtonText: 'OK'
        });
      })
      .catch(err => {
        console.error('Erro ao finalizar pedido:', err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Erro ao finalizar o pedido. Por favor, tente novamente mais tarde.',
          confirmButtonText: 'OK'
        });
      });
  };

  const handleEntregaCasaChange = (value) => {
    setEntregaCasa(value);
    // Reset forma de entrega oposta quando uma é selecionada
    if (value === 'retirar') {
      setFormaPagamento('');
    }
  };

  const handleFormaPagamentoChange = (value) => {
    setFormaPagamento(value);
  };

  return (
    <div className="finalizar container-flex d-flex flex-column mx-3">
      <div className='header d-flex mt-4 mb-2'>
        <Link to='/'>
          <button className='btn border-0'>
            <IoIosArrowBack size={30} />
          </button>
        </Link>
        <h1 className='ms-1 mb-2'>Finalizar</h1>
      </div>

      <div className='endereco'>
        <div className='endereco-info'>
          <p className='mx-2'>Selecione a forma de entrega</p>
          <button className='add-endereco mx-1'><Link to='/novoendereco' style={{ textDecoration: 'none', color: 'white' }}>Novo endereço</Link></button>
        </div>
        <div>
          <div className="outras-informacoes">
            <div className='estabelecimento'>
              <h5>Retirar no estabelecimento:</h5>
              <div className="checkbox-container">
                <p className="info-estabelecimento">Avenida Prefeito Francisco Lummertz Júnior, 612, Sombrio - SC </p>
                <input type="radio" className="checkbox" checked={entregaCasa === 'retirar'} onChange={() => handleEntregaCasaChange('retirar')} />
              </div>
            </div>
            {endereco?.rua && endereco?.casa && endereco?.bairro && (
              <div className='entrega-casa'>
                <h5>Entregar no endereço:</h5>
                <div className="checkbox-container">
                  <p className="info-estabelecimento">
                    {endereco.rua}, {endereco.casa}, {endereco.bairro} {endereco.complemento}
                  </p>
                  <input type="radio" className="checkbox" checked={entregaCasa === 'entregar'} onChange={() => handleEntregaCasaChange('entregar')} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='forma-pagamento'>
        <div className='endereco-info'>
          <p className='mx-2'>Selecione a forma de pagamento</p>
        </div>
        <div>
          <div className="outras-informacoes-pagamento">
            <div className="checkbox-container">
              <FaMoneyBill size={25} />
              <p className="info-pagamento">Dinheiro</p>
              <input type="radio" className="checkbox" checked={formaPagamento === 'dinheiro'} onChange={() => handleFormaPagamentoChange('dinheiro')} />
            </div>
            <div className="linha-separadora"></div>
            <div className="checkbox-container">
              <FaRegCreditCard size={25} />
              <p className="info-pagamento">Cartão</p>
              <input type="radio" className="checkbox" checked={formaPagamento === 'cartão'} onChange={() => handleFormaPagamentoChange('cartão')} />
            </div>
          </div>
        </div>
      </div>

      <div className='preco mt-4 mx-1'>
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

      <div className='finalizar-enviar mt-4'>
        <button className='btn btn-danger w-100 mb-4' onClick={handleFinalizarPedido}>Finalizar</button>
      </div>
    </div>
  );
}

export default Finalizar;
