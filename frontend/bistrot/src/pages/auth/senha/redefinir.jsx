import { useState } from "react";
import { MdAttachEmail } from "react-icons/md";
import axios from 'axios';
import logo from '../../../assets/logoCadastro.svg';
import './senha.css';
import { useNavigate } from "react-router-dom"; 

function Redefinir() {
  const [senha, setSenha] = useState('');
  const email = localStorage.getItem('userEmail');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.put('http://localhost:6969/nova-senha', { email, novaSenha: senha });
  
      if (response.status === 200) { 
        const data = response.data; 
        console.log(data);
        navigate("/login");
      } else {
        console.error('Erro ao redefinir senha');
      }
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
    }
  };

  return (
    <div className="container-fluid d-flex flex-column align-items-center justify-content-start bg-white mx-0">
      <div className="d-flex flex-column align-items-center mb-3 mt-5">
        <img src={logo} alt="Logo de cadastro" className="img-fluid no-select mb-3 mt-5" />
        <h3 className="text-center">Nova senha</h3>
        <p>Insira sua senha nova para entrar</p>
      </div>
      
      <form onSubmit={handleSubmit} className="w-100">
        <div className="input-group">
          <MdAttachEmail className="email-icon" />
          <input
            type="password"
            placeholder="Nova Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="input-email"
            style={{ backgroundColor: '#F5F5F5' }}
          />
        </div>

        <div className="text-center mt-3">
          <button type="submit" className="btn btn-primary mt-3">
            Enviar Nova Senha
          </button>
        </div>
      </form>
    </div>
  );
}

export default Redefinir;
