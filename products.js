// Единый список продуктов, доступный на всех страницах
// Плейсхолдер, если у товара нет картинки. Можно заменить на свою.
window.PLACEHOLDER_IMAGE = 'https://placehold.co/320x200/e5e7eb/9ca3af?text=Beauty';

// Каталог под тематику "Красота и здоровье"
window.PRODUCTS = [
    {
        id: 1,
        title: 'Набор для ухода за лицом «Daily Glow»',
        desc: 'Очищающий гель, тоник и увлажняющий крем для нормальной и чувствительной кожи.',
        price: 2490,
        label: 'Уход за кожей',
        labelColor: 'default',
        brand: 'LumiSkin',
        image: '../assets/image/face1.jpg',
        rating: 4.8,
        reviews: 42
    },
    {
        id: 2,
        title: 'Сыворотка с витамином C 10%',
        desc: 'Осветляет тон, уменьшает пигментацию и следы пост-акне, придаёт коже здоровое сияние.',
        price: 1790,
        label: 'Уход за кожей',
        labelColor: 'default',
        brand: 'Pure Vitamin',
        image: '../assets/image/syvorotka.jpg',
        rating: 4.7,
        reviews: 35
    },
    {
        id: 3,
        title: 'Гель-крем для проблемной кожи',
        desc: 'Лёгкая текстура с ниацинамидом и цинком, помогает контролировать высыпания и жирный блеск.',
        price: 1390,
        label: 'Уход за кожей',
        labelColor: 'gray',
        brand: 'DermaCare',
        image: '../assets/image/face2.jpg',
        rating: 4.6,
        reviews: 28
    },
    {
        id: 4,
        title: 'Палетка теней «Nude Beauty»',
        desc: '12 нюдовых оттенков для повседневного и вечернего макияжа, легко растушёвываются.',
        price: 1590,
        label: 'Косметика',
        labelColor: 'blue',
        brand: 'ColorMe',
        image: '../assets/image/palet.jpg',
        rating: 4.9,
        reviews: 51
    },
    {
        id: 5,
        title: 'Губная помада «Natural Rose»',
        desc: 'Кремовая формула с ухаживающими маслами, натуральный розовый оттенок на каждый день.',
        price: 890,
        label: 'Косметика',
        labelColor: 'blue',
        brand: 'ColorMe',
        image: '../assets/image/pomad.jpg',
        rating: 4.6,
        reviews: 19
    },
    {
        id: 6,
        title: 'Масло для массажа «Релакс»',
        desc: 'Ароматическое масло для расслабляющего массажа тела, снимает напряжение и увлажняет кожу.',
        price: 890,
        label: 'Уход за телом',
        labelColor: 'default',
        brand: 'Blossom SPA',
        image: '../assets/image/malso.jpg',
        rating: 4.9,
        reviews: 33
    },
    {
        id: 7,
        title: 'Набор для ухода за волосами «Сияние»',
        desc: 'Шампунь, бальзам и термозащитный спрей для любой длины волос, придают блеск и мягкость.',
        price: 1650,
        label: 'Волосы и ногти',
        labelColor: 'gray',
        brand: 'Blossom Hair',
        image: '../assets/image/hair.jpg',
        rating: 4.7,
        reviews: 24
    },
    {
        id: 8,
        title: 'Набор лаков для ногтей «Натуральные оттенки»',
        desc: 'Гель-лаки в нюдовой палитре, стойкое покрытие до 2 недель, в наборе 6 оттенков.',
        price: 1290,
        label: 'Волосы и ногти',
        labelColor: 'gray',
        brand: 'Blossom Nails',
        image: '../assets/image/lak.jpg',
        rating: 4.8,
        reviews: 29
    }
];

