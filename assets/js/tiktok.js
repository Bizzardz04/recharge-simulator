// === ELEMENTOS ===
const searchInput = document.getElementById('searchInput');
const loader = document.getElementById('loader');
const userFound = document.getElementById('userFound');
const check = document.getElementById('check');
const rechargeBtn = document.getElementById('rechargeBtn');
const paymentModal = document.getElementById('paymentModal');
const processingModal = document.getElementById('processingModal');
const successModal = document.getElementById('successModal');
const buyBtn = document.getElementById('buyBtn');
const cardInfos = document.querySelectorAll('.card-info');
const coinButtons = document.querySelectorAll('.coin-button');
const customInput = document.querySelector('.custom-input');

let selectedCoins = 0;
let selectedPrice = 0;

// === BUSCADOR ===
searchInput.addEventListener('input', () => {
  const value = searchInput.value.trim();
  userFound.style.display = 'none';
  
  if (value.length > 0) {
    loader.style.display = 'block';
    setTimeout(() => {
      loader.style.display = 'none';
      userFound.style.display = 'flex';
      check.style.display = 'flex';
    }, 2500);
  } else {
    loader.style.display = 'none';
  }
});

// === SELECCIÓN DE MONEDAS ===
coinButtons.forEach(button => {
  button.addEventListener('click', () => {
    coinButtons.forEach(btn => btn.classList.remove('selected'));
    document.querySelector('.custom-input-container').classList.remove('selected');
    button.classList.add('selected');
    
    selectedCoins = parseInt(button.getAttribute('data-coins'));
    selectedPrice = parseFloat(button.getAttribute('data-price'));
    
    updateTotal();
  });
});

// === INPUT PERSONALIZADO ===
customInput.addEventListener('focus', () => {
  coinButtons.forEach(btn => btn.classList.remove('selected'));
  document.querySelector('.custom-input-container').classList.add('selected');
});

customInput.addEventListener('input', () => {
  const value = parseFloat(customInput.value) || 0;
  
  // 1 coin = $0.013
  selectedCoins = value;
  selectedPrice = value * 0.013;
  
  updateTotal();
});

// === ACTUALIZAR TOTAL ===
function updateTotal() {
  document.getElementById('totalCoins').textContent = selectedCoins.toLocaleString();
  document.getElementById('totalPrice').textContent = `$${selectedPrice.toFixed(2)}`;
}

// === MODALES ===
rechargeBtn.addEventListener('click', () => {
  if (selectedPrice > 0) {
    document.getElementById('buyAmount').textContent = selectedPrice.toFixed(2);
    paymentModal.classList.add('active');
  }
});


cardInfos.forEach(card => {
  card.addEventListener('click', () => {
    cardInfos.forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
  });
});

buyBtn.addEventListener('click', () => {
  paymentModal.classList.remove('active');
  processingModal.classList.add('active');

  setTimeout(() => {
    processingModal.classList.remove('active');
    successModal.classList.add('active');
    setTimeout(() => { successModal.classList.remove('active'); }, 3000);
  }, 2000);
});

