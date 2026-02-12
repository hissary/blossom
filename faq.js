// Бургер-меню
const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

burgerMenu.addEventListener('click', function () {
    mobileMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function (event) {
    if (!burgerMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
        mobileMenu.classList.remove('active');
        burgerMenu.classList.remove('active');
    }
});

// FAQ аккордеон
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Фильтрация FAQ по категориям
document.querySelectorAll('.faq-category-btn').forEach(button => {
    button.addEventListener('click', () => {
        // Убираем активный класс у всех кнопок
        document.querySelectorAll('.faq-category-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Добавляем активный класс нажатой кнопке
        button.classList.add('active');

        const category = button.getAttribute('data-category');
        const allItems = document.querySelectorAll('.faq-item');

        allItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category').includes(category)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Поиск по FAQ
const searchInput = document.querySelector('.faq-search-input');
searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    const items = document.querySelectorAll('.faq-item');

    items.forEach(item => {
        const question = item.querySelector('.faq-question span').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});