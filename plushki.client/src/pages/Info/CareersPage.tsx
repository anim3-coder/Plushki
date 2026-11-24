import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';
const FaqPage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <Link to="/about">О компании</Link>
                    <span>/</span>
                    <span>Вакансии</span>
                </nav>
                <h1>Карьера в ПодУшко</h1>
                <div className="page-content">
                    <div className="careers-hero">
                        <img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&h=400&q=80" alt="Карьера" />
                        <div className="hero-content">
                            <h2>Присоединяйтесь к нашей команде</h2>
                            <p>Мы создаем будущее туризма вместе</p>
                        </div>
                    </div>
                    <section className="info-section">
                        <h2>Почему выбирают нас</h2>
                        <div className="benefits-grid">
                            <div className="benefit">
                                <i className="fas fa-rocket" />
                                <h3>Быстрый рост</h3>
                                <p>Возможности для карьерного роста в быстрорастущей компании</p>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-graduation-cap" />
                                <h3>Обучение</h3>
                                <p>Программы обучения и профессионального развития</p>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-heart" />
                                <h3>Корпоративная культура</h3>
                                <p>Дружная команда и комфортная рабочая атмосфера</p>
                            </div>
                            <div className="benefit">
                                <i className="fas fa-briefcase" />
                                <h3>Гибкий график</h3>
                                <p>Возможность удаленной работы и гибкий график</p>
                            </div>
                        </div>
                    </section>
                    <section className="info-section">
                        <h2>Открытые вакансии</h2>
                        <div className="vacancies-list">
                            <div className="vacancy-item">
                                <div className="vacancy-header">
                                    <h3>Frontend Developer</h3>
                                    <span className="vacancy-type">Удаленная работа</span>
                                </div>
                                <div className="vacancy-details">
                                    <span className="vacancy-location"><i className="fas fa-map-marker-alt" /> Москва или удаленно</span>
                                    <span className="vacancy-experience"><i className="fas fa-briefcase" /> Опыт от 3 лет</span>
                                </div>
                                <p>Мы ищем опытного Frontend разработчика для работы над нашим основным продуктом - платформой поиска отелей.</p>
                                <div className="vacancy-skills">
                                    <span className="skill-tag">JavaScript</span>
                                    <span className="skill-tag">React</span>
                                    <span className="skill-tag">TypeScript</span>
                                    <span className="skill-tag">CSS3</span>
                                </div>
                                <a href="#apply" className="apply-btn">Откликнуться</a>
                            </div>
                            <div className="vacancy-item">
                                <div className="vacancy-header">
                                    <h3>Product Manager</h3>
                                    <span className="vacancy-type">Офис</span>
                                </div>
                                <div className="vacancy-details">
                                    <span className="vacancy-location"><i className="fas fa-map-marker-alt" /> Москва</span>
                                    <span className="vacancy-experience"><i className="fas fa-briefcase" /> Опыт от 5 лет</span>
                                </div>
                                <p>Ищем Product Manager для управления развитием нашего основного продукта и создания лучшего пользовательского опыта.</p>
                                <div className="vacancy-skills">
                                    <span className="skill-tag">Product Management</span>
                                    <span className="skill-tag">Analytics</span>
                                    <span className="skill-tag">UX/UI</span>
                                    <span className="skill-tag">Agile</span>
                                </div>
                                <a href="#apply" className="apply-btn">Откликнуться</a>
                            </div>
                            <div className="vacancy-item">
                                <div className="vacancy-header">
                                    <h3>Customer Support Specialist</h3>
                                    <span className="vacancy-type">Удаленная работа</span>
                                </div>
                                <div className="vacancy-details">
                                    <span className="vacancy-location"><i className="fas fa-map-marker-alt" /> Любой город</span>
                                    <span className="vacancy-experience"><i className="fas fa-briefcase" /> Опыт от 1 года</span>
                                </div>
                                <p>Нужен специалист поддержки клиентов для помощи нашим пользователям в решении вопросов с бронированиями.</p>
                                <div className="vacancy-skills">
                                    <span className="skill-tag">Коммуникация</span>
                                    <span className="skill-tag">Английский язык</span>
                                    <span className="skill-tag">Клиентский сервис</span>
                                </div>
                                <a href="#apply" className="apply-btn">Откликнуться</a>
                            </div>
                        </div>
                    </section>
                    <section className="info-section" id="apply">
                        <h2>Откликнуться на вакансию</h2>
                        <form className="application-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="application-name">ФИО</label>
                                    <input type="text" id="application-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="application-email">Email</label>
                                    <input type="email" id="application-email" required />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="application-phone">Телефон</label>
                                    <input type="tel" id="application-phone" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="application-position">На какую позицию</label>
                                    <select id="application-position" required>
                                        <option value:int>Выберите вакансию</option>
                                        <option value="frontend">Frontend Developer</option>
                                        <option value="product">Product Manager</option>
                                        <option value="support">Customer Support Specialist</option>
                                        <option value="other">Другая позиция</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="application-resume">Резюме</label>
                                <input type="file" id="application-resume" accept=".pdf,.doc,.docx" required />
                                <small>Поддерживаемые форматы: PDF, DOC, DOCX (макс. 5MB)</small>
                            </div>
                            <div className="form-group">
                                <label htmlFor="application-message">Сопроводительное письмо</label>
                                <textarea id="application-message" rows={4} placeholder="Расскажите о себе и почему вы хотите работать в нашей компании" defaultValue={""} />
                            </div>
                            <button type="submit" className="submit-btn">Отправить заявку</button>
                        </form>
                    </section>
                </div>
            </div>
        </main>
    );
}

export default FaqPage;