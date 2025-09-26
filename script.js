const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});


const inicioLink = document.getElementById('inicioLink');
if (inicioLink) {
  inicioLink.addEventListener('click', (e) => {
   
    e.preventDefault();
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  
    window.location.href = 'index.html';
  });
}

const produtos = [
  {
    nome: 'Camisa Tokio Revengers',
    preco: 'R$ 89,90',
    imagens: [
      'assets/camisa naruto.jpeg',
      'assets/camisa arte (2).jpeg'
    ]
  },
  {
    nome: 'Caneca Jujutsu-Kaisen',
    preco: 'R$ 149,90',
    imagens: [
      'assets/caneca naruto.jpeg',
      'assets/caneca arte (1).jpeg'
    ]
  },
  {
    nome: 'Caneca One',
    preco: 'R$ 199,90',
    imagens: [
      'assets/caneca one 1 1.jpeg',
      'assets/caneca one 1.jpeg',
      'assets/caneca one 2.jpeg'
    ]
  },
  {
    nome: 'Caneca One',
    preco: 'R$ 150,90',
    imagens: [
      'assets/caneca naruto 2.jpeg',
      'assets/caneca one 1.jpeg',
      'assets/caneca one 2.jpeg'
    ]
  },
  {
    nome: 'Camisa One',
    preco: 'R$ 300,90',
    imagens: [
      'assets/caneca naruto.jpeg',
      'assets/caneca one 1.jpeg',
      'assets/caneca one 2.jpeg'
    ]
  },
  {
    nome: 'Caneca One',
    preco: 'R$ 199,90',
    imagens: [
      'assets/caneca one 1 1.jpeg',
      'assets/caneca one 1.jpeg',
      'assets/caneca one 2.jpeg'
    ]
  }


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


function renderizarProdutos(listaProdutos = produtos) {
  const grid = document.getElementById('produtos');
  if (!grid) return;

  grid.innerHTML = '';

  listaProdutos.forEach(produto => {
    const card = document.createElement('div');
    card.className = 'produto';

    const mainImg = produto.imagens && produto.imagens.length ? produto.imagens[0] : '';
    card.innerHTML = `
      <div class="produto-img-box">
        <img loading="lazy" class="produto-main-img" src="${mainImg}" alt="${produto.nome}" />
        <div class="produto-thumbs">
          ${produto.imagens.map((img, idx) => `
            <img loading="lazy" src="${img}" class="thumb" data-src="${img}" data-index="${idx}" alt="thumb-${idx}" />
          `).join('')}
        </div>
      </div>
      <h3>${produto.nome}</h3>
      <p>${produto.preco}</p>
      <button 
        class="btn-comprar" 
        data-nome="${produto.nome}" 
        data-preco="${produto.preco}" 
        data-imagem="${mainImg}">
        Comprar
      </button>
    `;
    grid.appendChild(card);
  });

  // Clique nas miniaturas para trocar imagem principal
  document.querySelectorAll('.produto').forEach(prodCard => {
    const mainImgEl = prodCard.querySelector('.produto-main-img');
    const buyBtn = prodCard.querySelector('.btn-comprar');
    prodCard.querySelectorAll('.thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const src = e.currentTarget.dataset.src;
        if (mainImgEl) mainImgEl.src = src;
        if (buyBtn) buyBtn.dataset.imagem = src;
      });
    });
  });

  // Comprar adiciona ao carrinho
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
      <img loading="lazy" src="${item.imagem}" alt="${item.nome}" />
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



const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const suggestionsEl = document.getElementById('suggestions');


function debounce(fn, wait) {
  let t;
  return function(...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function renderSuggestions(list) {
  if (!suggestionsEl) return;
  suggestionsEl.innerHTML = '';
  if (!list.length) {
    suggestionsEl.style.display = 'none';
    return;
  }
  list.forEach(item => {
    const li = document.createElement('li');
    li.className = 'suggestion-item';
    li.tabIndex = 0;
    li.setAttribute('role', 'option');
    li.textContent = item.nome;
    li.addEventListener('click', () => {
      searchInput.value = item.nome;
      suggestionsEl.style.display = 'none';
      buscarProdutos();
    });
    li.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        searchInput.value = item.nome;
        suggestionsEl.style.display = 'none';
        buscarProdutos();
      }
    });
    suggestionsEl.appendChild(li);
  });
  suggestionsEl.style.display = 'block';
}

function buscarProdutos() {
  const termo = searchInput.value.trim().toLowerCase();
  if (!termo) {
    // Se vazio, mostra todos os produtos
    renderizarProdutos(produtos);
    return;
  }

  const filtrados = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(termo)
  );

  renderizarProdutos(filtrados);
}

if (searchButton) {
  searchButton.addEventListener('click', buscarProdutos);
}

if (searchInput) {
  // Permite buscar apertando Enter no input
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      buscarProdutos();
      suggestionsEl && (suggestionsEl.style.display = 'none');
    } else if (e.key === 'Escape') {
      suggestionsEl && (suggestionsEl.style.display = 'none');
    }
  });

  // Filtrar enquanto digita 
  const onType = debounce(() => {
    const termo = searchInput.value.trim().toLowerCase();
    if (!termo) {
      renderSuggestions([]);
      renderizarProdutos(produtos);
      return;
    }
    const sugeridos = produtos.filter(p => p.nome.toLowerCase().includes(termo));
    renderSuggestions(sugeridos.slice(0, 6));
  }, 180);

  searchInput.addEventListener('input', onType);

  // esconder sugestões ao perder foco (com atraso para permitir click)
  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      suggestionsEl && (suggestionsEl.style.display = 'none');
    }, 150);
  });
}



const categorias = {
  canecas: ['Caneca 1', 'Caneca 2', 'Caneca 3', 'Caneca 4'],
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
