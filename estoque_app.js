const express = require('express');
const path = require('path');

const app = express();
const PORT = 3002;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Simulação do banco de dados
let estoque = [
    { id: 1, nome: 'Notebook Dell', marca: 'Dell', preco: 2500.00, quantidade: 5 },
    { id: 2, nome: 'Mouse Logitech', marca: 'Logitech', preco: 80.00, quantidade: 15 },
    { id: 3, nome: 'Teclado Mecânico', marca: 'Corsair', preco: 300.00, quantidade: 8 },
    { id: 4, nome: 'Monitor 24"', marca: 'LG', preco: 800.00, quantidade: 3 }
];

let proximoId = 5;
let usuarioLogado = false;

// Middleware de log
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString('pt-BR')}] ${req.method} ${req.url}`);
    next();
});

// Middleware de autenticação
const verificarAutenticacao = (req, res, next) => {
    if (!usuarioLogado) {
        return res.redirect('/login?erro=acesso_negado');
    }
    next();
};

// Rota de login
app.get('/login', (req, res) => {
    const erro = req.query.erro;
    let mensagemErro = '';
    
    if (erro === 'acesso_negado') {
        mensagemErro = 'Você precisa estar logado para acessar esta área';
    } else if (erro === 'credenciais_invalidas') {
        mensagemErro = 'Usuário ou senha incorretos';
    }
    
    res.render('login', { 
        titulo: 'Login do Sistema',
        erro: mensagemErro
    });
});

app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    
    // Simulação de autenticação (usuário: admin, senha: 123)
    if (usuario === 'admin' && senha === '123') {
        usuarioLogado = true;
        res.redirect('/admin/cadastro');
    } else {
        res.redirect('/login?erro=credenciais_invalidas');
    }
});

app.get('/logout', (req, res) => {
    usuarioLogado = false;
    res.redirect('/loja?sucesso=logout_realizado');
});

// Página de cadastro (protegida)
app.get('/admin/cadastro', verificarAutenticacao, (req, res) => {
    const sucesso = req.query.sucesso;
    let mensagemSucesso = '';
    
    if (sucesso === 'produto_cadastrado') {
        mensagemSucesso = 'Produto cadastrado com sucesso!';
    } else if (sucesso === 'produto_alterado') {
        mensagemSucesso = 'Produto alterado com sucesso!';
    } else if (sucesso === 'produto_removido') {
        mensagemSucesso = 'Produto removido com sucesso!';
    }
    
    res.render('admin_cadastro', { 
        titulo: 'Cadastro de Produtos',
        produtos: estoque,
        sucesso: mensagemSucesso,
        editando: null
    });
});

app.post('/admin/cadastro', verificarAutenticacao, (req, res) => {
    const { nome, marca, preco, quantidade } = req.body;
    
    const novoProduto = {
        id: proximoId++,
        nome,
        marca,
        preco: parseFloat(preco),
        quantidade: parseInt(quantidade)
    };
    
    estoque.push(novoProduto);
    res.redirect('/admin/cadastro?sucesso=produto_cadastrado');
});

// Editar produto
app.get('/admin/editar/:id', verificarAutenticacao, (req, res) => {
    const id = parseInt(req.params.id);
    const produto = estoque.find(p => p.id === id);
    
    if (!produto) {
        return res.redirect('/admin/cadastro');
    }
    
    res.render('admin_cadastro', { 
        titulo: 'Editar Produto',
        produtos: estoque,
        sucesso: '',
        editando: produto
    });
});

app.post('/admin/editar/:id', verificarAutenticacao, (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, marca, preco, quantidade } = req.body;
    
    const produto = estoque.find(p => p.id === id);
    if (produto) {
        produto.nome = nome;
        produto.marca = marca;
        produto.preco = parseFloat(preco);
        produto.quantidade = parseInt(quantidade);
    }
    
    res.redirect('/admin/cadastro?sucesso=produto_alterado');
});

// Remover produto
app.get('/admin/remover/:id', verificarAutenticacao, (req, res) => {
    const id = parseInt(req.params.id);
    estoque = estoque.filter(p => p.id !== id);
    res.redirect('/admin/cadastro?sucesso=produto_removido');
});

// Página de vendas (loja)
app.get('/loja', (req, res) => {
    const sucesso = req.query.sucesso;
    const erro = req.query.erro;
    
    let mensagem = '';
    let tipoMensagem = '';
    
    if (sucesso === 'compra_realizada') {
        mensagem = 'Compra realizada com sucesso!';
        tipoMensagem = 'sucesso';
    } else if (sucesso === 'logout_realizado') {
        mensagem = 'Logout realizado com sucesso!';
        tipoMensagem = 'sucesso';
    } else if (erro === 'produto_indisponivel') {
        mensagem = 'Produto fora de estoque!';
        tipoMensagem = 'erro';
    } else if (erro === 'produto_nao_encontrado') {
        mensagem = 'Produto não encontrado!';
        tipoMensagem = 'erro';
    }
    
    const produtosDisponiveis = estoque.filter(p => p.quantidade > 0);
    
    res.render('loja', { 
        titulo: 'Flaviloja',
        produtos: produtosDisponiveis,
        mensagem,
        tipoMensagem,
        usuarioLogado
    });
});

// Comprar produto
app.get('/comprar/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const produto = estoque.find(p => p.id === id);
    
    if (!produto) {
        return res.redirect('/loja?erro=produto_nao_encontrado');
    }
    
    if (produto.quantidade <= 0) {
        return res.redirect('/loja?erro=produto_indisponivel');
    }
    
    produto.quantidade -= 1;
    res.redirect('/loja?sucesso=compra_realizada');
});

// Página inicial redireciona para a loja
app.get('/', (req, res) => {
    res.redirect('/loja');
});

app.listen(PORT, () => {
    console.log(`Sistema de Estoque rodando em http://localhost:${PORT}`);
    console.log('Para acessar a área admin:');
    console.log('Usuário: admin');
    console.log('Senha: 123');
});
