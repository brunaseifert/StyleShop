const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const produtos = [
  { nome: 'Camisa Estampada', preco: 'R$ 89,90', imagem: 'assets/camisa.jpg' },
  { nome: 'Bolsa Casual', preco: 'R$ 149,90', imagem: 'assets/bolsa.jpg' },
  { nome: 'Tênis Branco', preco: 'R$ 199,90', imagem: 'assets/tenis.jpg' }
];

function precoParaNumero(preco) {
  return parseFloat(preco.replace('R$', '').replace(',', '.'));
}

function numeroParaPreco(num) {
  return `R$ ${num.toFixed(2).replace('.', ',')}`;
}

function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function carregarCarrinho() {
  const carrinhoJSON = localStorage.getItem('carrinho');
  return carrinhoJSON ? JSON.parse(carrinhoJSON) : [];
}

function atualizarContador() {
  const countSpan = document.getElementById('cartCount');
  if (!countSpan) return;
  const carrinho = carregarCarrinho();
  countSpan.textContent = carrinho.length;
}

function mostrarAlerta(mensagem) {
  const alerta = document.getElementById('alerta');
  if (!alerta) return;
  alerta.textContent = mensagem;
  alerta.classList.add('mostrar');
  setTimeout(() => {
    alerta.classList.remove('mostrar');
  }, 3000);
}

function renderizarProdutos() {
  const grid = document.getElementById('produtos');
  if (!grid) return;

  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" />
      <h3>${produto.nome}</h3>
      <p>${produto.preco}</p>
      <button 
        class="btn-comprar" 
        data-nome="${produto.nome}" 
        data-preco="${produto.preco}" 
        data-imagem="${produto.imagem}">
        Comprar
      </button>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('.btn-comprar').forEach(btn => {
    btn.addEventListener('click', e => {
      const btn = e.currentTarget;
      const produto = {
        nome: btn.dataset.nome,
        preco: btn.dataset.preco,
        imagem: btn.dataset.imagem
      };

      let carrinho = carregarCarrinho();
      carrinho.push(produto);
      salvarCarrinho(carrinho);
      atualizarContador();

      mostrarAlerta(`✅ ${produto.nome} adicionado ao carrinho`);
    });
  });
}

function renderizarCarrinho() {
  const cartContainer = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');
  const finalizeBtn = document.getElementById('finalizeBtn');
  if (!cartContainer || !cartTotal || !finalizeBtn) return;

  let carrinho = carregarCarrinho();
  cartContainer.innerHTML = '';

  let total = 0;
  let mensagem = 'Olá! Gostaria de finalizar a compra com os seguintes itens:%0A';

  carrinho.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'produto';
    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" />
      <h3>${item.nome}</h3>
      <p>${item.preco}</p>
      <button class="btn-excluir" data-index="${index}" title="Remover item" aria-label="Remover item do carrinho">&times;</button>
    `;
    cartContainer.appendChild(card);

    total += precoParaNumero(item.preco);
    mensagem += `• ${item.nome} - ${item.preco}%0A`;
  });

  cartTotal.textContent = `Total: ${numeroParaPreco(total)}`;
  mensagem += `Total: ${numeroParaPreco(total)}`;
  finalizeBtn.href = `https://wa.me/55SEUNUMERO?text=${mensagem}`; // troque SEUNUMERO pelo seu número

  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', e => {
      const index = e.currentTarget.dataset.index;
      let carrinho = carregarCarrinho();
      carrinho.splice(index, 1);
      salvarCarrinho(carrinho);
      renderizarCarrinho();
      atualizarContador();
    });
  });
}


if (document.getElementById('cartItems')) {
  renderizarCarrinho();
  atualizarContador();
} else if (document.getElementById('produtos')) {
  renderizarProdutos();
  atualizarContador();
}
