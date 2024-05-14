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
import Sidebar from "../../../components/sidebar/sidebar";

function AddFuncionarios() {
  const [file, setFile] = useState();
  const [values, setValues] = useState({
    nome: '',
    email: '',
    telefone: '',
    funcao: '',
  });

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

  const formatPhoneNumber = (input) => {
    const onlyDigits = input.replace(/\D/g, '');
    let formattedValue = '';
    if (onlyDigits.length > 0) {
      formattedValue = '(' + onlyDigits.substring(0, 2);
      if (onlyDigits.length > 2) {
        formattedValue += ') ' + onlyDigits.substring(2, 7);
        if (onlyDigits.length > 7) {
          formattedValue += '-' + onlyDigits.substring(7, 11);
        }
      }
    }
    return formattedValue;
  };

  const handleTelefoneChange = (event) => {
    const formattedValue = formatPhoneNumber(event.target.value);
    setValues({ ...values, telefone: formattedValue });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10">
          <div className="bg-white rounded p-3">
            <div className="d-flex align-items-center mt-2  mb-4">
              <Link to="/funcionarios" className="btn border-0">
                <IoIosArrowBack size={32} />
              </Link>
              <h2 className="ms-2">Adicionar Funcionário</h2>
            </div>

            <div className="conteudo-add-funcionario mx-3">
              <form onSubmit={handleFuncionarios}>
                <div className="row">
                  <div className="col-md-6">

                    <div className="input-group mb-4">
                      <span className="input-group-text linha-lateral-icon">
                        <FaPen className="icon-pen" />
                      </span>
                      <input
                        type="text"
                        placeholder="Nome"
                        className="form-control linha-lateral-form"
                        onChange={e => setValues({ ...values, nome: e.target.value })}
                      />
                    </div>

                    <div className="input-group mb-4">
                      <span className="input-group-text linha-lateral-icon">
                        <MdEmail />
                      </span>
                      <input
                        type="text"
                        placeholder="Email"
                        className="form-control linha-lateral-form"
                        onChange={e => setValues({ ...values, email: e.target.value })}
                      />
                    </div>

                    <div className="input-group mb-4">
                      <span className="input-group-text linha-lateral-icon">
                        <FaPhoneAlt />
                      </span>
                      <input
                        type="text"
                        placeholder="Telefone"
                        className="form-control linha-lateral-form"
                        value={values.telefone}
                        onChange={handleTelefoneChange}
                      />
                    </div>

                    <div className="input-group mb-4">
                      <span className="input-group-text">
                        <MdWork />
                      </span>
                      <select
                        type="text"
                        placeholder="Função Desempenhada"
                        className="form-select"
                        onChange={e => setValues({ ...values, funcao: e.target.value })}
                      >
                        <option selected disabled value="funcao">
                          Função Desempenhada
                        </option>
                        <option value="Gerente">Gerente</option>
                        <option value="Recepcionista">Recepcionista</option>
                        <option value="Garçom">Garçom</option>
                        <option value="Cozinheiro(a)">Cozinheiro(a)</option>
                        <option value="aux. de cozinha">aux. de cozinha</option>
                        <option value="aux. de limpeza">aux. de limpeza</option>
                      </select>
                    </div>

                  </div>
                  <div className="col-md-6">

                    <div className="input-group mb-4">
                      <label className="input-group-text" htmlFor="inputGroupFile01">
                        <SlPicture />
                      </label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={handleFile}
                        required
                      />
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
