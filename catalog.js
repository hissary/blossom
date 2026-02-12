const products = window.PRODUCTS || [];

let activeSort = 'default';
let activeFilters = new Set(['Уход за кожей', 'Косметика', 'Уход за телом', 'Волосы и ногти']);
let searchQuery = '';

const grid = document.getElementById('productGrid');
const searchInput = document.getElementById('catalogSearch');
const filterToggle = document.getElementById('filterToggle');
const filterPanel = document.getElementById('filterPanel');
const filterClose = document.getElementById('filterClose');
const filterApply = document.getElementById('filterApply');
const filterReset = document.getElementById('filterReset');
const sortToggle = document.getElementById('sortToggle');
const sortPanel = document.getElementById('sortPanel');
const sortOptions = sortPanel ? sortPanel.querySelectorAll('.dropdown-item') : [];

const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');

const formatPrice = (price) => `${price} ₽`;

const labelClass = (color) => {
    switch (color) {
        case 'orange':
            return 'badge orange';
        case 'blue':
            return 'badge blue';
        case 'gray':
            return 'badge gray';
        default:
            return 'badge';
    }
};

const renderProducts = () => {
    if (!grid) return;
    const filtered = products
        .filter((item) => activeFilters.has(item.label))
        .filter((item) => {
            const q = searchQuery.trim().toLowerCase();
            if (!q) return true;
            return (
                item.title.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q)
            );
        })
        .sort((a, b) => {
            if (activeSort === 'price-asc') return a.price - b.price;
            if (activeSort === 'price-desc') return b.price - a.price;
            if (activeSort === 'rating') return b.rating - a.rating;
            return a.id - b.id;
        });

    const placeholder = typeof window.PLACEHOLDER_IMAGE !== 'undefined' ? window.PLACEHOLDER_IMAGE : 'https://placehold.co/320x200/e5e7eb/9ca3af?text=Товар';
    grid.innerHTML = filtered
        .map(
            (item) => {
                const imgSrc = (item.image && item.image.trim()) ? item.image : placeholder;
                return `
        <article class="product-card" data-product-id="${item.id}">
            <div class="product-card-image">
                <img src="${imgSrc}" alt="${item.title}" loading="lazy" />
            </div>
            <div class="product-card-body">
                <div class="card-header">
                    <span class="${labelClass(item.labelColor)}">${item.label}</span>
                    <span class="price">${formatPrice(item.price)}</span>
                </div>
                <div class="product-title">${item.title}</div>
                <button class="buy-btn" data-product-id="${item.id}">В корзину</button>
            </div>
        </article>
        `;
            }
        )
        .join('');
};

const handleAddToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    window.cart?.add({
        id: product.id,
        title: product.title,
        desc: product.desc,
        price: product.price
    });
};

// Модальное окно для большой карточки товара
const productModalOverlay = document.getElementById('productModalOverlay');
const productModalContent = document.getElementById('productModalContent');
const productModalClose = document.getElementById('productModalClose');

const openProductModal = (productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product || !productModalOverlay || !productModalContent) return;

    const placeholder = typeof window.PLACEHOLDER_IMAGE !== 'undefined' ? window.PLACEHOLDER_IMAGE : 'https://placehold.co/320x200/e5e7eb/9ca3af?text=Товар';
    const imgSrc = (product.image && product.image.trim()) ? product.image : placeholder;

    productModalContent.innerHTML = `
        <div class="product-modal-image">
            <img src="${imgSrc}" alt="${product.title}" />
        </div>
        <div class="product-modal-header">
            <div style="flex: 1;">
                <span class="product-modal-label">${product.label}</span>
                <h1 class="product-modal-title">${product.title}</h1>
                <p class="product-modal-desc">${product.desc}</p>
                <div class="product-modal-meta">
                    ${product.brand ? `<span class="product-modal-brand">Бренд: ${product.brand}</span>` : ''}
                    <span class="product-modal-rating">
                        <i class="fa-solid fa-star"></i> ${product.rating.toFixed(1)} (${product.reviews})
                    </span>
                </div>
            </div>
            <div class="product-modal-price">${formatPrice(product.price)}</div>
        </div>
        <div class="product-modal-actions">
            <button class="product-modal-buy" data-product-id="${product.id}">Купить</button>
            <a class="product-modal-link" href="../pages/product.html?id=${product.id}">Подробнее</a>
        </div>
    `;

    // Обработчик кнопки "Купить" в модальном окне
    const buyBtn = productModalContent.querySelector('.product-modal-buy');
    if (buyBtn) {
        buyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            handleAddToCart(product.id);
            // Можно закрыть модальное окно после добавления в корзину или оставить открытым
        });
    }

    productModalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
};

const closeProductModal = () => {
    if (productModalOverlay) {
        productModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};

// Инициализация модального окна
const initProductModal = () => {
    if (!productModalOverlay || !productModalClose) return;

    // Закрытие по кнопке
    productModalClose.addEventListener('click', closeProductModal);

    // Закрытие по клику на overlay (но не на сам модальный контент)
    productModalOverlay.addEventListener('click', (e) => {
        if (e.target === productModalOverlay) {
            closeProductModal();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModalOverlay.classList.contains('active')) {
            closeProductModal();
        }
    });
};

const syncFilterState = () => {
    const checkboxes = filterPanel.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = activeFilters.has(checkbox.value);
    });
};

const collectFilters = () => {
    const checkboxes = filterPanel.querySelectorAll('input[type="checkbox"]');
    const selected = new Set();
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) selected.add(checkbox.value);
    });
    activeFilters = selected.size === 0
        ? new Set(['Уход за кожей', 'Косметика', 'Уход за телом', 'Волосы и ногти'])
        : selected;
};

const closeDropdowns = (event) => {
    if (filterPanel && filterPanel.classList.contains('open')) {
        if (!filterPanel.contains(event.target) && !filterToggle.contains(event.target)) {
            filterPanel.classList.remove('open');
        }
    }
    if (sortPanel && sortPanel.classList.contains('open')) {
        if (!sortPanel.contains(event.target) && !sortToggle.contains(event.target)) {
            sortPanel.classList.remove('open');
        }
    }
};

const initNavbarToggle = () => {
    if (!burgerMenu || !mobileMenu) return;
    burgerMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        burgerMenu.classList.toggle('active');
    });
    document.addEventListener('click', (event) => {
        if (!burgerMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.remove('active');
            burgerMenu.classList.remove('active');
        }
    });
};

const initSearch = () => {
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderProducts();
    });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            searchQuery = e.target.value;
            renderProducts();
        }
    });
};

const applyQueryFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q');
    const collection = params.get('collection');

    const allowedCollections = new Set(['Уход за кожей', 'Косметика', 'Уход за телом', 'Волосы и ногти']);

    if (collection && allowedCollections.has(collection)) {
        activeFilters = new Set([collection]);
        syncFilterState();
    }

    if (initialQuery && searchInput) {
        searchQuery = initialQuery;
        searchInput.value = initialQuery;
    }
};

const initFilters = () => {
    if (!filterToggle || !filterPanel) return;
    filterToggle.addEventListener('click', () => {
        syncFilterState();
        filterPanel.classList.toggle('open');
    });
    filterClose?.addEventListener('click', () => filterPanel.classList.remove('open'));
    filterApply?.addEventListener('click', () => {
        collectFilters();
        filterPanel.classList.remove('open');
        renderProducts();
    });
    filterReset?.addEventListener('click', () => {
        activeFilters = new Set(['Уход за кожей', 'Косметика', 'Уход за телом', 'Волосы и ногти']);
        syncFilterState();
        renderProducts();
    });
};

const initSort = () => {
    if (!sortToggle || !sortPanel) return;
    sortToggle.addEventListener('click', () => {
        sortPanel.classList.toggle('open');
    });
    sortOptions.forEach((option) => {
        option.addEventListener('click', () => {
            activeSort = option.dataset.sort;
            sortPanel.classList.remove('open');
            renderProducts();
        });
    });
};

// Добавление мобильного сайдбара
const addMobileSidebar = () => {
    if (window.innerWidth <= 1024) {
        // Проверяем, не добавлен ли уже мобильный сайдбар
        if (!document.querySelector('.mobile-sidebar-container')) {
            const mobileSidebarHTML = `
                <div class="mobile-sidebar-container">
                    <div class="mobile-sidebar">
                        <div class="mobile-sidebar-item" data-target="./catalog.html" title="Главная">
                            <span class="mobile-sidebar-icon"><i class="fa-solid fa-bookmark"></i></span>
                            <span class="mobile-sidebar-text">Главная</span>
                        </div>
                        <div class="mobile-sidebar-item" data-target="./collections.html" title="Каталог">
                            <span class="mobile-sidebar-icon"><i class="fa-solid fa-list-ul"></i></span>
                            <span class="mobile-sidebar-text">Каталог</span>
                        </div>
                        <div class="mobile-sidebar-item" data-target="./settings.html" title="Настройки">
                            <span class="mobile-sidebar-icon"><i class="fa-solid fa-gear"></i></span>
                            <span class="mobile-sidebar-text">Настройки</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', mobileSidebarHTML);
            
            // Скрываем десктопный сайдбар на мобильных
            const desktopSidebar = document.querySelector('.catalog-sidebar');
            if (desktopSidebar) {
                desktopSidebar.style.display = 'none';
            }
        }
    } else {
        // На десктопе показываем обычный сайдбар
        const desktopSidebar = document.querySelector('.catalog-sidebar');
        if (desktopSidebar) {
            desktopSidebar.style.display = 'flex';
        }
        
        // Удаляем мобильный сайдбар если он есть
        const mobileSidebar = document.querySelector('.mobile-sidebar-container');
        if (mobileSidebar) {
            mobileSidebar.remove();
        }
    }
};

const bindMobileSidebarNav = () => {
    const items = document.querySelectorAll('.mobile-sidebar-item');
    if (!items.length) return;

    const currentPath = window.location.pathname.split('/').pop();
    items.forEach((item) => {
        const target = item.dataset.target || '';
        const targetPath = target.split('/').pop();
        if (currentPath === targetPath) {
            item.classList.add('active');
        }

        item.addEventListener('click', () => {
            if (!target) return;
            window.location.href = target;
        });
    });
};

document.addEventListener('click', closeDropdowns);

document.addEventListener('DOMContentLoaded', () => {
    initNavbarToggle();
    initSearch();
    initFilters();
    initSort();
    applyQueryFromURL();
    renderProducts();
    addMobileSidebar();
    bindMobileSidebarNav();
    initProductModal();

    if (grid) {
        grid.addEventListener('click', (event) => {
            // Обработка клика на кнопку "В корзину"
            const button = event.target.closest('.buy-btn');
            if (button) {
                event.stopPropagation();
                const productId = Number(button.dataset.productId);
                handleAddToCart(productId);
                return;
            }

            // Обработка клика на карточку товара
            const card = event.target.closest('.product-card');
            if (card) {
                const productId = Number(card.dataset.productId);
                openProductModal(productId);
            }
        });
    }
});

// Обработчик изменения размера окна
window.addEventListener('resize', () => {
    addMobileSidebar();
});