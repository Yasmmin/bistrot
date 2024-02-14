
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaPen } from 'react-icons/fa';
import { SlPicture } from 'react-icons/sl'
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import Swal from "sweetalert2";
import axios from "axios";
import { useState } from "react";

//----------------------------MONITORAR ESTADO DOS CAMPOS-------------------------------------------------------------------//
function AddFuncionarios() {
  const [file, setFile] = useState();
  const [values, setValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    funcao: '',
  });

  //-------------------------ENVIO PARA O BANCO DE DADOS E CONEXÃO COM O BACKEND----------------------------------------------//

  const handleFuncionarios = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('nome', values.nome);
    formData.append('email', values.email);
    formData.append('funcao', values.funcao);
    formData.append('telefone', values.telefone);
    formData.append('file', file);

    axios.post('http://localhost:6969/AddFuncionarios', formData)
      .then(res => {
        console.log(res.data);
        if (res.data.Status === "Sucesso!") {
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Funcionário cadastrado com sucesso!',
            timer: 1500,
          });

          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao cadastrar funcionario.',
          });
        }
      })
  };

  //--------------------------------------UPLOAD DE FOTOS-------------------------------------------------------------------//
  const handleFile = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['png', 'jpeg', 'jpg'];
      if (!allowedExtensions.includes(fileExtension)) {
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Por favor, selecione um arquivo PNG, JPEG ou JPG.',
        });
        event.target.value = null;
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };

  //--------------------------------------ESTRUTURA VISUAL DA PÁGINA--------------------------------------------------------//
  return (
    <div className="container-fluid d-flex">
      <div className="d-flex flex-column w-100 ml-2">
        <div className="d-flex vh-100 justify-content-center mt-5">
          <div className="w-100 bg-white rounded p-3">
            {/* Botão para voltar pra tela de produtos */}
            <div className="d-flex align-items-center mt-2 mx-5 mb-4">
              <Link to="/produtos" className="btn border-0">
                <IoIosArrowBack size={32} />
              </Link>
              <h2 className="ms-2">Adicionar Funcionário</h2>
            </div>

            <div className="container">
              <form onSubmit={handleFuncionarios}>
                <div className="row mx">
                  <div className="mb-2 col-sm coluna-esquerda">

                    {/* Campo nome do funcionario */}
                    <div className="input-group mb-4 ">
                      <span
                        className="input-group-text linha-lateral-icon"
                        style={{ backgroundColor: "#ffff" }}
                      >
                        <FaPen className="icon-pen" />
                      </span>
                      <input
                        type="text"
                        placeholder="Nome"
                        className="form-control linha-lateral-form"
                        onChange={e => setValues({ ...values, nome: e.target.value })}
                      />
                    </div>

                    {/* Campo email do funcionario */}
                    <div className="input-group mb-4 ">
                      <span
                        className="input-group-text linha-lateral-icon"
                        style={{ backgroundColor: "#ffff" }}
                      >
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        placeholder="Email"
                        className="form-control linha-lateral-form"
                        onChange={e => setValues({ ...values, email: e.target.value })}
                      />
                    </div>

                    {/*Campo numero de telefone do funcionario*/}
                    <div className="input-group mb-4 ">
                      <span
                        className="input-group-text linha-lateral-icon"
                        style={{ backgroundColor: "#ffff" }}>
                        <FaPhoneAlt />
                      </span>
                      <input
                        type="number"
                        placeholder="Telefone"
                        className="form-control linha-lateral-form"
                        onChange={e => setValues({ ...values, telefone: e.target.value })}
                      />
                    </div>

                    {/*Campo de função desempenhada*/}
                    <div className="input-group mb-4">
                      <span className="input-group-text" style={{ backgroundColor: '#ffff' }}>
                        <MdWork />
                      </span>
                      <select
                        type="text"
                        placeholder="Função Desempenhada"
                        className="form-select"
                        onChange={e => setValues({ ...values, funcao: e.target.value })}
                      >
                        <option disabled value="funcao">
                          Função Desempenhada
                        </option>
                        <option value="Gerente">Gerente</option>
                        <option value="Recepcionista">Recepcionista</option>
                        <option value="Garçom">Garçom</option>
                        <option value="Cozinheiro">Cozinheiro</option>
                        <option value="aux. de cozinha">aux. de cozinha</option>
                        <option value="aux. de limpeza">aux. de limpeza</option>
                      </select>
                    </div>

                  </div>

                  {/*Coluna direita*/}
                  <div className="mb-2 col-sm coluna-direita">
                    <div className="input-group mb-4 w-100">
                      <div className="col-md-6 mb-3 w-100">
                        <div className="input-group mb-4">
                          <label className="input-group-text" htmlFor="inputGroupFile01">
                            <SlPicture />
                          </label>
                          <input type="file" className="form-control"
                            onChange={handleFile} required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-success w-100 mb-2 mt-5">Cadastrar</button>
                <Link to="/funcionarios">
                  <button className="btn btn-primary w-100">Descartar</button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFuncionarios;