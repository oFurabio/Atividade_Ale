const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Histórico de operações (para o desafio)
let historicoOperacoes = [];

// Exercício 6: Middleware de Log
app.use((req, res, next) => {
    const agora = new Date().toLocaleString('pt-BR');
    console.log(`[${agora}] ${req.method} ${req.url}`);
    next();
});

// Exercício 7: Calculadora com Interface Web
app.get('/', (req, res) => {
    res.render('calculadora', { 
        titulo: 'Calculadora Web',
        resultado: null,
        mostrarHistorico: false,
        historico: []
    });
});

// Exercício 8: Middleware de Cálculo
const middlewareCalculadora = (req, res, next) => {
    if (req.method === 'POST' && req.url === '/calcular') {
        const { num1, num2, operador, acao } = req.body;
        
        // Botão de zerar
        if (acao === 'zerar') {
            req.resultado = {
                sucesso: true,
                valor: 0,
                operacao: 'Calculadora zerada'
            };
            return next();
        }
        
        // Validações
        const numero1 = parseFloat(num1);
        const numero2 = parseFloat(num2);
        
        if (isNaN(numero1) || isNaN(numero2)) {
            req.resultado = {
                sucesso: false,
                erro: 'Por favor, insira números válidos'
            };
            return next();
        }
        
        let resultado;
        let operacaoTexto = `${numero1} ${operador} ${numero2}`;
        
        switch (operador) {
            case '+':
                resultado = numero1 + numero2;
                break;
            case '-':
                resultado = numero1 - numero2;
                break;
            case '*':
                resultado = numero1 * numero2;
                break;
            case '/':
                if (numero2 === 0) {
                    req.resultado = {
                        sucesso: false,
                        erro: 'Divisão por zero não é permitida'
                    };
                    return next();
                }
                resultado = numero1 / numero2;
                break;
            case '^':
                resultado = Math.pow(numero1, numero2);
                break;
            default:
                req.resultado = {
                    sucesso: false,
                    erro: 'Operador inválido'
                };
                return next();
        }
        
        // Adicionar ao histórico
        const operacaoCompleta = `${operacaoTexto} = ${resultado}`;
        historicoOperacoes.push({
            operacao: operacaoCompleta,
            timestamp: new Date().toLocaleString('pt-BR')
        });
        
        req.resultado = {
            sucesso: true,
            valor: resultado,
            operacao: operacaoCompleta
        };
    }
    next();
};

app.use(middlewareCalculadora);

app.post('/calcular', (req, res) => {
    const { mostrar_historico } = req.body;
    
    res.render('calculadora', { 
        titulo: 'Calculadora Web',
        resultado: req.resultado,
        mostrarHistorico: mostrar_historico === 'sim',
        historico: historicoOperacoes.slice(-10) // Últimas 10 operações
    });
});

app.listen(PORT, () => {
    console.log(`Servidor com middleware rodando em http://localhost:${PORT}`);
});
