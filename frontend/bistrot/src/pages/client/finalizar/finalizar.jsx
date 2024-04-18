import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { FaMoneyBill } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import './finalizar.css';

function Finalizar() {
  return (
    <div className="finalizar container-flex d-flex flex-column mx-3">
      {/* Cabeçalho */}
      <div className='header d-flex align-items-center mt-4 mb-2'>
        <Link to='/'>
          <button className='btn border-0'>
            <IoIosArrowBack size={30} />
          </button>
        </Link>
        <h1 className='ms-1 mb-2'>Finalizar</h1>
      </div>


        <div className='endereco '>
          <div className='endereco-info'>
            <p className='mx-2'>Selecione a forma de entrega</p>
            <button className='add-endereco mx-1'><Link to='/novoendereco' style={{textDecoration:'none', color:'white'}}>Novo endereço</Link></button>
          </div>
          <div>
            <div className="outras-informacoes">

              <div className='estabelecimento'>
                <h5>Retirar no estabelecimento:</h5>
                <div className="checkbox-container">
                  <p className="info-estabelecimento">Avenida Prefeito Francisco Lummertz Júnior, 612, Sombrio - SC </p>
                  <input type="checkbox" className="checkbox" />
                </div>
              </div>

              <div className='entrega-casa'>
                <h5>Entregar no endereço:</h5>
                <div className="checkbox-container">
                  <p className="info-estabelecimento">Avenida Prefeito Francisco Lummertz Júnior, 612, Sombrio - SC </p>
                  <input type="checkbox" className="checkbox" />
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className='forma-pagamento '>
          <div className='endereco-info'>
            <p className='mx-2'>Selecione a forma de pagamento</p>
          </div>
          <div>
            <div className="outras-informacoes-pagamento">
              <div className="checkbox-container">
                <FaMoneyBill size={25} />
                <p className="info-pagamento">Dinheiro</p>
                <input type="checkbox" className="checkbox" />
              </div>
              <div className="linha-separadora"></div>
              <div className="checkbox-container">
                <FaRegCreditCard size={25} />
                <p className="info-pagamento">Cartão</p>
                <input type="checkbox" className="checkbox" />
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
              <p></p>
              <p></p>
              <h3>35,50</h3>
            </div>
          </div>
        </div>

        <div className='finalizar-enviar mt-4'>
          <button className='btn btn-danger w-100 mb-4'>Finalizar</button>
        </div>

      </div>

  );
}

export default Finalizar;
