// Importação de dependências do projeto
import express from "express";
import mysql from "mysql2";
import cors from 'cors';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import path from 'path'
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';

//------------------------------------------------------------------------------------------------------------------------//
const salt = 10;
const app = express();
app.use(cookieParser());
app.use(express.json());

//------------------------------------------------------------------------------------------------------------------------//
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET", "DELETE", "UPDATE", "PUT"],
    credentials: true
}));

//--- Conexão com o banco de dados ---------------------------------------------------------------------------------------//

dotenv.config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

//--- Recuperação de fotos cadastradas---------------------------------------------------------------------------------------------------------------------//

const __filename = fileURLToPath(import.meta.url); //Obter o caminho absoluto do arquivo atual
const __dirname = path.dirname(__filename);
const imagePath = path.join(__dirname, 'image', 'produtos'); //Caminho para o diretório de imagens de produtos
app.use('/files', express.static(imagePath));

//--- Cadastro de usuários ---------------------------------------------------------------------------------------------------------------------//

app.post('/cadastro', (req, res) => {
    bcrypt.hash(req.body.senha.toString(), salt, (err, hash) => {
        if (err) {
            console.error("Erro ao criptografar a senha:", err);
            return res.json({ Error: "Erro ao criptografar a senha" });
        }

        const sql = "INSERT INTO cliente (`nome`, `email`, `senha`, `role`) VALUES (?, ?, ?, 'cliente')";
        const values = [req.body.nome, req.body.email, hash];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Erro ao inserir dados no servidor:", err);
                return res.json({ Error: "Erro ao inserir dados no servidor", details: err.message });
            }

            console.log("Dados inseridos com sucesso:", result);
            return res.json({ Status: "Sucesso!" });
        });
    });
});

//--- Cadastro de produto ---------------------------------------------------------------------------------------------------------------------//
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../backend/image/produtos");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
});

const upload = multer({ storage })

app.post('/Produtos', upload.single('file'), (req, res) => {
    const precoNumerico = parseFloat(req.body.preco.replace(/[^\d]/g, '')) / 100;

    if (!req.file || !req.file.filename) {
        return res.json({ Error: "Arquivo não encontrado" })
    }

    const sql = "INSERT INTO produto (`nome`,`preco`,`descricao`,`categoria`,`tamanho`,`restricaoalergica`, `foto`) VALUES (?,?,?,?,?,?,?)";
    const values = [req.body.nome, precoNumerico, req.body.descricao, req.body.categoria, req.body.tamanho, req.body.restricaoalergica, req.file.filename];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao inserir dados no servidor:", err);
            return res.json({ Error: "Erro ao inserir dados no servidor", details: err.message });
        }

        console.log("Dados inseridos com sucesso:", result);
        return res.json({ Status: "Sucesso!" });
    })
})

//--- Pega as informações do produto ---------------------------------------------------------------------------------------------------------------------//

app.get('/Produtos', async (req, res) => {
    const produtos = "SELECT * FROM produto";
    db.query(produtos, (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ Error: "Erro ao buscar produtos", details: err.message });
        }
        return res.json(data);
    });
});

app.get('/produtos/:id', (req, res) => {
    const productId = req.params.id;
    const sql = 'SELECT * FROM produto WHERE id = ?';
    
    db.query(sql, [productId], (err, result) => {
        if (err) {
            console.error("Erro ao buscar produto:", err);
            return res.status(500).json({ error: "Erro ao buscar produto" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Produto não encontrado" });
        }

        const produto = result[0];
        return res.json(produto);
    });
});

//--- Exclusão do produto ---------------------------------------------------------------------------------------------------------------------//

app.delete("/produtos/:id", (req, res) => {
    const produtoId = req.params.id;
    const selectQuery = "SELECT foto FROM produto WHERE id = ?";

    db.query(selectQuery, [produtoId], (err, resultSelect) => {
        if (err) {
            return res.json({ error: err });
        }
        const imagemAntiga = resultSelect[0].foto;
        const deleteQuery = "DELETE FROM produto WHERE id = ?";

        db.query(deleteQuery, [produtoId], (err, data) => {
            if (err) {
                return res.json({ error: err });
            }

            const imagemAntigaPath = path.join(imagePath, imagemAntiga);
            fs.unlink(imagemAntigaPath, (unlinkErr) => {
                if (unlinkErr) {
                    console.error("Error deleting the image file:", unlinkErr);
                }
                return res.json(data);
            });
        });
    });
});

//--- Pega as informações dos produtos e mostra nos campos ---------------------------------------------------------------------------------------------------------------------//

app.get('/edit/:id', (req, res) => {
    const sql = "SELECT * FROM  produto WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: err })
        return res.json(result)
    })
})

//--- Edição de produtos ---------------------------------------------------------------------------------------------------------------------//

app.put('/edit/:id', upload.single('novaImagem'), (req, res) => {
    const sqlSelect = "SELECT foto FROM produto WHERE id = ?";
    const id = req.params.id;

    db.query(sqlSelect, [id], (err, resultSelect) => {
        if (err) return res.json({ error: err });

        const imagemAntiga = resultSelect[0].foto;

        const sqlUpdate = "UPDATE produto SET `nome`= ?, `descricao`= ?,`preco`= ?,`categoria`= ?,`tamanho`= ?,`restricaoalergica`= ?,`foto`= ? WHERE id = ?";

        const novaImagem = req.file ? req.file.filename : imagemAntiga;

        db.query(sqlUpdate, [req.body.nome, req.body.descricao, req.body.preco, req.body.categoria, req.body.tamanho, req.body.restricaoalergica, novaImagem, id], (err, resultUpdate) => {
            if (err) return res.json({ error: err });

            // Remove the old image if a new image is uploaded
            if (req.file) {
                const imagemAntigaPath = path.join(imagePath, 'produtos', imagemAntiga);
                fs.unlink(imagemAntigaPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Erro ao excluir a imagem antiga:", unlinkErr);
                    }
                });
            }

            return res.json({ atualizado: true });
        });
    });
});

//--- Verificar a autenticação do usuário e seu papel (role) ---------------------------------------------------------------------------------------------------------------------//

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "Você não está autenticado" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token está com falhas" });
            } else {
                req.userId = decoded.id;
                req.nome = decoded.nome;
                req.email = decoded.email;
                req.role = decoded.role;
                next();
            }
        });
    }
};

//--- Retornar informações do usuário autenticado ---------------------------------------------------------------------------------------------------------------------//

app.get('/', verifyUser, (req, res) => {
    return res.json({ Status: "Sucesso!", nome: req.nome, role: req.role, email: req.email });
});
app.get('/sidebar', verifyUser, (req, res) => {
    return res.json({ Status: "Sucesso!", nome: req.nome, role: req.role });
});

//--- Login de usuários ---------------------------------------------------------------------------------------------------------------------//

app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.json({ Error: "Por favor, forneça um email e uma senha" });
    }

    const sql = "SELECT * FROM cliente WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Erro no servidor ao fazer login:", err);
            return res.json({ Error: "Erro no servidor ao fazer login" });
        }

        if (data.length === 0) {
            return res.json({ Error: "Email não encontrado" });
        }

        const cliente = data[0];

        bcrypt.compare(senha.toString(), cliente.senha, (err, response) => {
            if (err) {
                console.error("Erro ao comparar senhas:", err);
                return res.json({ Error: "Erro ao comparar senhas" });
            }

            if (response) {

                const { nome, email, role, rua, casa, id } = cliente;

                const token = jwt.sign({ nome, email, role, rua, casa, id }, "jwt-secret-key", { expiresIn: '1d' });
                res.cookie('token', token);
                return res.json({ Status: "Sucesso!", role, token,id });

            } else {
                return res.json({ Error: "Senha incorreta" });
            }
        });
    });
});

//--- Pegar diretório de imagem e armazenar ---------------------------------------------------------------------------------------------------------------------//

const caminho = path.join(__dirname, 'image', 'funcionarios');
app.use('/files', express.static(caminho))

const armazenar = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'image', 'funcionarios'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}_${file.originalname}`);
    }
});

const enviar = multer({ storage: armazenar });

//--- Cadastro de funcionários ---------------------------------------------------------------------------------------------------------------------//

app.post('/AddFuncionarios', enviar.single('file'), (req, res) => {
    const sql = "INSERT INTO funcionarios (`nome`,`email`,`telefone`,`funcao`,`foto`) VALUES (?,?,?,?,?)";
    const values = [req.body.nome, req.body.email, req.body.telefone, req.body.funcao, req.file.filename];

    if (!req.file || !req.file.filename) {
        return res.json({ Error: "Arquivo não encontrado" })
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Erro ao inserir dados no servidor:", err);
            return res.json({ Error: "Erro ao inserir dados no servidor", details: err.message });
        }

        console.log("Dados inseridos com sucesso:", result);
        return res.json({ Status: "Sucesso!" });
    })
});

//--- Mostra as informações do funcionario na tela de funcionarios ---------------------------------------------------------------------------------------------------------------------//

app.get('/funcionarios', async (req, res) => {
    const produtos = "SELECT * FROM funcionarios";
    db.query(produtos, (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ Error: "Erro ao buscar produtos", details: err.message });
        }
        return res.json(data);
    });
});

//--- Deletar funcionários e foto do funcionário ---------------------------------------------------------------------------------------------------------------------//

app.delete("/funcionarios/:id", (req, res) => {
    const funcionarioId = req.params.id;
    const selectQuery = "SELECT foto FROM funcionarios WHERE id = ?";

    db.query(selectQuery, [funcionarioId], (err, resultSelect) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao buscar funcionário", details: err.message });
        }

        if (resultSelect.length === 0) {
            return res.status(404).json({ error: "Funcionário não encontrado" });
        }

        const imagemAntiga = resultSelect[0].foto;
        const imagemAntigaPath = path.join(caminho, imagemAntiga);

        // Verifica se a imagem existe antes de tentar excluir
        fs.access(imagemAntigaPath, (accessErr) => {
            if (accessErr) {
                console.error("Imagem não encontrada:", accessErr);
                return res.status(500).json({ error: "Imagem não encontrada", details: accessErr.message });
            }

            const deleteQuery = "DELETE FROM funcionarios WHERE id = ?";
            db.query(deleteQuery, [funcionarioId], (deleteErr, data) => {
                if (deleteErr) {
                    return res.status(500).json({ error: "Erro ao excluir funcionário", details: deleteErr.message });
                }

                // Exclui a imagem do disco
                fs.unlink(imagemAntigaPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Erro ao excluir imagem:", unlinkErr);
                    }

                    return res.json(data);
                });
            });
        });
    });
});

//--- Pega as informações dois produtos e mostra nos campos ---------------------------------------------------------------------------------------------------------------------//

app.get('/EditFuncionarios/:id', (req, res) => {
    const sql = "SELECT * FROM  funcionarios WHERE id = ?";
    const id = req.params.id;
    db.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: err })
        return res.json(result)
    })
})

//--- Realiza a edição de funcionarios ---------------------------------------------------------------------------------------------------------------------//

app.put('/EditFuncionarios/:id', enviar.single('novaImagem'), (req, res) => {
    const sqlSelect = "SELECT foto FROM funcionarios WHERE id = ?";
    const id = req.params.id;

    db.query(sqlSelect, [id], (err, resultSelect) => {
        if (err) return res.json({ error: err });

        const imagemAntiga = resultSelect[0].foto;

        const sqlUpdate = "UPDATE funcionarios SET `nome`= ?, `email`= ?,`funcao`= ?,`telefone`= ?,`foto`= ? WHERE id = ?";

        const novaImagem = req.file ? req.file.filename : imagemAntiga;

        db.query(sqlUpdate, [req.body.nome, req.body.email, req.body.funcao, req.body.telefone, novaImagem, id], (err, resultUpdate) => {
            if (err) return res.json({ error: err });

            if (req.file) {
                const imagemAntigaPath = path.join(caminho, imagemAntiga);
                fs.unlink(imagemAntigaPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error("Erro ao excluir a imagem antiga:", unlinkErr);
                    }
                });
            }

            return res.json({ atualizado: true });
        });
    });
});

const uploadForUsers = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(__dirname, 'image', 'users'));
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${uniqueSuffix}_${file.originalname}`);
        }
    })
});

app.use('/users', express.static(path.join(__dirname, 'image', 'users')));


//--- Pega as info do cliente e mostra na tela de perfil ---------------------------------------------------------------------------------------------------------------------//
app.get('/perfil', verifyUser, (req, res) => {
    const userId = req.userId;
    const query = `SELECT * FROM cliente WHERE id = ?`;

    db.query(query, [userId], (error, results, fields) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        const userData = results[0];

        return res.json({
            Status: "Sucesso!",
            userId: userId,
            foto: userData.foto,
            nome: userData.nome,
            email: userData.email,
            telefone: userData.telefone,
            rua: userData.rua,
            casa: userData.casa,
            bairro: userData.bairro,
            complemento: userData.complemento
        });
    });
});

app.put('/perfil', verifyUser, uploadForUsers.single('foto'), (req, res) => {
    const userId = req.userId;
    const { nome, email, telefone, rua, casa, bairro, complemento } = req.body;
    let foto = req.file ? req.file.filename : null;

    // Recupere os valores atuais do banco de dados
    const query = 'SELECT * FROM cliente WHERE id = ?';
    db.query(query, [userId], (error, results) => {
        if (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const userData = results[0];

        // Preenche os campos não alterados com os valores atuais do banco de dados
        const nomeAtualizado = nome || userData.nome;
        const emailAtualizado = email || userData.email;
        const telefoneAtualizado = telefone || userData.telefone;
        const ruaAtualizada = rua || userData.rua;
        const casaAtualizada = casa || userData.casa;
        const bairroAtualizado = bairro || userData.bairro;
        const complementoAtualizado = complemento || userData.complemento;
        const fotoAtualizada = foto !== null ? foto : userData.foto;


        const sql = "UPDATE cliente SET nome = ?, email = ?, telefone = ?, rua = ?, casa = ?, bairro = ?, complemento = ?, foto = ? WHERE id = ?";
        db.query(sql, [nomeAtualizado, emailAtualizado, telefoneAtualizado, ruaAtualizada, casaAtualizada, bairroAtualizado, complementoAtualizado, fotoAtualizada, userId], (err, result) => {
            if (err) {
                console.error("Erro ao atualizar informações do perfil:", err);
                return res.status(500).json({ error: "Erro ao atualizar informações do perfil" });
            }
            return res.json({ message: "Informações do perfil atualizadas com sucesso" });
        });
    });
});

//--- Endpoint para realizar o logout do usuário ---------------------------------------------------------------------------------------------------------------------//

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Sucesso!" })
});

//--- Pegar todos os clientes e mostrar no backend ---------------------------------------------------------------------------------------------------------------------//

app.get('/cliente', (req, res) => {
    const sql = "SELECT * FROM cliente";
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Erro ao buscar informações dos clientes:", err);
            return res.json({ Error: "Erro ao buscar informações dos clientes", details: err.message });
        }
        return res.json(result);
    });
});

//--- Inicialização do servidor ---------------------------------------------------------------------------------------------------------------------//

app.listen(6969, () => {
    console.log("Rodando na porta 6969")
});
