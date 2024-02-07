import { useState } from "react";
import axios from "axios";

function FileUpload() {
    const [file, setFile] = useState();

    const handleFile = (e) => {
        setFile(e.target.files[0]);
    };
    
    //envia oos arquivos para o servidor
    const handleUpload = () => {
        if (!file) {
            console.log("Selecione um arquivo antes de fazer o upload");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        axios.post("http://localhost:8081/upload", formData)
            .then((res) => {
                if (res.data.Status === "success") {
                    console.log("Sucesso");
                } else {
                    console.log("Falha");
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="container">
            <input type="file" onChange={handleFile} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default FileUpload;