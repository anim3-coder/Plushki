import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';
const HowToBookPage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span>Как забронировать</span>
                </nav>
                <h1>Как забронировать отель</h1>
                <div className="page-content">
                    <div className="booking-steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h3>Поиск отеля</h3>
                                <p>Введите город, даты заезда и выезда, количество гостей в форме поиска на главной странице. Используйте фильтры для уточнения результатов.</p>
                                <div className="step-image">
                                    <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80" alt="Поиск отеля" />
                                </div>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h3>Выбор отеля</h3>
                                <p>Просмотрите список доступных отелей, сравните цены, удобства и отзывы. Добавьте понравившиеся отели в избранное.</p>
                                <div className="step-image">
                                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80" alt="Выбор отеля" />
                                </div>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h3>Выбор номера</h3>
                                <p>На странице отеля выберите подходящий тип номера, проверьте доступность на нужные даты и ознакомьтесь с условиями бронирования.</p>
                                <div className="step-image">
                                    <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80" alt="Выбор номера" />
                                </div>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">4</div>
                            <div className="step-content">
                                <h3>Оформление бронирования</h3>
                                <p>Заполните данные гостей, выберите способ оплаты и подтвердите бронирование. Проверьте правильность введенных данных.</p>
                                <div className="step-image">
                                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80" alt="Оформление бронирования" />
                                </div>
                            </div>
                        </div>
                        <div className="step">
                            <div className="step-number">5</div>
                            <div className="step-content">
                                <h3>Подтверждение</h3>
                                <p>После успешного бронирования вы получите подтверждение на email с деталями заказа и ваучером для заселения.</p>
                                <div className="step-image">
                                    <img src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=300&q=80" alt="Подтверждение" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="info-section">
                        <h2>Частые вопросы о бронировании</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>Нужно ли сразу оплачивать бронирование?</h3>
                                <p>Это зависит от условий отеля. Некоторые отели требуют предоплату, другие позволяют оплатить при заселении. Информация о условиях оплаты указана на странице отеля.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Можно ли изменить или отменить бронирование?</h3>
                                <p>Да, большинство бронирований можно изменить или отменить. Условия зависят от тарифа отеля. Бесплатная отмена обычно доступна за 24-48 часов до заезда.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Какие документы нужны для заселения?</h3>
                                <p>Обычно требуется паспорт и подтверждение бронирования (ваучер). Для иностранных гостей может потребоваться загранпаспорт и виза.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Что делать, если возникли проблемы с бронированием?</h3>
                                <p>Свяжитесь с нашей службой поддержки по телефону 8 (800) 123-45-67 или напишите на support@travelyandex.ru. Мы работаем 24/7.</p>
                            </div>
                        </div>
                    </div>
                    <div className="cookies-section">
                        <h2>Полезные советы</h2>
                        <ul className="tips-list">
                            <li>Бронируйте заранее, особенно в высокий сезон - это поможет получить лучшие цены</li>
                            <li>Внимательно читайте условия отмены бронирования</li>
                            <li>Проверяйте наличие дополнительных услуг (завтрак, трансфер и т.д.)</li>
                            <li>Сохраняйте подтверждение бронирования до окончания поездки</li>
                            <li>Читайте отзывы других гостей перед бронированием</li>
                        </ul>
                    </div>
                    <div className="cookies-section">
                        <h2>Нужна помощь?</h2>
                        <p>Наша служба поддержки всегда готова помочь с бронированием и ответить на ваши вопросы.</p>
                        <div className="support-contacts">
                            <a href="tel:+78001234567" className="support-link">
                                <i className="fas fa-phone" />
                                8 (800) 123-45-67
                            </a>
                            <a href="mailto:support@poduschko.ru" className="support-link">
                                <i className="fas fa-envelope" />
                                support@poduschko.ru
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default HowToBookPage;