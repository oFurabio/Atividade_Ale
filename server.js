const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Exercício 3: Rota Básica com EJS
app.get('/', (req, res) => {
    res.render('index', { 
        titulo: 'Página Inicial',
        mensagem: 'Bem-vindo ao site de Flávio Farias!' 
    });
});

// Exercício 4: Rota Dinâmica com Parâmetros
app.get('/boasvindas/:nome', (req, res) => {
    const nome = req.params.nome;
    res.render('boasvindas', { 
        titulo: 'Boas-vindas',
        nome: nome 
    });
});

// Exercício 5: Rota com Dados Personalizados
app.get('/perfil', (req, res) => {
    const dadosPerfil = {
        nome: 'Flávio Farias',
        endereco: 'Rua do Centro, 123 - São Paulo/SP',
        idade: 24,
        telefone: '(11) 94002-8922',
        email: 'flavio.farias@senac.com',
        especialidades: ['JavaScript', 'C#', 'Java', 'Unity'],
        experiencia: [
            { cargo: 'Professor de TI', empresa: 'Senac', periodo: '2023-2025' },
            { cargo: 'Desenvolvedor Junior', empresa: 'IBM Brasil', periodo: '2020-2022' }
        ]
    };
    
    res.render('perfil', { 
        titulo: 'Meu Perfil',
        dados: dadosPerfil 
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
