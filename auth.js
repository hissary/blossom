(() => {
    const USERS_KEY = 'aetheria_users';
    const CURRENT_USER_KEY = 'aetheria_current_user';

    const state = {
        users: [],
        currentUser: null,
        overlay: null,
        tabs: [],
        forms: {
            login: null,
            register: null
        },
        message: null,
        accountCard: null,
        accountName: null,
        accountEmail: null,
        accountAvatar: null,
        accountActions: null,
        openButtons: [],
        logoutButtons: [],
        nameTargets: [],
        emailTargets: [],
        avatarTargets: []
    };

    const safeParse = (value, fallback) => {
        try {
            return JSON.parse(value) ?? fallback;
        } catch (e) {
            console.warn('Не удалось разобрать данные авторизации', e);
            return fallback;
        }
    };

    const loadUsers = () => {
        const saved = localStorage.getItem(USERS_KEY);
        return safeParse(saved, []);
    };

    const saveUsers = (list) => {
        localStorage.setItem(USERS_KEY, JSON.stringify(list));
    };

    const loadCurrentUser = () => {
        const saved = localStorage.getItem(CURRENT_USER_KEY);
        return safeParse(saved, null);
    };

    const persistCurrentUser = (user) => {
        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(CURRENT_USER_KEY);
        }
    };

    const setMessage = (type, text) => {
        if (!state.message) return;
        state.message.textContent = text;
        state.message.classList.remove('error', 'success');
        if (type) {
            state.message.classList.add(type);
            state.message.style.display = 'block';
        } else {
            state.message.style.display = 'none';
        }
    };

    const initialFromName = (name = '') => {
        const trimmed = name.trim();
        return trimmed ? trimmed[0].toUpperCase() : 'A';
    };

    const ensureModal = () => {
        if (document.querySelector('[data-auth-overlay]')) return;

        const markup = `
            <div class="auth-overlay" data-auth-overlay>
                <div class="auth-modal">
                    <button class="auth-close" type="button" data-auth-close aria-label="Закрыть окно"><i class="fa-solid fa-xmark"></i></button>

                    <div class="auth-tabs">
                        <button class="auth-tab active" type="button" data-auth-tab="login">Вход</button>
                        <button class="auth-tab" type="button" data-auth-tab="register">Регистрация</button>
                    </div>

                    <div class="auth-title">Добро пожаловать</div>
                    <p class="auth-subtitle">Войдите или создайте аккаунт, чтобы продолжить покупки</p>

                    <div class="auth-account-card hidden" data-auth-account>
                        <div class="auth-user-avatar" data-auth-account-avatar>A</div>
                        <div class="auth-user-meta">
                            <span class="auth-user-name" data-auth-account-name>Пользователь</span>
                            <span class="auth-user-email auth-small" data-auth-account-email>email@example.com</span>
                        </div>
                    </div>

                    <div class="auth-account-actions hidden" data-auth-account-actions>
                        <button class="auth-secondary-btn" type="button" data-auth-switch="login">Войти другим аккаунтом</button>
                        <button class="auth-logout-btn" type="button" data-auth-logout>Выйти</button>
                    </div>

                    <form class="auth-form" data-auth-form="login">
                        <div class="auth-field">
                            <label for="authLoginEmail">Почта</label>
                            <input id="authLoginEmail" name="email" type="email" placeholder="you@example.com" required>
                        </div>
                        <div class="auth-field">
                            <label for="authLoginPassword">Пароль</label>
                            <input id="authLoginPassword" name="password" type="password" placeholder="Минимум 6 символов" minlength="6" required>
                        </div>
                        <button class="auth-submit" type="submit">Войти</button>
                        <p class="auth-helper">Нет аккаунта? <button type="button" data-auth-switch="register">Создать</button></p>
                    </form>

                    <form class="auth-form hidden" data-auth-form="register">
                        <div class="auth-field">
                            <label for="authRegisterName">Имя / ник</label>
                            <input id="authRegisterName" name="name" type="text" placeholder="Например, Алексей" minlength="2" required>
                        </div>
                        <div class="auth-field">
                            <label for="authRegisterEmail">Почта</label>
                            <input id="authRegisterEmail" name="email" type="email" placeholder="you@example.com" required>
                        </div>
                        <div class="auth-field">
                            <label for="authRegisterPassword">Пароль</label>
                            <input id="authRegisterPassword" name="password" type="password" placeholder="Минимум 6 символов" minlength="6" required>
                        </div>
                        <button class="auth-submit" type="submit">Зарегистрироваться</button>
                        <p class="auth-helper">Уже есть аккаунт? <button type="button" data-auth-switch="login">Войти</button></p>
                    </form>

                    <div class="auth-message" data-auth-message></div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', markup);
    };

    const cacheModalElements = () => {
        state.overlay = document.querySelector('[data-auth-overlay]');
        state.tabs = Array.from(document.querySelectorAll('[data-auth-tab]'));
        state.forms.login = document.querySelector('[data-auth-form="login"]');
        state.forms.register = document.querySelector('[data-auth-form="register"]');
        state.message = document.querySelector('[data-auth-message]');
        state.accountCard = document.querySelector('[data-auth-account]');
        state.accountName = document.querySelector('[data-auth-account-name]');
        state.accountEmail = document.querySelector('[data-auth-account-email]');
        state.accountAvatar = document.querySelector('[data-auth-account-avatar]');
        state.accountActions = document.querySelector('[data-auth-account-actions]');
    };

    const cacheAuthTargets = () => {
        state.openButtons = Array.from(document.querySelectorAll('[data-auth-open]'));
        state.logoutButtons = Array.from(document.querySelectorAll('[data-auth-logout]'));
        state.nameTargets = Array.from(document.querySelectorAll('[data-auth-name]'));
        state.emailTargets = Array.from(document.querySelectorAll('[data-auth-email]'));
        state.avatarTargets = Array.from(document.querySelectorAll('[data-auth-avatar]'));
    };

    const toggleTab = (mode) => {
        state.tabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === mode));
        const forms = ['login', 'register'];
        forms.forEach((key) => {
            const form = state.forms[key];
            if (form) {
                form.classList.toggle('hidden', key !== mode);
            }
        });

        if (mode === 'login') {
            state.forms.login?.reset();
        } else if (mode === 'register') {
            state.forms.register?.reset();
        }
    };

    const openModal = (mode = 'login') => {
        ensureModal();
        cacheModalElements();
        state.overlay?.classList.add('active');
        document.body.classList.add('auth-locked');
        toggleTab(mode);
        renderAccountState();
        setMessage(null, '');
    };

    const closeModal = () => {
        state.overlay?.classList.remove('active');
        document.body.classList.remove('auth-locked');
        setMessage(null, '');
    };

    const updateUserChips = () => {
        const isAuth = Boolean(state.currentUser);
        state.nameTargets.forEach((el) => {
            el.textContent = state.currentUser?.name || 'Гость';
        });
        state.emailTargets.forEach((el) => {
            el.textContent = state.currentUser?.email || '';
            el.classList.toggle('hidden', !state.currentUser?.email);
        });
        state.avatarTargets.forEach((el) => {
            el.textContent = initialFromName(state.currentUser?.name);
        });

        const chips = Array.from(document.querySelectorAll('[data-auth-chip]'));
        chips.forEach((chip) => chip.classList.toggle('hidden', !isAuth));
    };

    const refreshButtons = () => {
        const isAuth = Boolean(state.currentUser);
        state.openButtons.forEach((btn) => {
            const label = btn.querySelector('[data-auth-label]');
            if (label) label.textContent = isAuth ? 'Аккаунт' : 'Войти';
        });
        state.logoutButtons.forEach((btn) => {
            btn.classList.toggle('hidden', !isAuth);
        });
    };

    const renderAccountState = () => {
        const isAuth = Boolean(state.currentUser);

        state.tabs.forEach((tab) => tab.classList.toggle('hidden', isAuth));
        if (state.forms.login) state.forms.login.classList.toggle('hidden', isAuth);
        if (state.forms.register) state.forms.register.classList.toggle('hidden', isAuth);

        if (state.accountCard) {
            state.accountCard.classList.toggle('hidden', !isAuth);
        }
        if (state.accountActions) {
            state.accountActions.classList.toggle('hidden', !isAuth);
        }

        if (isAuth && state.currentUser) {
            if (state.accountName) state.accountName.textContent = state.currentUser.name || 'Пользователь';
            if (state.accountEmail) state.accountEmail.textContent = state.currentUser.email || '';
            if (state.accountAvatar) state.accountAvatar.textContent = initialFromName(state.currentUser.name);
        } else {
            toggleTab('login');
        }
    };

    const saveSession = (user) => {
        state.currentUser = user;
        persistCurrentUser(user);
        cacheAuthTargets();
        refreshButtons();
        updateUserChips();
        renderAccountState();
    };

    const showError = (text) => setMessage('error', text);
    const showSuccess = (text) => setMessage('success', text);

    const handleLogin = (email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        if (!normalizedEmail || !password) {
            showError('Введите почту и пароль');
            return;
        }

        const user = state.users.find(
            (u) => u.email === normalizedEmail && u.password === password
        );

        if (!user) {
            showError('Неверная почта или пароль');
            return;
        }

        saveSession({ name: user.name, email: user.email });
        showSuccess('Вы успешно вошли');
        setTimeout(closeModal, 700);
    };

    const handleRegister = (name, email, password) => {
        const normalizedEmail = email.trim().toLowerCase();
        const trimmedName = name.trim();
        if (!trimmedName || !normalizedEmail || !password) {
            showError('Заполните все поля');
            return;
        }
        if (password.length < 6) {
            showError('Пароль должен быть не короче 6 символов');
            return;
        }

        const exists = state.users.some((u) => u.email === normalizedEmail);
        if (exists) {
            showError('Пользователь с такой почтой уже существует');
            return;
        }

        const newUser = { name: trimmedName, email: normalizedEmail, password };
        state.users.push(newUser);
        saveUsers(state.users);
        saveSession({ name: newUser.name, email: newUser.email });
        showSuccess('Регистрация прошла успешно');
        setTimeout(closeModal, 700);
    };

    const logout = () => {
        const wasLogged = Boolean(state.currentUser);
        saveSession(null);
        setMessage(wasLogged ? 'success' : null, wasLogged ? 'Вы вышли из аккаунта' : '');
    };

    const bindModalEvents = () => {
        if (!state.overlay) return;
        state.overlay.addEventListener('click', (event) => {
            if (event.target === state.overlay) {
                closeModal();
            }
        });

        const closeBtn = document.querySelector('[data-auth-close]');
        closeBtn?.addEventListener('click', closeModal);

        state.tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                const mode = tab.dataset.authTab;
                toggleTab(mode);
                setMessage(null, '');
            });
        });

        state.forms.login?.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            handleLogin(formData.get('email') || '', formData.get('password') || '');
        });

        state.forms.register?.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            handleRegister(
                formData.get('name') || '',
                formData.get('email') || '',
                formData.get('password') || ''
            );
        });

        document.querySelectorAll('[data-auth-switch]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.authSwitch;
                logout();
                state.accountCard?.classList.add('hidden');
                state.accountActions?.classList.add('hidden');
                state.tabs.forEach((tab) => tab.classList.remove('hidden'));
                toggleTab(mode);
                setMessage(null, '');
            });
        });
    };

    const bindGlobalButtons = () => {
        cacheAuthTargets();

        state.openButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                if (state.currentUser) {
                    openModal('login');
                    renderAccountState();
                } else {
                    openModal('login');
                }
            });
        });

        state.logoutButtons.forEach((btn) => {
            btn.addEventListener('click', () => {
                logout();
            });
        });
    };

    const init = () => {
        state.users = loadUsers();
        state.currentUser = loadCurrentUser();

        ensureModal();
        cacheModalElements();
        bindModalEvents();
        bindGlobalButtons();
        refreshButtons();
        updateUserChips();
        renderAccountState();
    };

    document.addEventListener('DOMContentLoaded', init);
})();
