import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';

interface FaqItem {
    id: string;
    question: string;
    answer: React.ReactNode;
}

interface FaqCategoryData {
    id: string;
    title: string;
    items: FaqItem[];
}

const faqData: FaqCategoryData[] = [
    {
        id: 'booking',
        title: 'Бронирование',
        items: [
            {
                id: 'booking-1',
                question: 'Как забронировать отель?',
                answer: (
                    <>
                        <p>Для бронирования отеля выполните следующие шаги:</p>
                        <ol>
                            <li>Введите город назначения, даты заезда и выезда, количество гостей</li>
                            <li>Нажмите "Найти отели"</li>
                            <li>Выберите подходящий отель из результатов поиска</li>
                            <li>Выберите тип номера и нажмите "Забронировать"</li>
                            <li>Заполните данные гостей и произведите оплату</li>
                        </ol>
                    </>
                ),
            },
            {
                id: 'booking-2',
                question: 'Нужно ли регистрироваться для бронирования?',
                answer: (
                    <>
                        <p>Да, для завершения бронирования требуется регистрация. Это необходимо для:</p>
                        <ul>
                            <li>Создания истории ваших бронирований</li>
                            <li>Быстрого оформления будущих заказов</li>
                            <li>Получения подтверждений и уведомлений</li>
                            <li>Доступа к управлению бронированиями</li>
                        </ul>
                    </>
                ),
            },
        ],
    },
    {
        id: 'payment',
        title: 'Оплата',
        items: [
            {
                id: 'payment-1',
                question: 'Какие способы оплаты доступны?',
                answer: (
                    <>
                        <p>Мы принимаем следующие способы оплаты:</p>
                        <ul>
                            <li>Банковские карты (Visa, MasterCard, Mir)</li>
                            <li>Электронные кошельки (ЮMoney, QIWI)</li>
                            <li>Система быстрых платежей (СБП)</li>
                            <li>Наличные при заселении (для некоторых отелей)</li>
                        </ul>
                    </>
                ),
            },
            {
                id: 'payment-2',
                question: 'Безопасна ли оплата через сайт?',
                answer: (
                    <>
                        <p>Да, все платежи защищены современными технологиями шифрования. Мы используем:</p>
                        <ul>
                            <li>SSL-шифрование всех данных</li>
                            <li>Сертификат безопасности PCI DSS</li>
                            <li>Двухфакторную аутентификацию</li>
                            <li>Мониторинг fraudulent-активности</li>
                        </ul>
                        <p>Ваши платежные данные никогда не сохраняются на наших серверах.</p>
                    </>
                ),
            },
        ],
    },
    {
        id: 'cancellation',
        title: 'Отмена и изменения',
        items: [
            {
                id: 'cancellation-1',
                question: 'Как отменить бронирование?',
                answer: (
                    <>
                        <p>Для отмены бронирования:</p>
                        <ol>
                            <li>Войдите в свой аккаунт</li>
                            <li>Перейдите в раздел "Мои бронирования"</li>
                            <li>Выберите нужное бронирование</li>
                            <li>Нажмите "Отменить бронирование"</li>
                            <li>Подтвердите отмену</li>
                        </ol>
                        <p>Условия возврата средств зависят от политики отеля и тарифа.</p>
                    </>
                ),
            },
            {
                id: 'cancellation-2',
                question: 'Можно ли изменить даты бронирования?',
                answer: (
                    <>
                        <p>Да, в большинстве случаев даты можно изменить:</p>
                        <ul>
                            <li>Для изменений войдите в аккаунт</li>
                            <li>Выберите бронирование в разделе "Мои бронирования"</li>
                            <li>Нажмите "Изменить бронирование"</li>
                            <li>Выберите новые даты и подтвердите изменения</li>
                        </ul>
                        <p>Обратите внимание: изменение дат может повлиять на стоимость бронирования.</p>
                    </>
                ),
            },
        ],
    },
    {
        id: 'account',
        title: 'Аккаунт и профиль',
        items: [
            {
                id: 'account-1',
                question: 'Как восстановить доступ к аккаунту?',
                answer: (
                    <>
                        <p>Если вы забыли пароль:</p>
                        <ol>
                            <li>На странице входа нажмите "Забыли пароль?"</li>
                            <li>Введите email, указанный при регистрации</li>
                            <li>Проверьте почту и перейдите по ссылке из письма</li>
                            <li>Создайте новый пароль</li>
                        </ol>
                        <p>Если у вас нет доступа к email, свяжитесь с поддержкой.</p>
                    </>
                ),
            },
            {
                id: 'account-2',
                question: 'Как изменить данные профиля?',
                answer: (
                    <>
                        <p>Для изменения данных профиля:</p>
                        <ol>
                            <li>Войдите в аккаунт</li>
                            <li>Перейдите в раздел "Профиль"</li>
                            <li>Нажмите "Редактировать"</li>
                            <li>Внесите необходимые изменения</li>
                            <li>Сохраните изменения</li>
                        </ol>
                        <p>Обновление некоторых данных может потребовать подтверждения.</p>
                    </>
                ),
            },
        ],
    },
];

const FaqPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    const filteredData = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        return faqData
            .map((category) => ({
                ...category,
                items: category.items.filter((item) =>
                    !term || item.question.toLowerCase().includes(term)
                ),
            }))
            .filter((category) => {
                if (activeCategory !== 'all' && category.id !== activeCategory) return false;
                return category.items.length > 0;
            });
    }, [searchTerm, activeCategory]);

    const toggleItem = (itemId: string) => {
        setExpandedItems((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const categories = [
        { id: 'all', label: 'Все вопросы' },
        { id: 'booking', label: 'Бронирование' },
        { id: 'payment', label: 'Оплата' },
        { id: 'cancellation', label: 'Отмена' },
        { id: 'account', label: 'Аккаунт' },
    ];

    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span>Частые вопросы</span>
                </nav>
                <h1>Частые вопросы (FAQ)</h1>
                <div className="page-content">
                    <div className="faq-search">
                        <input
                            type="text"
                            placeholder="Поиск по вопросам..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search" />
                    </div>
                    <div className="faq-categories">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                    <div className="faq-list">
                        {filteredData.length === 0 ? (
                            <div className="faq-no-results">
                                <p>По вашему запросу ничего не найдено.</p>
                            </div>
                        ) : (
                            filteredData.map((category) => (
                                <div key={category.id} className="faq-category">
                                    <h2>{category.title}</h2>
                                    {category.items.map((item) => {
                                        const isExpanded = expandedItems.has(item.id);
                                        return (
                                            <div key={item.id} className="faq-item">
                                                <div
                                                    className="faq-question"
                                                    onClick={() => toggleItem(item.id)}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            toggleItem(item.id);
                                                        }
                                                    }}
                                                >
                                                    <h3>{item.question}</h3>
                                                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`} />
                                                </div>
                                                <div className={isExpanded ? 'faq-answer-active' : 'faq-answer'}>
                                                    {item.answer}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                    <div className="support-section">
                        <h2>Не нашли ответ на свой вопрос?</h2>
                        <p>Наша служба поддержки всегда готова помочь вам.</p>
                        <div className="support-options">
                            <Link to="/fag" className="support-option">
                                <i className="fas fa-envelope" />
                                <span>Написать в поддержку</span>
                            </Link>
                            <a href="tel:+78001234567" className="support-option">
                                <i className="fas fa-phone" />
                                <span>8 (800) 123-45-67</span>
                            </a>
                            <Link to="/how-to-book" className="support-option">
                                <i className="fas fa-book" />
                                <span>Инструкция по бронированию</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default FaqPage;