import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';

const AffiliatePage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <Link to="/about">О компании</Link>
                    <span>/</span>
                    <span>Партнерская программа</span>
                </nav>
                <h1>Партнерская программа</h1>
                <div className="page-content">
                    <div className="affiliate-hero">
                        <div className="hero-content">
                            <div className="hero-verical">
                                <h2>Зарабатывайте с ПодУшко</h2>
                                <p>Присоединяйтесь к нашей партнерской программе и получайте комиссию за каждое бронирование</p>
                            </div>
                            <a href="#signup" className="cta-button">Стать партнером</a>
                        </div>
                        <div className="hero-image">
                            <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=400&q=80" alt="Партнерская программа" />
                        </div>
                    </div>
                    <section className="benefits-section">
                        <h2>Преимущества для партнеров</h2>
                        <div className="benefits-grid">
                            <div className="benefit">
                                <i className="fas fa-percent" />
                                <h3>Высокие комиссии</h3>
                                <p>До 8% от суммы каждого бронирования</p>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-clock" />
                                <h3>Ежемесячные выплаты</h3>
                                <p>Стабильные выплаты без задержек</p>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-chart-line" />
                                <h3>Подробная статистика</h3>
                                <p>Полный доступ к аналитике и отчетам</p>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-headset" />
                                <h3>Персональная поддержка</h3>
                                <p>Дедicated менеджер для каждого партнера</p>
                            </div>
                        </div>
                    </section>
                    <section className="how-it-works">
                        <h2>Как это работает</h2>
                        <div className="steps">
                            <div className="step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h3>Регистрация</h3>
                                    <p>Заполните заявку и получите доступ к партнерскому кабинету</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h3>Размещение ссылок</h3>
                                    <p>Используйте готовые баннеры и ссылки на вашем сайте</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h3>Привлечение клиентов</h3>
                                    <p>Ваши пользователи бронируют отели через ваши ссылки</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">4</div>
                                <div className="step-content">
                                    <h3>Получение дохода</h3>
                                    <p>Получайте комиссию за каждое успешное бронирование</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="commission-section">
                        <h2>Условия комиссионных</h2>
                        <div className="commission-table">
                            <div className="table-header">
                                <div>Тип партнера</div>
                                <div>Комиссия</div>
                                <div>Минимальная выплата</div>
                            </div>
                            <div className="table-row">
                                <div>Стандартный</div>
                                <div>5%</div>
                                <div>5 000 ₽</div>
                            </div>
                            <div className="table-row">
                                <div>Серебряный</div>
                                <div>6%</div>
                                <div>3 000 ₽</div>
                            </div>
                            <div className="table-row">
                                <div>Золотой</div>
                                <div>7%</div>
                                <div>1 000 ₽</div>
                            </div>
                            <div className="table-row">
                                <div>Платиновый</div>
                                <div>8%</div>
                                <div>500 ₽</div>
                            </div>
                        </div>
                        <p className="commission-note">* Уровень партнера зависит от количества привлеченных бронирований</p>
                    </section>
                    <section className="tools-section">
                        <h2>Инструменты для партнеров</h2>
                        <div className="tools-grid">
                            <div className="tool">
                                <i className="fas fa-link" />
                                <h3>Партнерские ссылки</h3>
                                <p>Уникальные tracking ссылки для вашего трафика</p>
                            </div>
                            <div className="tool">
                                <i className="fas fa-image" />
                                <h3>Баннеры</h3>
                                <p>Готовые рекламные материалы разных размеров</p>
                            </div>
                            <div className="tool">
                                <i className="fas fa-chart-bar" />
                                <h3>Аналитика</h3>
                                <p>Подробные отчеты по кликам и конверсиям</p>
                            </div>
                            <div className="tool">
                                <i className="fas fa-code" />
                                <h3>API доступ</h3>
                                <p>Интеграция с вашей системой через API</p>
                            </div>
                        </div>
                    </section>
                    <section className="faq-section">
                        <h2>Частые вопросы</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>Кто может стать партнером?</h3>
                                <p>Владельцы сайтов, блогеры, турагентства, компании - любой, у кого есть аудитория, интересующаяся путешествиями.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Как отслеживаются переходы?</h3>
                                <p>Мы используем cookies для tracking. Cookie действителен 30 дней с момента последнего клика.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Когда происходят выплаты?</h3>
                                <p>Выплаты производятся ежемесячно, после завершения бронирования и пребывания гостя в отеле.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Есть ли скрытые комиссии?</h3>
                                <p>Нет, никаких скрытых комиссий или платежей. Вы получаете чистый процент от бронирования.</p>
                            </div>
                        </div>
                    </section>
                    <section id="signup" className="signup-section">
                        <h2>Стать партнером</h2>
                        <form className="affiliate-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="company-name">Название компании/сайта</label>
                                    <input type="text" id="company-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="website-url">URL сайта</label>
                                    <input type="url" id="website-url" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-name">Контактное лицо</label>
                                    <input type="text" id="contact-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-email">Email</label>
                                    <input type="email" id="contact-email" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-phone">Телефон</label>
                                    <input type="tel" id="contact-phone" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="monthly-traffic">Ежемесячный трафик</label>
                                    <select id="monthly-traffic" required>
                                        <option value={0}>Выберите из списка</option>
                                        <option value={1000}>До 1,000 посетителей</option>
                                        <option value={5000}>1,000-5,000 посетителей</option>
                                        <option value={10000}>5,000-10,000 посетителей</option>
                                        <option value={20000}>10,000-20,000 посетителей</option>
                                        <option value={50000}>Более 20,000 посетителей</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="additional-info">Дополнительная информация</label>
                                <textarea id="additional-info" rows={4} placeholder="Расскажите о вашем проекте и аудитории..." defaultValue={""} />
                            </div>
                            <div className="form-submit">
                                <button type="submit" className="cta-button">Отправить заявку</button>
                                <p className="form-note">Нажимая кнопку, вы соглашаетесь с <a href="#">условиями партнерской программы</a></p>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default AffiliatePage;