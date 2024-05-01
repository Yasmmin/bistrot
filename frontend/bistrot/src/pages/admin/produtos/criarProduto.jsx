//importação das bibliotecas do projeto
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

//importação dos icones do projeto
import { IoIosArrowBack } from 'react-icons/io';
import { FaPen } from 'react-icons/fa';
import { IoMdPricetags } from 'react-icons/io';

import { SlPicture } from 'react-icons/sl';
import { MdOutlineChecklist } from 'react-icons/md';
import { FaRuler } from 'react-icons/fa';
import { GoAlert } from 'react-icons/go';
import { MdSaveAs } from 'react-icons/md';
import { FaTrashCan } from 'react-icons/fa6';

//importação de arquivos
import Sidebar from '../../../components/sidebar/sidebar';

function CriarProduto() {

  // usa o useNavigate para redirecionamento de páginas
  const navigate = useNavigate();

  // Adicionar estado para o preço formatado
  const [precoFormatado, setPrecoFormatado] = useState('R$ 0,00'); // Certifique-se de que isso está definido

  // Função para formatar o preço à medida que o usuário digita
  const handlePrecoChange = (event) => {
    const inputPreco = event.target.value.replace(/[^\d]/g, '');
    // Convertendo o valor para número e mantendo duas casas decimais
    const precoNumerico = parseFloat(inputPreco / 100).toFixed(2);
    // Formatação do preço com duas casas decimais
    const precoFormatado = precoNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    setValues({ ...values, preco: precoNumerico });
    setPrecoFormatado(precoFormatado);
  };



  // Função para voltar à página de Produtos com a seta <
  const handleBack = () => {
    navigate('/Produtos');
  };

  //monitora o estado do campo descrição e define um máximo de 150 caracteres
  const [descricao, setDescricao] = useState('');

  // monitora o campo categoria e o campo tamanho
  const [categoria, setCategoria] = useState('');
  const [tamanhoOptions, setTamanhoOptions] = useState([]);

  //atualiza as opções de tamanho com base na categoria
  const handleChangeCategoria = (event) => {
    const selectedCategoria = event.target.value;
    setCategoria(selectedCategoria);

    let newTamanhoOptions = [];
    //opções de tamamho caso a categoria seja bebida
    switch (selectedCategoria) {
      case 'bebida':
        newTamanhoOptions = [
          { value: '200ml', label: '200ml' },
          { value: '290ml', label: '290ml' },
          { value: '350ml', label: '350ml' },
          { value: '473ml', label: '473ml' },
          { value: '500ml', label: '500ml' },
          { value: '510ml', label: '510ml' },
          { value: '600ml', label: '600ml' },
          { value: '1L', label: '1L' },
          { value: '2L', label: '2L' },
        ];
        break;
      //opções de tamamho caso a categoria seja marmita
      case 'Marmita':
        newTamanhoOptions = [
          { value: 'Pequena', label: 'Pequena' },
          { value: 'Média', label: 'Média' },
          { value: 'Grande', label: 'Grande' },
        ];
        break;
      //opções de tamamho caso a categoria seja 
      case 'Porção':
        newTamanhoOptions = [
          { value: 'Pequena', label: 'Pequena - 100g' },
          { value: 'Média', label: 'Média - 500g' },
          { value: 'Grande', label: 'Grande - 1kg' },
        ];
        break;
      default:
        break;
    }
    setTamanhoOptions(newTamanhoOptions);
    setValues({ ...values, categoria: selectedCategoria });
  };

  // Verificação da extenção do arquivo (pdf,png,..)
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Verifica se um arquivo foi selecionado
    if (selectedFile) {
      // Obtém a extensão do arquivo
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

      // Array de extensões permitidas
      const allowedExtensions = ['png', 'jpeg', 'jpg'];

      // Verifica se a extensão está na lista de extensões permitidas
      if (!allowedExtensions.includes(fileExtension)) {
        // Exibe um alerta de erro se a extensão não for permitida
        Swal.fire({
          icon: 'error',
          title: 'Erro!',
          text: 'Por favor, selecione um arquivo PNG, JPEG ou JPG.',
        });

        // Limpa o campo de arquivo
        event.target.value = null;
        // Limpa o estado do arquivo
        setFile(null);

        return; // Retorna para evitar a execução do código abaixo
      }
      // Atualiza o estado do arquivo
      setFile(selectedFile);
    }
  };

  const handleChangeTamanho = (event) => {
    setValues({ ...values, tamanho: event.target.value });
  };
  //monitora o estado dos valores
  const [values, setValues] = useState({
    nome: '',
    preco: '',
    descricao: '',
    categoria: '',
    tamanho: '',
    restricaoalergica: '',
  });

  //monitora o estado do campo foto
  const [file, setFile] = useState();

  const handleProdutos = (event) => {
    event.preventDefault();

    // funcão para enviar os dados pro banco
    const formData = new FormData();
    formData.append('nome', values.nome);
    formData.append('preco', values.preco);
    formData.append('descricao', descricao);
    formData.append('categoria', values.categoria);
    formData.append('tamanho', values.tamanho);
    formData.append('restricaoalergica', values.restricaoalergica);
    formData.append('role', 'admin');
    formData.append('file', file);

    // realiza a ligação com o backend
    axios.post('http://localhost:6969/Produtos', formData)
      .then(res => {
        console.log(res.data);
        //Se tudo ocorrer bem, uma mensagem de sucesso aparecerá
        if (res.data.Status === "Sucesso!") {
          // Exibe a mensagem de sucesso
          Swal.fire({
            icon: 'success',
            title: 'Sucesso!',
            text: 'Produto cadastrado com sucesso!',
            timer: 1500,
          });

          // Aguarda 1,5 segundos antes de recarregar a página
          setTimeout(() => {
            // Recarrega a página automaticamente para limpar os campos
            window.location.reload();
          }, 1500);
        } else {
          // Em caso de erro, uma mensagem aparecerá
          Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: 'Erro ao cadastrar o produto.',
          });
        }
      })
  };

  return (
    <div className="container-fluid d-flex">
      <Sidebar />
      <div className="content d-flex flex-column justify-content-start">
        <div className="d-flex align-items-center mt-4 mx-5">
          <button className="btn border-0" onClick={handleBack}>
            <IoIosArrowBack size={32} />
          </button>
          <h2 className="ms-2 mb-2">Cadastrar Produtos</h2>
        </div>

        <form onSubmit={handleProdutos}>
          <div className="row mt-4 mx-5">

            {/* Campo nome produto */}
            <div className="col-md-6 mb-4 mr-2">
              <div className="input-group mb-4">
                <span className="input-group-text fundo">
                  <FaPen className='icon-pen' />
                </span>
                <input
                  type="text"
                  className="form-control icons-input"
                  placeholder="Nome do Produto"
                  aria-label="Nome do Produto"
                  style={{ backgroundColor: '#f8f9fa', borderLeft: 'none' }}
                  onChange={e => setValues({ ...values, nome: e.target.value })}
                  required
                />
              </div>

              {/* Campo preço de venda */}
              <div className="input-group mb-4">
                <span className="input-group-text" id="basic-addon1">
                  <IoMdPricetags className='icons' />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Preço de Venda"
                  aria-label="Preço de Venda"
                  aria-describedby="basic-addon1"
                  style={{ backgroundColor: '#f8f9fa', borderLeft: 'none' }}
                  onChange={handlePrecoChange}
                  value={precoFormatado} // Usar o valor formatado
                  required
                />
              </div>

              {/* Campo descrição do produto */}
              <div className="input-group mb-4">
                <div style={{ position: 'relative', width: '36rem' }}>
                  <textarea
                    type="text-area"
                    placeholder="Descricao"
                    className="form-control text-area"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    maxLength={150}
                    rows={4}
                  />
                  <div className="position-absolute bottom-0 end-0 text-secondary p-2" style={{ fontSize: '10px' }}>
                    {descricao.length}/150
                  </div>
                </div>
              </div>
            </div>

            {/* Campo selecione uma foto */}
            <div className="col-md-6 mb-3">
              <div className="input-group mb-4">
                <label className="input-group-text" htmlFor="inputGroupFile01">
                  <SlPicture />
                </label>
                <input type="file" className="form-control" onChange={handleFileChange} required />

              </div>

              {/* Campo Categoria */}
              <div className="input-group mb-4">
                <span className="input-group-text" style={{ borderRight: 'none' }}>
                  <MdOutlineChecklist size={23} />
                </span>
                <select
                  className="form-select"
                  style={{ borderLeft: 'none', backgroundColor: '#f8f9fa' }}
                  onChange={handleChangeCategoria}
                  value={categoria}
                  required
                >
                  <option disabled value="">
                    Categoria
                  </option>
                  <option value="bebida">Bebida</option>
                  <option value="Marmita">Marmita</option>
                  <option value="Porção">Porção</option>
                </select>
              </div>

              {/* Campo Tamanho */}
              <div className="input-group mb-4">
                <span className="input-group-text" style={{ borderRight: 'none' }}>
                  <FaRuler size={23} />
                </span>
                <select
                  className="form-select"
                  style={{ borderLeft: 'none', backgroundColor: '#f8f9fa' }}
                  onChange={handleChangeTamanho}
                  value={values.tamanho}
                  required
                >
                  <option disabled value="">
                    Tamanho
                  </option>
                  {tamanhoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo Restrição alérgica */}
              <div className="input-group mb-4">
                <span className="input-group-text" style={{ borderRight: 'none' }}>
                  <GoAlert size={23} />
                </span>
                <select
                  className="form-select"
                  style={{ borderLeft: 'none', backgroundColor: '#f8f9fa' }}
                  onChange={e => setValues({ ...values, restricaoalergica: e.target.value })}
                  required
                >
                  <option disabled selected>
                    restrição alérgica
                  </option>
                  <option value="Nenhuma">Nenhuma</option>
                  <option value="Amendoim">Contém Amendoim</option>
                  <option value="Gluten">Contém Glúten</option>
                  <option value="Leite">Contém Leite</option>
                  <option value="Ovo">Contém Ovos</option>
                  <option value="Peixe/crustáceos">Contém Peixes/crustáceos</option>
                  <option value="soja">Contém soja</option>
                </select>
              </div>
            </div>

            {/* Botão salvar - manda pro banco de dados */}
            <button className='btn mt-4 mb-3' style={{ backgroundColor: '#37b662', color: 'white' }}>
              <MdSaveAs className='mx-2' size={17} />
              Salvar
            </button>

            {/* Botão Descartar - limpa os campos e redireciona para a pagina de produtos */}
            <button type='button' className='btn' onClick={handleBack} style={{ backgroundColor: '#bdbdbd', color: 'white' }}>
              <FaTrashCan className='mx-2' />
              Descartar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default CriarProduto;
