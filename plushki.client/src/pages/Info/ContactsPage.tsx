import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';

const ContactsPage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span>Контакты</span>
                </nav>
                <h1>Контакты</h1>
                <div className="page-content">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2>Свяжитесь с нами</h2>
                            <div className="contact-item">
                                <i className="fas fa-phone" />
                                <div>
                                    <h3>Телефон</h3>
                                    <p><a href="tel:+78001234567">8 (800) 123-45-67</a></p>
                                    <p className="contact-note">Бесплатный звонок по России</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-envelope" />
                                <div>
                                    <h3>Email</h3>
                                    <p><a href="mailto:info@poduschko.ru">info@poduschko.ru</a></p>
                                    <p className="contact-note">Для общих вопросов</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-headset" />
                                <div>
                                    <h3>Поддержка клиентов</h3>
                                    <p><a href="mailto:support@poduschko.ru">support@poduschko.ru</a></p>
                                    <p className="contact-note">Помощь с бронированиями</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-clock" />
                                <div>
                                    <h3>Время работы</h3>
                                    <p>Круглосуточно, 7 дней в неделю</p>
                                </div>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt" />
                                <div>
                                    <h3>Адрес</h3>
                                    <p>Москва, ул. Тверская, д. 10</p>
                                    <p className="contact-note">БЦ "Тверской", 5 этаж</p>
                                </div>
                            </div>
                        </div>
                        <div className="contact-form-section">
                            <h2>Напишите нам</h2>
                            <form className="contact-form">
                                <div className="form-group">
                                    <label htmlFor="contact-name">Ваше имя</label>
                                    <input type="text" id="contact-name" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-email">Email</label>
                                    <input type="email" id="contact-email" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-phone">Телефон</label>
                                    <input type="tel" id="contact-phone" />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-subject">Тема</label>
                                    <select id="contact-subject" required>
                                        <option value>Выберите тему</option>
                                        <option value="booking">Вопрос по бронированию</option>
                                        <option value="payment">Оплата</option>
                                        <option value="technical">Техническая поддержка</option>
                                        <option value="partnership">Партнерство</option>
                                        <option value="other">Другое</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-message">Сообщение</label>
                                    <textarea id="contact-message" rows={5} required defaultValue={""} />
                                </div>
                                <button type="submit" className="submit-btn">Отправить сообщение</button>
                            </form>
                        </div>
                    </div>
                    <div className="map-section">
                        <h2>Мы на карте</h2>
                        <div className="map-placeholder">
                            <div className="map-content">
                                <i className="fas fa-map-marked-alt" />
                                <p>Карта загружается...</p>
                                <small>Москва, ул. Тверская, д. 10</small>
                            </div>
                        </div>
                    </div>
                    <div className="faq-preview">
                        <h2>Частые вопросы</h2>
                        <p>Возможно, ответ на ваш вопрос уже есть в нашем <Link to='/faq'><a>разделе часто задаваемых вопросов</a></Link>.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ContactsPage;