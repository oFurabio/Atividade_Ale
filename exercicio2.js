console.log('\n=== Exercício 2: Calculadora Simples ===');
function calculadoraSimples() {
    const args = process.argv.slice(2);
    
    if (args.length !== 3) {
        console.log('Erro: Quantidade inválida de argumentos.');
        console.log('Uso: node exercicio2.js <numero1> <operador> <numero2>');
        console.log('Exemplo: node exercicio2.js 10 + 5\n');
        return;
    }
    
    const num1 = parseFloat(args[0]);
    const operador = args[1];
    const num2 = parseFloat(args[2]);
    
    if (isNaN(num1) || isNaN(num2)) {
        console.log('Erro: Os argumentos devem ser números válidos\n');
        return;
    }
    
    let resultado;
    switch (operador) {
        case '+':
            resultado = num1 + num2;
            break;
        case '-':
            resultado = num1 - num2;
            break;
        case '*':
            resultado = num1 * num2;
            break;
        case '/':
            if (num2 === 0) {
                console.log('Erro: Divisão por zero não é permitida\n');
                return;
            }
            resultado = num1 / num2;
            break;
        case '^':
            resultado = Math.pow(num1, num2);
            break;
        default:
            console.log('Erro: Operador inválido. Use +, -, *, / ou ^\n');
            return;
    }
    
    console.log(`${num1} ${operador} ${num2} = ${resultado}\n`);
}

calculadoraSimples();
