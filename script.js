const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const produtos = [
  { nome: 'Camisa Tokio Revengers', preco: 'R$ 89,90', imagem: 'assets/camisa naruto.jpeg' },
  { nome: 'Caneca Jujutsu-kaisen', preco: 'R$ 149,90', imagem: 'assets/caneca naruto.jpeg' },
  { nome: 'Tênis Branco', preco: 'R$ 199,90', imagem: 'assets/caneca one 1 1.jpeg' }
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
  if (!alerta) {
    console.log(mensagem);
    return;
  }
  alerta.textContent = mensagem;
  alerta.classList.add('mostrar');
  setTimeout(() => {
    alerta.classList.remove('mostrar');
  }, 3000);
}

function renderizarProdutos() {
  const grid = document.getElementById('produtos');
  if (!grid) return;

  grid.innerHTML = '';

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
    card.style.position = 'relative';
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

  finalizeBtn.href = `https://wa.me/11970128962?text=${mensagem}`;

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

// --- CATEGORIAS COM IMAGENS DINÂMICAS ---
const categorias = {
  canecas: ['Caneca 1', 'Caneca 2', 'Caneca 3'],
  camisas: ['Camisa Estampada', 'Camisa Básica', 'Camisa Polo'],
  quadros: ['Quadro Abstrato', 'Quadro Natureza', 'Quadro Cidade'],
  chaveiros: ['Chaveiro Metal', 'Chaveiro Couro', 'Chaveiro Plástico']
};

const categoriaGrid = document.getElementById('categoriaGrid');
const categoriaDetalhe = document.getElementById('categoriaDetalhe');
const categoriaTitulo = document.getElementById('categoriaTitulo');
const opcoesLista = document.getElementById('opcoesLista');
const voltarBtn = document.getElementById('voltarBtn');

if (categoriaGrid && categoriaDetalhe && categoriaTitulo && opcoesLista && voltarBtn) {
  categoriaGrid.addEventListener('click', (e) => {
    const catDiv = e.target.closest('.categoria');
    if (!catDiv) return;

    const catId = catDiv.dataset.id;
    if (!catId || !categorias[catId]) return;

    categoriaGrid.style.display = 'none';
    categoriaDetalhe.style.display = 'block';

    categoriaTitulo.textContent = catDiv.textContent;

    opcoesLista.innerHTML = '';

    categorias[catId].forEach(item => {
      const li = document.createElement('li');

      const fileName = item
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, '-') + '.jpg'; 

      li.innerHTML = `
        <img src="assets/${fileName}" alt="${item}" class="categoria-img" />
        <span>${item}</span>
      `;

      opcoesLista.appendChild(li);
    });
  });

  voltarBtn.addEventListener('click', () => {
    categoriaGrid.style.display = 'grid';
    categoriaDetalhe.style.display = 'none';
  });
}

if (document.getElementById('cartItems')) {
  renderizarCarrinho();
  atualizarContador();
} else if (document.getElementById('produtos')) {
  renderizarProdutos();
  atualizarContador();
}
