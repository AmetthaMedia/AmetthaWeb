document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIKA AKORDEON UNTUK HALAMAN LAYANAN ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            header.addEventListener('click', () => {
                const openItem = document.querySelector('.accordion-item.active');
                if(openItem && openItem !== item) {
                    openItem.classList.remove('active');
                    const openContent = openItem.querySelector('.accordion-content');
                    openContent.style.maxHeight = null;
                    openContent.style.padding = "0 1.5rem";
                }

                item.classList.toggle('active');
                const content = item.querySelector('.accordion-content');
                if(item.classList.contains('active')) {
                    content.style.maxHeight = content.scrollHeight + "px";
                    content.style.padding = "1.5rem";
                } else {
                    content.style.maxHeight = null;
                    content.style.padding = "0 1.5rem";
                }
            });
        });
    }

    // --- LOGIKA CHATBOT GEMINI ---
    const chatbotHTML = `
        <button class="chatbot-toggler">
            <i class="fa-solid fa-robot"></i>
        </button>
        <div class="chatbot">
            <div class="chatbot-header">
                <h2>A.M.I Assistant</h2>
            </div>
            <ul class="chatbox">
                <li class="chat bot">
                    <i class="fa-solid fa-robot"></i>
                    <p>Halo! Saya A.M.I, asisten AI dari Amettha MEDIA. Apa yang ingin Anda ketahui tentang layanan atau perusahaan kami?</p>
                </li>
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
                incomingChatLi.querySelector('p').textContent = "Oops! Terjadi kesalahan. Silakan coba lagi.";
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
