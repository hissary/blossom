(() => {
    const CART_STORAGE_KEY = 'aetheria_cart';
    const formatPrice = (price) => `${price} ₽`;
    const products = () => window.PRODUCTS || [];

    let cart = [];

    const elements = {
        overlay: null,
        drawer: null,
        items: null,
        total: null,
        openButtons: [],
        closeButton: null,
        clearButton: null,
        checkoutButton: null,
        emailInput: null,
        badges: []
    };

    const ensureElements = () => {
        elements.overlay = document.getElementById('cartOverlay');
        elements.drawer = document.getElementById('cartDrawer');
        elements.items = document.getElementById('cartItems');
        elements.total = document.getElementById('cartTotal');
        elements.closeButton = document.getElementById('cartClose');
        elements.clearButton = document.getElementById('cartClear');
        elements.checkoutButton = document.getElementById('cartCheckout');
        elements.emailInput = document.getElementById('cartEmail');
        elements.openButtons = Array.from(document.querySelectorAll('.cart-open-btn'));
        elements.badges = Array.from(document.querySelectorAll('[data-cart-count]'));
    };

    const loadCart = () => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Не удалось загрузить корзину', error);
            return [];
        }
    };

    const saveCart = () => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    };

    const findProduct = (id) => products().find((p) => p.id === id);

    const normalizeItem = (item) => {
        const fallback = findProduct(item.id);
        return {
            id: item.id,
            title: item.title || fallback?.title || 'Товар',
            desc: item.desc || fallback?.desc || '',
            price: item.price ?? fallback?.price ?? 0,
            quantity: item.quantity || 1
        };
    };

    const getCartCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

    const updateCartBadge = () => {
        const count = getCartCount();
        elements.badges.forEach((badge) => {
            badge.textContent = count;
            badge.classList.toggle('hidden', count === 0);
        });
    };

    const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

    const renderCart = () => {
        if (!elements.items || !elements.total) return;

        if (!cart.length) {
            elements.items.innerHTML = `
                <div class="cart-empty">
                    <i class="fa-regular fa-face-smile-beam"></i>
                    <p>Корзина пуста</p>
                    <span>Добавьте товары из каталога</span>
                </div>
            `;
            elements.total.textContent = formatPrice(0);
            updateCartBadge();
            return;
        }

        elements.items.innerHTML = cart
            .map(
                (item) => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <p class="cart-item-title">${item.title}</p>
                        <p class="cart-item-desc">${item.desc}</p>
                        <div class="cart-item-meta">
                            <span class="cart-item-price">${formatPrice(item.price)}</span>
                            <span class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</span>
                        </div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" data-action="decrease" data-id="${item.id}" aria-label="Уменьшить количество">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase" data-id="${item.id}" aria-label="Увеличить количество">+</button>
                        </div>
                        <button class="remove-btn" data-action="remove" data-id="${item.id}" aria-label="Удалить из корзины">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                </div>
            `
            )
            .join('');

        elements.total.textContent = formatPrice(calculateTotal());
        updateCartBadge();
    };

    const openCart = () => {
        elements.overlay?.classList.add('active');
        elements.drawer?.classList.add('active');
        document.body.classList.add('cart-locked');
    };

    const closeCart = () => {
        elements.overlay?.classList.remove('active');
        elements.drawer?.classList.remove('active');
        document.body.classList.remove('cart-locked');
    };

    const addToCart = (product) => {
        if (!product || product.id == null) return;
        const normalized = normalizeItem(product);
        const existing = cart.find((item) => item.id === normalized.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push(normalized);
        }
        saveCart();
        renderCart();
        openCart();
    };

    const changeQuantity = (productId, delta) => {
        cart = cart
            .map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
            .filter((item) => item.quantity > 0);
        saveCart();
        renderCart();
    };

    const removeFromCart = (productId) => {
        cart = cart.filter((item) => item.id !== productId);
        saveCart();
        renderCart();
    };

    const clearCart = () => {
        cart = [];
        saveCart();
        renderCart();
    };

    const bindEvents = () => {
        elements.openButtons.forEach((button) => button.addEventListener('click', openCart));
        elements.closeButton?.addEventListener('click', closeCart);
        elements.overlay?.addEventListener('click', closeCart);

        elements.items?.addEventListener('click', (event) => {
            const button = event.target.closest('[data-action]');
            if (!button) return;
            const productId = Number(button.dataset.id);
            if (button.dataset.action === 'increase') changeQuantity(productId, 1);
            if (button.dataset.action === 'decrease') changeQuantity(productId, -1);
            if (button.dataset.action === 'remove') removeFromCart(productId);
        });

        elements.clearButton?.addEventListener('click', clearCart);

        elements.checkoutButton?.addEventListener('click', () => {
            const email = elements.emailInput?.value?.trim() || '';
            const emailNote = email ? `Почта: ${email}` : 'Почта не указана';
            alert(`Здесь будет оформление заказа.\n${emailNote}\nКорзина сохраняется локально.`);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') closeCart();
        });
    };

    const initCart = () => {
        ensureElements();
        cart = loadCart().map(normalizeItem);
        renderCart();
        bindEvents();
    };

    document.addEventListener('DOMContentLoaded', initCart);

    window.cart = {
        add: addToCart,
        open: openCart,
        close: closeCart,
        render: renderCart
    };
})();

