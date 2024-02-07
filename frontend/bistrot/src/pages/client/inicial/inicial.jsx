import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


function Inicial() {
  // Estado para controlar a autenticação
  const [auth, setAuth] = useState(false);

  // Estado para armazenar mensagens
  const [mensagem, setMensagem] = useState("");

  // Estado para armazenar o nome do usuário autenticado
  const [nome, setNome] = useState("");

  // Configurando o Axios para incluir cookies nas solicitações
  axios.defaults.withCredentials = true;

  // Verificar a autenticação ao carregar o componente
  useEffect(() => {
    axios.get("http://localhost:8081")
      .then(res => {
        if (res.data.Status === "Sucesso!") {
          setAuth(true);
          setNome(res.data.nome);
        } else {
          setAuth(false);
          setMensagem(res.data.Error);
        }
      })
      .catch(err => console.log(err));
  }, []);

  // Função para realizar o logout
  const handleLogout = () => {
    axios.get("http://localhost:8081/logout")
      .then(() => {
        // Recarrega a página após o logout
        window.location.reload(true);
      })
      .catch(err => console.log(err));
  };

  return (
    <div className="container mt-4 text-center">
      {auth ? (
        // Se autenticado, exibe o nome do usuário e o botão de logout
        <div>
          <h3>Você foi autorizado - {nome}</h3>
          <button className="btn btn-danger" onClick={handleLogout}>
            Sair da conta
          </button>
        </div>
      ) : (
        // Se não autenticado, exibe mensagens e botão de login
        <div>
          <h3>{mensagem}</h3>
          <h3>Login Now</h3>
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}

export default Inicial;
