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
import nodemailer from 'nodemailer';

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
    const { nome, email, senha } = req.body;

    // Verifica se o e-mail já existe
    const checkEmailSql = "SELECT * FROM cliente WHERE email = ?";
    db.query(checkEmailSql, [email], (err, result) => {
        if (err) {
            console.error("Erro ao verificar e-mail no servidor:", err);
            return res.json({ Error: "Erro ao verificar e-mail no servidor", details: err.message });
        }

        if (result.length > 0) {

            return res.json({ Error: "E-mail já cadastrado" });
        } else {
            // E-mail não existe, prossiga com o cadastro
            bcrypt.hash(senha.toString(), salt, (err, hash) => {
                if (err) {
                    console.error("Erro ao criptografar a senha:", err);
                    return res.json({ Error: "Erro ao criptografar a senha" });
                }

                const sql = "INSERT INTO cliente (`nome`, `email`, `senha`, `role`) VALUES (?, ?, ?, 'cliente')";
                const values = [nome, email, hash];

                db.query(sql, values, (err, result) => {
                    if (err) {
                        console.error("Erro ao inserir dados no servidor:", err);
                        return res.json({ Error: "Erro ao inserir dados no servidor", details: err.message });
                    }

                    console.log("Dados inseridos com sucesso:", result);
                    return res.json({ Status: "Sucesso!" });
                });
            });
        }
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
    const token = req.headers.authorization; // Alterar para pegar o token do cabeçalho Authorization
    if (!token) {
        return res.status(401).json({ Error: "Você não está autenticado" }); // Retornar status 401 se não houver token
    } else {
        const tokenString = token.split(' ')[1]; // Extrair apenas o token da string 'Bearer token'
        jwt.verify(tokenString, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.status(401).json({ Error: "Token está com falhas" }); // Retornar status 401 se houver erro na verificação do token
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
        return res.status(400).json({ Error: "Por favor, forneça um email e uma senha" });
    }

    const sql = "SELECT * FROM cliente WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Erro no servidor ao fazer login:", err);
            return res.status(500).json({ Error: "Erro no servidor ao fazer login" });
        }

        if (data.length === 0) {
            return res.status(404).json({ Error: "Email não encontrado" });
        }

        const cliente = data[0];

        bcrypt.compare(senha, cliente.senha, (err, response) => {
            if (err) {
                console.error("Erro ao comparar senhas:", err);
                return res.status(500).json({ Error: "Erro ao comparar senhas" });
            }

            if (response) {
                const { nome, email, role, rua, casa, id } = cliente;
                const token = jwt.sign({ nome, email, role, rua, casa, id }, "jwt-secret-key", { expiresIn: '1d' });
                return res.status(200).json({ Status: "Sucesso!", role, token, id, nome });
            } else {
                return res.status(401).json({ Error: "Senha incorreta" });
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

//--- enviar o endereço do cliente pro banco ---------------------------------------------------------------------------------------------------------------------//
app.post('/endereco', verifyUser, (req, res) => {
    const userId = req.userId; // Obtém o ID do usuário autenticado
    const { bairro, rua, casa, complemento } = req.body;

    // Verifica se o usuário existe
    const checkUserQuery = "SELECT * FROM cliente WHERE id = ?";
    db.query(checkUserQuery, [userId], (err, userData) => {
        if (err) {
            console.error("Erro ao verificar usuário:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
        if (userData.length === 0) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        // Atualiza os dados do cliente com o novo endereço
        const updateQuery = "UPDATE cliente SET bairro = ?, rua = ?, casa = ?, complemento = ? WHERE id = ?";
        const updateValues = [bairro, rua, casa, complemento, userId];

        db.query(updateQuery, updateValues, (err, result) => {
            if (err) {
                console.error("Erro ao atualizar endereço no banco de dados:", err);
                return res.status(500).json({ error: "Erro ao atualizar endereço no banco de dados" });
            }
            return res.status(200).json({ message: "Endereço atualizado com sucesso" });
        });
    });
});

//--- Pegar endereco ---------------------------------------------------------------------------------------------------------------------//
app.get('/endereco', verifyUser, (req, res) => {
    const userId = req.userId;
    const query = "SELECT * FROM cliente WHERE id = ?";

    db.query(query, [userId], (error, results) => {
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
            email: userData.email,
            rua: userData.rua,
            casa: userData.casa,
            bairro: userData.bairro,
            complemento: userData.complemento

        });
    });
});

app.post('/finalizar', verifyUser, (req, res) => {
    const { entregaCasa, formaPagamento, horaPedido, observacao, total, dataAtual, userName, produtos, troco, } = req.body;

    // Verificar se os dados foram recebidos corretamente
    console.log("Dados recebidos no backend:", { userId: req.userId, entregaCasa, formaPagamento, observacao, horaPedido, dataAtual, userName, produtos, troco });

    // Montar os valores para a query SQL
    const values = [req.userId, formaPagamento, entregaCasa, horaPedido, observacao, total, dataAtual, userName, troco];
    const produtosArray = []; // Inicializar o array para os produtos

    // Convertendo o objeto JSON de produtos em um array de objetos para inserção no banco de dados
    produtos.forEach(produto => {
        console.log("Produto:", produto.nome);
        console.log("Quantidade:", produto.quantidade);
        produtosArray.push({ nome: produto.nome, quantidade: produto.quantidade });
    });
    values.push(JSON.stringify(produtosArray)); // Adicionar o array de produtos à lista de valores

    // Adicionando "Em análise" como o status padrão
    values.push("Em análise");

    const sqlQuery = "INSERT INTO pedido (id_cliente, forma_pagamento, forma_entrega, hora_pedido, obs, valor_total, data, nome_cliente, troco,produtos, status_pedido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";

    // Executar a query SQL
    db.query(sqlQuery, values, (err, result) => {
        if (err) {
            console.error("Erro ao inserir dados no banco de dados:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
        const numeroPedido = result.insertId;
        console.log("Dados inseridos no banco de dados com sucesso:", result);
        return res.status(200).json({
            message: "Pedido finalizado com sucesso",
            numero_pedido: numeroPedido
        });
    });
});


//--- Recuperar Pedidos do Banco de Dados -----------------------------------------------//
app.get('/pedidos', (req, res) => {
    const { date } = req.query;
    let sql = "SELECT p.*, c.rua, c.casa, c.bairro, c.complemento,c.email FROM pedido p JOIN cliente c ON p.id_cliente = c.id";

    // Se a data for fornecida, adicione uma cláusula WHERE para filtrar os pedidos pela data
    if (date) {
        sql += ` WHERE DATE(p.data) = '${date}'`;
    }

    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao buscar pedidos", details: err.message });
        }
        return res.json(data);
    });
});


app.get('/faturamento', (req, res) => {
    const period = req.query.period;
    let sql = "";
    const currentYear = new Date().getFullYear();
    switch (period) {
        case 'daily':
            sql = `
                SELECT DATE_FORMAT(p.data, '%Y-%m-%d') as name, SUM(p.valor_total) as valor_total
                FROM pedido p
                WHERE YEAR(p.data) = ${currentYear}
                GROUP BY DATE_FORMAT(p.data, '%Y-%m-%d')
            `;
            break;

        case 'weekly':
            sql = `
        SELECT 
            days_of_week.name,
            COALESCE(SUM(p.valor_total), 0) as valor_total
        FROM (
            SELECT 'Domingo' as name, CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 1) DAY as date
            UNION SELECT 'Segunda', CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 2) DAY
            UNION SELECT 'Terça', CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 3) DAY
            UNION SELECT 'Quarta', CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 4) DAY
            UNION SELECT 'Quinta', CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 5) DAY
            UNION SELECT 'Sexta', CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 6) DAY
            UNION SELECT 'Sábado', CURDATE() - INTERVAL (DAYOFWEEK(CURDATE()) - 7) DAY
        ) as days_of_week
        LEFT JOIN (
            SELECT 
                DATE(data) as date, 
                SUM(valor_total) as valor_total
            FROM pedido
            WHERE YEAR(data) = 2024 
                AND status_pedido IN ('retirado', 'entregue', 'finalizado') /* Corrigido para o nome correto da coluna */
            GROUP BY DATE(data)
        ) as p ON days_of_week.date = p.date
        GROUP BY days_of_week.name
    `;
            break;

        case 'monthly':
            sql = `
                SELECT DATE_FORMAT(p.data, '%M') as name, SUM(p.valor_total) as valor_total
                FROM pedido p
                WHERE YEAR(p.data) = ${currentYear}
                GROUP BY DATE_FORMAT(p.data, '%M')
            `;
            break;
        case 'yearly':
            sql = `
                SELECT YEAR(p.data) as name, SUM(p.valor_total) as valor_total
                FROM pedido p
                GROUP BY YEAR(p.data)
            `;
            break;
        default:
            return res.status(400).json({ error: "Invalid period" });
    }

    db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao buscar dados de faturamento", details: err.message });
        }
        return res.json(data);
    });
});



// Endpoint para atualizar o status do pedido
app.put('/pedidos/:numero_pedido/status', (req, res) => {
    const pedidoNumero = req.params.numero_pedido;
    const novoStatus = req.body.novoStatus;

    // Verifique se o pedido com o número fornecido existe no banco de dados
    const checkPedidoQuery = "SELECT * FROM pedido WHERE numero_pedido = ?";
    db.query(checkPedidoQuery, [pedidoNumero], (err, result) => {
        if (err) {
            console.error("Erro ao buscar pedido:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Se o pedido não for encontrado, retorne um erro
        if (result.length === 0) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        // Atualize o status do pedido para o novo status fornecido
        const updateStatusQuery = "UPDATE pedido SET status_pedido = ? WHERE numero_pedido = ?";
        db.query(updateStatusQuery, [novoStatus, pedidoNumero], (err, result) => {
            if (err) {
                console.error("Erro ao atualizar status do pedido:", err);
                return res.status(500).json({ error: "Erro interno do servidor" });
            }

            // Retorna uma mensagem de sucesso
            return res.json({ message: `Status do pedido atualizado para '${novoStatus}'` });
        });
    });
});

app.get('/pedidos/:numero_pedido/status', (req, res) => {
    const pedidoNumero = req.params.numero_pedido;

    // Consultar o banco de dados para obter o status do pedido com base no número do pedido
    const checkPedidoQuery = "SELECT status_pedido FROM pedido WHERE numero_pedido = ?";
    db.query(checkPedidoQuery, [pedidoNumero], (err, result) => {
        if (err) {
            console.error("Erro ao buscar status do pedido:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        // Se o pedido não for encontrado, retorne um erro
        if (result.length === 0) {
            return res.status(404).json({ error: "Pedido não encontrado" });
        }

        // Retorne o status do pedido
        const statusPedido = result[0].status_pedido;
        return res.status(200).json({ status: statusPedido });
    });
});

app.post('/redefinir-senha', async (req, res) => {
    const { email, code, novaSenha } = req.body;


    // Verificar se o email existe na tabela cliente
    const sql = "SELECT * FROM cliente WHERE email = ?";
    db.query(sql, [email], async (err, result) => {
        if (err) {
            console.error("Erro ao verificar email no banco de dados:", err);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }

        if (result.length === 0) {
            return res.status(404).json({ error: "Email não encontrado" });
        }

        // Enviar o código de redefinição de senha por email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'restaurantecafebistrot@gmail.com',
                pass: 'cmfy nqyw lswp ittj'
            }
        });

        const mailOptions = {
            from: 'restaurantecafebistrot@gmail.com',
            to: email,
            subject: 'Redefinição de senha',
            text: `Seu código de redefinição de senha é: ${code}`
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Código de redefinição de senha enviado com sucesso" });
        } catch (error) {
            console.error("Erro ao enviar email de redefinição de senha:", error);
            return res.status(500).json({ error: "Erro ao enviar email de redefinição de senha" });
        }
    });
});

app.put('/nova-senha', async (req, res) => {
    const { email, novaSenha } = req.body;

    try {
        // Gerar o salt de forma assíncrona
        const salt = await bcrypt.genSalt(10);

        // Criptografar a nova senha
        const hash = await bcrypt.hash(novaSenha, salt);

        // Atualizar a senha no banco de dados
        const updateSql = "UPDATE cliente SET senha = ? WHERE email = ?";
        db.query(updateSql, [hash, email], (err, result) => {
            if (err) {
                console.error("Erro ao atualizar a senha no banco de dados:", err);
                return res.status(500).json({ error: "Erro interno do servidor" });
            }
            return res.status(200).json({ message: "Senha atualizada com sucesso" });
        });
    } catch (error) {
        console.error("Erro ao criptografar a nova senha:", error);
        return res.status(500).json({ error: "Erro ao criptografar a nova senha" });
    }
});

app.get('/pedidos/:id_usuario', (req, res) => {
    const idUsuario = req.params.id_usuario;
    const sql = "SELECT p.*, c.rua, c.casa, c.bairro, c.complemento, c.email FROM pedido p JOIN cliente c ON p.id_cliente = c.id WHERE p.id_cliente = ?";
    db.query(sql, [idUsuario], (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: "Erro ao buscar pedidos", details: err.message });
        }
        return res.json(data);
    });
});


//--- Inicialização do servidor ---------------------------------------------------------------------------------------------------------------------//

app.listen(6969, () => {
    console.log("Rodando na porta 6969")
});
