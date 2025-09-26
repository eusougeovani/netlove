// Carrossel responsivo: quantidade de miniaturas depende do tamanho da tela
function getVisibleCount() {
    if (window.innerWidth < 500) return 2;
    if (window.innerWidth < 900) return 3;
    if (window.innerWidth < 1200) return 4;
    return 6;
}

function fadeCards(cards, visibleIdxs, callback) {
    // Fade out all cards
    cards.forEach((card, idx) => {
        if (card.style.display === 'flex') {
            card.classList.add('fade-out');
        }
    });
    setTimeout(() => {
        // Hide all cards
        cards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('fade-out');
        });
        // Show new cards with fade-in
        visibleIdxs.forEach(idx => {
            cards[idx].style.display = 'flex';
            cards[idx].classList.add('fade-in');
        });
        setTimeout(() => {
            visibleIdxs.forEach(idx => cards[idx].classList.remove('fade-in'));
            if (callback) callback();
        }, 300);
    }, 200);
}

function setupCarousel(carousel) {
    const track = carousel.querySelector('.carousel-track');
    const cards = Array.from(track.children);
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let visibleCount = getVisibleCount();
    let startIdx = 0;

    function updateCarousel(withTransition = false) {
        visibleCount = getVisibleCount();
        const visibleIdxs = [];
        for (let i = startIdx; i < startIdx + visibleCount && i < cards.length; i++) {
            visibleIdxs.push(i);
        }
        if (withTransition) {
            fadeCards(cards, visibleIdxs, () => {
                prevBtn.style.visibility = startIdx === 0 ? 'hidden' : 'visible';
                nextBtn.style.visibility = startIdx + visibleCount >= cards.length ? 'hidden' : 'visible';
            });
        } else {
            cards.forEach((card, idx) => {
                card.style.display = (idx >= startIdx && idx < startIdx + visibleCount) ? 'flex' : 'none';
            });
            prevBtn.style.visibility = startIdx === 0 ? 'hidden' : 'visible';
            nextBtn.style.visibility = startIdx + visibleCount >= cards.length ? 'hidden' : 'visible';
        }
    }

    prevBtn.onclick = () => {
        if (startIdx > 0) {
            startIdx -= visibleCount;
            if (startIdx < 0) startIdx = 0;
            updateCarousel(true);
        }
    };
    nextBtn.onclick = () => {
        if (startIdx + visibleCount < cards.length) {
            startIdx += visibleCount;
            updateCarousel(true);
        }
    };

    window.addEventListener('resize', () => {
        visibleCount = getVisibleCount();
        if (startIdx + visibleCount > cards.length) {
            startIdx = Math.max(0, cards.length - visibleCount);
        }
        updateCarousel();
    });

    updateCarousel();
}

document.querySelectorAll('.carousel').forEach(setupCarousel);

// Modal tela cheia
const modal = document.getElementById('fullscreen-modal');
const modalContent = modal.querySelector('.modal-content');
const closeModal = modal.querySelector('.close-modal');

document.querySelectorAll('.card img').forEach(img => {
    img.onclick = () => {
        modalContent.innerHTML = `<img src="${img.src}" alt="${img.alt}" style="max-width:90vw;max-height:90vh;">`;
        modal.style.display = 'flex';
    };
});

// Remove controles dos vídeos das miniaturas
document.querySelectorAll('.card.video video').forEach(video => {
    video.removeAttribute('controls');
    video.pause();
    video.currentTime = 0;
    // Impede reprodução na miniatura
    video.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Abre o modal em tela cheia
        const src = video.querySelector('source').src;
        modalContent.innerHTML = `<video src="${src}" controls autoplay style="max-width:90vw;max-height:90vh;"></video>`;
        modal.style.display = 'flex';
        video.pause();
        video.currentTime = 0;
    };
});

closeModal.onclick = () => {
    modal.style.display = 'none';
    modalContent.innerHTML = '';
};

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalContent.innerHTML = '';
    }
};

// Defina a data inicial (ano, mês-1, dia, hora, minuto, segundo)
const dataInicial = new Date(2024, 10, 3, 22, 42, 0);

function atualizarCronometro() {
    const cronometroDiv = document.getElementById('cronometro');
    if (!cronometroDiv) return; // Garante que o elemento existe

    const agora = new Date();
    let anos = agora.getFullYear() - dataInicial.getFullYear();
    let meses = agora.getMonth() - dataInicial.getMonth();
    let dias = agora.getDate() - dataInicial.getDate();
    let horas = agora.getHours() - dataInicial.getHours();
    let minutos = agora.getMinutes() - dataInicial.getMinutes();
    let segundos = agora.getSeconds() - dataInicial.getSeconds();

    if (segundos < 0) {
        segundos += 60;
        minutos--;
    }
    if (minutos < 0) {
        minutos += 60;
        horas--;
    }
    if (horas < 0) {
        horas += 24;
        dias--;
    }
    if (dias < 0) {
        // Ajuste para o mês anterior
        const mesAnterior = new Date(agora.getFullYear(), agora.getMonth(), 0);
        dias += mesAnterior.getDate();
        meses--;
    }
    if (meses < 0) {
        meses += 12;
        anos--;
    }

    cronometroDiv.innerHTML =
        `<strong>Estamos Conectados Faz:</strong><br>
        ${anos} anos, ${meses} meses, ${dias} dias,<br>
        ${horas} horas, ${minutos} minutos, ${segundos} segundos`;
}

setInterval(atualizarCronometro, 1000);
atualizarCronometro();

function check() {
    const wrapper = document.querySelector('.wrapper');
    const cks = document.querySelectorAll('.wrapper input[type="checkbox"]');
    if (cks[0].checked && cks[1].checked && cks[2].checked) {
        wrapper.classList.add('throb');
    } else {
        wrapper.classList.remove('throb');
    }
}