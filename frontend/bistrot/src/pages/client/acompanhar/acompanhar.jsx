import Progressbar from "../../../components/progressbar/Progressbar";
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from "react-router-dom";
import TabBar from "../../../components/tabBar/tabBar";
import './acompanhar.css'; // Importe o arquivo de estilos

function Acompanhar() {
  return (
    <div className="body-acompanhar w-100">
      <TabBar />
      <div className="mt-4 mb-2">
        <div className="d-flex align-items-center">
          <Link to="/">
            <button className="btn border-0">
              <IoIosArrowBack size={30} />
            </button>
          </Link>
          <h1 className="ms-1 mb-0">Acompanhar</h1>
        </div>
      </div>
      
      <div className="conteudo-acompanhar">
        <Progressbar />
      </div>
    </div>
  );
}

export default Acompanhar;
