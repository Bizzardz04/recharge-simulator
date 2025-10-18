
document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.getElementById('searchInput');
  const loader = document.getElementById('loader');
  const userFound = document.getElementById('userFound');
  const rechargeBtn = document.getElementById('rechargeBtn');
  const paymentModal = document.getElementById('paymentModal');
  const processingModal = document.getElementById('processingModal');
  const successModal = document.getElementById('successModal');
  const buyBtn = document.getElementById('buyBtn');
  const cardInfos = document.querySelectorAll('.card-info');
  const coinButtons = document.querySelectorAll('.coin-button');
  const desktopCustomInput = document.getElementById('customCoins'); 
  const acceptSuccess = document.getElementById('acceptSuccess');
  const countdownElement = document.getElementById('countdown');
  const tiktokProfile = document.getElementById('tiktokProfile');


  const customModal = document.getElementById('customModal');
  const mobileCustomInput = document.getElementById('customInputValue');
  const customTotal = document.getElementById('customTotal');
  const customRechargeBtn = document.getElementById('customRechargeBtn');
  const keys = document.querySelectorAll('.key');


  let timer = null;
  let selectedCoins = 0;
  let selectedPrice = 0;
  let searchDebounce = null;

 
  if (loader) loader.style.display = 'none';
  if (userFound) {
    userFound.style.display = 'none';
    userFound.style.opacity = '0';

  }
  if (tiktokProfile) tiktokProfile.innerHTML = '';

 
  function updateTotal() {
    const totalCoinsElement = document.getElementById('totalCoins');
    const totalPriceElement = document.getElementById('totalPrice');
    if (totalCoinsElement) totalCoinsElement.textContent = selectedCoins.toLocaleString();
    if (totalPriceElement) totalPriceElement.textContent = `$${selectedPrice.toFixed(2)}`;
  }


  if (coinButtons && coinButtons.length) {
    coinButtons.forEach(button => {
      button.addEventListener('click', () => {
        coinButtons.forEach(btn => btn.classList.remove('selected'));
        const customContainer = document.querySelector('.custom-input-container');
        if (customContainer) customContainer.classList.remove('selected');

        button.classList.add('selected');
        selectedCoins = parseInt(button.getAttribute('data-coins')) || 0;
        selectedPrice = parseFloat(button.getAttribute('data-price')) || 0;
        updateTotal();
      });
    });
  }


  if (rechargeBtn) {
    rechargeBtn.addEventListener('click', () => {
      if (!paymentModal) return;
      if (selectedPrice > 0) {
        const username = (searchInput && searchInput.value.trim()) || '';
        const summaryAccount = document.getElementById('summaryAccount');
        if (summaryAccount) summaryAccount.textContent = username ? '@' + username : '';
        const summaryCoins = document.getElementById('summaryCoins');
        if (summaryCoins) summaryCoins.textContent = selectedCoins.toLocaleString();
        const summaryPrice = document.getElementById('summaryPrice');
        if (summaryPrice) summaryPrice.textContent = `$${selectedPrice.toFixed(2)}`;

        paymentModal.classList.add('active');
        document.body.classList.add('modal-open');
      }
    });
  }


  const closePaymentBtn = document.getElementById('closePaymentModal');
  if (closePaymentBtn && paymentModal) {
    closePaymentBtn.addEventListener('click', () => {
      paymentModal.classList.remove('active');
      document.body.classList.remove('modal-open');
    });
  }


  if (cardInfos && cardInfos.length) {
    cardInfos.forEach(card => {
      card.addEventListener('click', () => {
        cardInfos.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      });
    });
  }


  if (buyBtn && processingModal && successModal && countdownElement) {
    buyBtn.addEventListener('click', () => {
      if (paymentModal) paymentModal.classList.remove('active');
      processingModal.classList.add('active');
      countdownElement.textContent = "05:00";
      clearInterval(timer);
      let timeLeft = 3;
      timer = setInterval(() => {
        timeLeft--;
        const minutes = 4;
        const seconds = 57 + timeLeft;
        if (countdownElement) countdownElement.textContent = `${minutes}:${String(seconds).padStart(2, '0')}`;
        if (timeLeft <= 0) {
          clearInterval(timer);
          processingModal.classList.remove('active');
          successModal.classList.add('active');
          const paidAmountEl = document.getElementById('paidAmount');
          if (paidAmountEl) paidAmountEl.textContent = `$${selectedPrice.toFixed(2)}`;
        }
      }, 1000);
    });
  }


  if (acceptSuccess) {
    acceptSuccess.addEventListener('click', () => {
      if (successModal) successModal.classList.remove('active');
      if (processingModal) processingModal.classList.remove('active');
      document.body.classList.remove('modal-open');
      if (countdownElement) countdownElement.textContent = "05:00";

      selectedCoins = 0;
      selectedPrice = 0;
      updateTotal();
      if (coinButtons && coinButtons.length) coinButtons.forEach(btn => btn.classList.remove('selected'));
      const customContainer = document.querySelector('.custom-input-container');
      if (customContainer) customContainer.classList.remove('selected');

      if (desktopCustomInput) desktopCustomInput.value = '';
      if (mobileCustomInput) mobileCustomInput.value = '';
      if (customTotal) customTotal.textContent = '0';
    });
  }


  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;


  if (!isMobile && desktopCustomInput) {
    desktopCustomInput.setAttribute('inputmode', 'numeric');
    desktopCustomInput.setAttribute('pattern', '\\d*');

    desktopCustomInput.addEventListener('keypress', (e) => {

      if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Enter') {
        e.preventDefault();
      }
    });

    desktopCustomInput.addEventListener('input', (e) => {

      const raw = (e.target.value || '').toString().replace(/,/g, '').trim();
      const val = raw === '' ? 0 : (parseFloat(raw) || 0);
      selectedCoins = val;
      selectedPrice = val * 0.013;
      if (coinButtons && coinButtons.length) coinButtons.forEach(btn => btn.classList.remove('selected'));
      const customContainer = document.querySelector('.custom-input-container');
      if (customContainer) customContainer.classList.add('selected');
      updateTotal();
    });
  }


  if (isMobile && customModal && mobileCustomInput) {
    const modalBox = customModal.querySelector('.custom-modal-content');
    const desktopInputEl = document.getElementById('customCoins');

    if (desktopInputEl) {
      desktopInputEl.addEventListener('focus', (e) => {
        e.preventDefault();
        desktopInputEl.blur();
        customModal.style.display = 'flex';
        modalBox.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        modalBox.style.opacity = '0';
        modalBox.style.transform = 'translateY(100%)';
        setTimeout(() => {
          modalBox.style.opacity = '1';
          modalBox.style.transform = 'translateY(0)';
        }, 10);
        document.body.style.overflow = 'hidden';
      });

     
      const customContainer = document.getElementById('customContainer');
      if (customContainer) {
        customContainer.addEventListener('click', () => {
          customModal.style.display = 'flex';
          modalBox.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
          modalBox.style.opacity = '1';
          modalBox.style.transform = 'translateY(0)';
          document.body.style.overflow = 'hidden';
        });
      }
    }

   
    customModal.addEventListener('click', (e) => {
      if (!modalBox.contains(e.target)) {
        modalBox.style.transform = 'translateY(100%)';
        modalBox.style.opacity = '0';
        setTimeout(() => {
          customModal.style.display = 'none';
          document.body.style.overflow = '';
        }, 220);
      }
    });

   
    if (keys && keys.length) {
      keys.forEach(key => {
        key.addEventListener('click', () => {
          key.classList.add('pressed');
          setTimeout(() => key.classList.remove('pressed'), 120);

          if (key.classList.contains('delete')) {
            mobileCustomInput.value = mobileCustomInput.value.slice(0, -1);
          } else {
            mobileCustomInput.value += key.textContent;
          }
          if (customTotal) customTotal.textContent = mobileCustomInput.value || '0';
        });
      });
    }

    
    if (customRechargeBtn) {
      customRechargeBtn.addEventListener('click', () => {
        const raw = (mobileCustomInput.value || '0').toString().replace(/,/g, '').trim();
        const value = raw === '' ? 0 : (parseFloat(raw) || 0);
        if (value > 0) {
          selectedCoins = value;
          selectedPrice = value * 0.013;
          updateTotal();
          if (coinButtons && coinButtons.length) coinButtons.forEach(btn => btn.classList.remove('selected'));
          const customContainer = document.querySelector('.custom-input-container');
          if (customContainer) customContainer.classList.add('selected');

          const username = (searchInput && searchInput.value.trim()) || '';
          const summaryAccount = document.getElementById('summaryAccount');
          if (summaryAccount) summaryAccount.textContent = username ? '@' + username : '';
          const summaryCoins = document.getElementById('summaryCoins');
          if (summaryCoins) summaryCoins.textContent = selectedCoins.toLocaleString();
          const summaryPrice = document.getElementById('summaryPrice');
          if (summaryPrice) summaryPrice.textContent = `$${selectedPrice.toFixed(2)}`;

          
          modalBox.style.transform = 'translateY(100%)';
          modalBox.style.opacity = '0';
          customModal.style.display = 'none';
          document.body.style.overflow = '';
          if (paymentModal) {
            paymentModal.classList.add('active');
            document.body.classList.add('modal-open');
          }
        } else {
          mobileCustomInput.style.animation = 'shake 0.2s';
          setTimeout(() => (mobileCustomInput.style.animation = ''), 200);
        }
      });
    }
  }


if (searchInput && userFound && loader) {
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.trim();

   
    if (searchDebounce) clearTimeout(searchDebounce);

    
    if (value === '') {
      loader.style.display = 'none';
      userFound.style.display = 'none';
      userFound.style.opacity = '0';
      userFound.innerHTML = ''; 
      return;
    }


    loader.style.display = 'block';
    userFound.style.display = 'none';
    userFound.style.opacity = '0';
    userFound.innerHTML = '';

     
    searchDebounce = setTimeout(() => {
      loader.style.display = 'none';

    
      userFound.style.display = 'flex';
      userFound.style.alignItems = 'center';
      userFound.style.gap = '8px';
      userFound.style.opacity = '1';
      userFound.style.background = 'none';
      userFound.style.border = 'none';
      userFound.style.padding = '0';
      userFound.style.marginTop = '10px';
      userFound.style.fontWeight = '600';
      userFound.style.color = '#000000';
      userFound.style.fontSize = '0.95rem';
      userFound.style.textShadow = 'none';

      userFound.innerHTML = `
        <span style="color:#4ade80;font-size:1.3rem;">✔</span>
        <span style="color:#000000;">User found</span>
      `;
    }, 2000);
  });
}
});
