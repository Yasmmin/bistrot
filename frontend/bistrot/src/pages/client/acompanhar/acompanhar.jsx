import Progressbar from "../../../components/progressbar/Progressbar"
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from "react-router-dom";

function Acompanhar() {
  return (
    <div className="body-acompanhar">
    
    <div className="header mt-4 mb-2">
        <div className="d-flex align-items-center">
          <Link to="/">
            <button className="btn border-0">
              <IoIosArrowBack size={30} />
            </button>
          </Link>
          <h1 className="ms-1 mb-0">Acompanhar</h1>
        </div>
      </div>
      
      <div className="conteudo-acompanhar ">
      <Progressbar/>
      </div>

    </div>
  )
}

export default Acompanhar