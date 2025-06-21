document.addEventListener('DOMContentLoaded', () => {

    // --- NAVBAR STICKY & RESPONSIVE ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.main-header');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // --- BACK TO TOP BUTTON ---
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
    }

    // --- AOS (Animate on Scroll) Initialization ---
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // --- Typed.js Initialization ---
    const typingElement = document.querySelector('#typing-animation');
    if (typingElement) {
        new Typed('#typing-animation', {
            strings: ['UMKM...', 'Sekolah...', 'Komunitas...', 'Bisnis Anda...'],
            typeSpeed: 70,
            backSpeed: 50,
            loop: true,
            smartBackspace: true,
        });
    }

    // --- LOGIKA AKORDEON ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const content = item.querySelector('.accordion-content');
                
                // Tutup item lain yang terbuka
                document.querySelectorAll('.accordion-item.active').forEach(openItem => {
                    if(openItem !== item) {
                        openItem.classList.remove('active');
                        openItem.querySelector('.accordion-content').style.maxHeight = null;
                    }
                });

                item.classList.toggle('active');
                if(item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            });
        });
    }

    // --- LOGIKA CHATBOT GEMINI ---
    const chatbotHTML = `
        <button class="chatbot-toggler"><i class="fa-solid fa-robot"></i></button>
        <div class="chatbot">
            <div class="chatbot-header"><h2>A.M.I Assistant</h2></div>
            <ul class="chatbox">
                <li class="chat bot"><i class="fa-solid fa-robot"></i><p>Halo! Saya A.M.I, asisten AI dari Amettha MEDIA. Ada yang bisa saya bantu?</p></li>
            </ul>
            <div class="chat-input">
                <textarea placeholder="Ketik pesan..." required></textarea>
                <button id="send-btn"><i class="fa-solid fa-paper-plane"></i></button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    const chatbotToggler = document.querySelector('.chatbot-toggler');
    const sendChatBtn = document.querySelector('#send-btn');
    const chatInput = document.querySelector('.chat-input textarea');
    const chatbox = document.querySelector('.chatbox');

    if (chatbotToggler) {
        chatbotToggler.addEventListener('click', () => document.body.classList.toggle('show-chatbot'));
    
        const handleChat = async () => {
            const userMessage = chatInput.value.trim();
            if (!userMessage) return;

            chatbox.innerHTML += `<li class="chat user"><p>${userMessage}</p></li>`;
            chatbox.scrollTo(0, chatbox.scrollHeight);
            chatInput.value = '';

            const incomingChatLi = document.createElement('li');
            incomingChatLi.classList.add('chat', 'bot');
            incomingChatLi.innerHTML = `<i class="fa-solid fa-robot"></i><p>Typing...</p>`;
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Gagal mendapatkan respons dari server.");
                }
                const data = await response.json();
                incomingChatLi.querySelector('p').textContent = data.reply;
            } catch (error) {
                console.error(error);
                incomingChatLi.querySelector('p').textContent = "Oops! Terjadi kesalahan. Silakan cek koneksi atau coba lagi nanti.";
                incomingChatLi.querySelector('p').style.color = '#ff7675';
            } finally {
                 chatbox.scrollTo(0, chatbox.scrollHeight);
            }
        }

        sendChatBtn.addEventListener('click', handleChat);
        chatInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleChat();
            }
        });
    }
});
