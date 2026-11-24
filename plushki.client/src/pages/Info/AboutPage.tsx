import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span>О компании</span>
                </nav>
                <h1>О компании ПодУшко</h1>
                <div className="page-content">
                    <div className="about-hero">
                        <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80" alt="О компании" />
                        <div className="hero-content">
                            <h2>Мы помогаем путешественникам находить идеальные места для отдыха</h2>
                        </div>
                    </div>
                    <section className="cookies-section">
                        <h2>Наша миссия</h2>
                        <p>ПодУшко - это современная платформа для поиска и бронирования отелей по всему миру. Наша миссия - сделать процесс планирования путешествий максимально простым, удобным и выгодным для каждого пользователя.</p>
                    </section>
                    <section className="info-section">
                        <h2>Что мы предлагаем</h2>
                        <div className="features-grid">
                            <div className="feature">
                                <i className="fas fa-search" />
                                <h3>Умный поиск</h3>
                                <p>Расширенная система фильтров и рекомендаций для поиска идеального отеля</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-percent" />
                                <h3>Лучшие цены</h3>
                                <p>Сравнение цен от сотен поставщиков и гарантия лучшей стоимости</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-shield-alt" />
                                <h3>Безопасность</h3>
                                <p>Защищенные платежи и гарантия бронирования</p>
                            </div>
                            <div className="feature">
                                <i className="fas fa-headset" />
                                <h3>Поддержка 24/7</h3>
                                <p>Круглосуточная поддержка клиентов на всех этапах путешествия</p>
                            </div>
                        </div>
                    </section>
                    <section className="cookies-section">
                        <h2>Наши цифры</h2>
                        <div className="stats-grid">
                            <div className="stat">
                                <div className="stat-number">500K+</div>
                                <div className="stat-label">отелей по всему миру</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">10M+</div>
                                <div className="stat-label">отзывов от гостей</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">150+</div>
                                <div className="stat-label">стран доступно</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">24/7</div>
                                <div className="stat-label">поддержка клиентов</div>
                            </div>
                        </div>
                    </section>
                    <section className="cookies-section">
                        <h2>Наша команда</h2>
                        <p>Мы - команда энтузиастов путешествий, которые понимают, что значит искать идеальное место для отдыха. Наш опыт и технологии помогают миллионам путешественников находить именно то, что они ищут.</p>
                    </section>
                    <section className="cookies-section">
                        <h2>Свяжитесь с нами</h2>
                        <p>Если у вас есть вопросы или предложения, мы всегда рады помочь:</p>
                        <div className="contact-info">
                            <p><strong>Email:</strong> <a href="mailto:info@poduschko.ru">info@poduschko.ru</a></p>
                            <p><strong>Телефон:</strong> <a href="tel:+78001234567">8 (800) 123-45-67</a></p>
                            <p><strong>Адрес:</strong> Москва, ул. Тверская, д. 10</p>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default AboutPage;