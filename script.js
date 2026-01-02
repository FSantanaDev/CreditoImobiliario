document.addEventListener('DOMContentLoaded', function() {
    
    // --- Configuração do WhatsApp Float ---
    const whatsappBtn = document.getElementById('whatsapp-btn');
    const phoneNumber = '5592999889392'; 
    const message = encodeURIComponent('Olá! Gostaria de mais informações sobre a documentação para crédito imobiliário.');

    if (whatsappBtn) {
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        whatsappBtn.href = whatsappUrl;
    }

    // --- Máscaras de Input (Moeda) ---
    const currencyInputs = [document.getElementById('valor-imovel'), document.getElementById('valor-entrada')];

    currencyInputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = (value / 100).toFixed(2) + '';
            value = value.replace('.', ',');
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            e.target.value = value === '0,00' ? '' : 'R$ ' + value;
        });
    });

    // --- Lógica do Simulador (Tabela SAC Simplificada) ---
    const formSimulator = document.getElementById('simulator-form');
    const resultBox = document.getElementById('result-box');
    const whatsappSimBtn = document.getElementById('whatsapp-sim-btn');

    if (formSimulator) {
        formSimulator.addEventListener('submit', function(e) {
            e.preventDefault();

            // 1. Obter valores
            const valorImovelStr = document.getElementById('valor-imovel').value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            const valorEntradaStr = document.getElementById('valor-entrada').value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            const prazoAnos = parseInt(document.getElementById('prazo-anos').value);

            const valorImovel = parseFloat(valorImovelStr) || 0;
            const valorEntrada = parseFloat(valorEntradaStr) || 0;
            const prazoMeses = prazoAnos * 12;
            const taxaJurosAnual = 0.105; // 10.5% a.a. (Exemplo)
            const taxaJurosMensal = taxaJurosAnual / 12;

            // 2. Validações básicas
            if (valorImovel <= 0) {
                alert('Por favor, insira um valor de imóvel válido.');
                return;
            }
            if (valorEntrada >= valorImovel) {
                alert('O valor da entrada deve ser menor que o valor do imóvel.');
                return;
            }

            // 3. Cálculos (SAC)
            // Amortização constante = (Valor Financiado) / Prazo
            const valorFinanciado = valorImovel - valorEntrada;
            const amortizacao = valorFinanciado / prazoMeses;

            // 1ª Parcela = Amortização + Juros sobre saldo devedor total
            const jurosPrimeira = valorFinanciado * taxaJurosMensal;
            const primeiraParcela = amortizacao + jurosPrimeira;

            // Última Parcela = Amortização + Juros sobre 1 amortização (aprox)
            // Na última parcela, o saldo devedor é igual a 1 amortização.
            const jurosUltima = amortizacao * taxaJurosMensal;
            const ultimaParcela = amortizacao + jurosUltima;

            // 4. Exibir Resultados
            document.getElementById('res-financiado').innerText = formatCurrency(valorFinanciado);
            document.getElementById('res-primeira').innerText = formatCurrency(primeiraParcela);
            document.getElementById('res-ultima').innerText = formatCurrency(ultimaParcela);

            // 5. Atualizar botão do WhatsApp com os dados da simulação
            const msgSimulacao = encodeURIComponent(
                `Olá! Fiz uma simulação no site:\n` +
                `🏠 Imóvel: ${formatCurrency(valorImovel)}\n` +
                `💰 Entrada: ${formatCurrency(valorEntrada)}\n` +
                `📅 Prazo: ${prazoAnos} anos\n` +
                `📊 1ª Parcela estimada: ${formatCurrency(primeiraParcela)}\n` +
                `Gostaria de saber mais detalhes!`
            );
            whatsappSimBtn.href = `https://wa.me/${phoneNumber}?text=${msgSimulacao}`;

            // Mostrar caixa de resultado
            resultBox.classList.remove('hidden');
        });
    }

    // Função auxiliar para formatar moeda
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    // --- Animação de Scroll ---
    const cards = document.querySelectorAll('.card');
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // entry.target.classList.add('fade-in'); // Se houver classe CSS
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => observer.observe(card));
});
