import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span>Политика конфиденциальности</span>
                </nav>
                <h1>Политика конфиденциальности</h1>
                <p className="last-updated">Последнее обновление: 1 ноября 2023 года</p>
                <div className="page-content">
                    <div className="toc">
                        <h2>Содержание</h2>
                        <ul>
                            <li><a href="#introduction">1. Введение</a></li>
                            <li><a href="#data-collection">2. Какие данные мы собираем</a></li>
                            <li><a href="#data-usage">3. Как мы используем данные</a></li>
                            <li><a href="#data-sharing">4. Передача данных третьим лицам</a></li>
                            <li><a href="#data-protection">5. Защита данных</a></li>
                            <li><a href="#cookies">6. Использование cookies</a></li>
                            <li><a href="#rights">7. Ваши права</a></li>
                            <li><a href="#children">8. Дети</a></li>
                            <li><a href="#changes">9. Изменения политики</a></li>
                            <li><a href="#contact">10. Контакты</a></li>
                        </ul>
                    </div>
                    <section id="introduction" className="terms-section">
                        <h2>Введение</h2>
                        <p>TravelYandex ценит вашу конфиденциальность и стремится защищать ваши персональные данные. Настоящая Политика конфиденциальности объясняет, как мы собираем, используем и защищаем информацию о вас.</p>
                    </section>
                    <section id="data-collection" className="terms-section">
                        <h2>Какие данные мы собираем</h2>
                        <h3>2.1. Данные, которые вы предоставляете:</h3>
                        <ul>
                            <li>Контактная информация (имя, email, телефон)</li>
                            <li>Данные для бронирования (даты, количество гостей)</li>
                            <li>Платежная информация</li>
                            <li>Данные документов (при необходимости)</li>
                        </ul>
                        <h3>2.2. Данные, собираемые автоматически:</h3>
                        <ul>
                            <li>IP-адрес и данные устройства</li>
                            <li>Информация о браузере</li>
                            <li>Данные об использовании сайта</li>
                            <li>Cookies и similar технологии</li>
                        </ul>
                    </section>
                    <section id="data-usage" className="terms-section">
                        <h2>Как мы используем данные</h2>
                        <p>Мы используем ваши данные для:</p>
                        <ul>
                            <li>Обработки бронирований и платежей</li>
                            <li>Предоставления customer service</li>
                            <li>Отправки подтверждений и уведомлений</li>
                            <li>Улучшения наших услуг</li>
                            <li>Персонализации пользовательского опыта</li>
                            <li>Отправки маркетинговых сообщений (с согласия)</li>
                        </ul>
                    </section>
                    <section id="data-sharing" className="terms-section">
                        <h2>Передача данных третьим лицам</h2>
                        <p>Мы можем передавать ваши данные:</p>
                        <ul>
                            <li>Отелям и поставщикам услуг для выполнения бронирований</li>
                            <li>Платежным системам для обработки платежей</li>
                            <li>Сервисным провайдерам (хостинг, аналитика)</li>
                            <li>По требованию закона или правоохранительных органов</li>
                        </ul>
                        <p>Мы требуем от третьих лиц соблюдения конфиденциальности и безопасности данных.</p>
                    </section>
                    <section id="data-protection" className="terms-section">
                        <h2>Защита данных</h2>
                        <p>Мы принимаем соответствующие технические и организационные меры для защиты ваших данных:</p>
                        <ul>
                            <li>SSL шифрование всех передаваемых данных</li>
                            <li>Регулярное обновление систем безопасности</li>
                            <li>Ограниченный доступ к персональным данным</li>
                            <li>Регулярные security аудиты</li>
                        </ul>
                    </section>
                    <section id="cookies" className="terms-section">
                        <h2>Использование cookies</h2>
                        <p>Мы используем cookies для:</p>
                        <ul>
                            <li>Работы essential функций сайта</li>
                            <li>Анализа использования сайта</li>
                            <li>Персонализации контента</li>
                            <li>Таргетированной рекламы</li>
                        </ul>
                        <p>Вы можете управлять cookies через настройки браузера. Подробнее в нашей <a href="cookies.html">Политике использования cookies</a>.</p>
                    </section>
                    <section id="rights" className="terms-section">
                        <h2>Ваши права</h2>
                        <p>Вы имеете право:</p>
                        <ul>
                            <li>Доступа к вашим персональным данным</li>
                            <li>Исправления неточных данных</li>
                            <li>Удаления ваших данных</li>
                            <li>Ограничения обработки данных</li>
                            <li>Переноса данных</li>
                            <li>Отказа от маркетинговых коммуникаций</li>
                        </ul>
                        <p>Для реализации ваших прав обращайтесь на <a href="mailto:privacy@poduschko.ru">privacy@poduschko.ru</a>.</p>
                    </section>
                    <section id="children" className="terms-section">
                        <h2>Дети</h2>
                        <p>Наши услуги не предназначены для детей младше 16 лет. Мы не собираем преднамеренно данные детей. Если вы считаете, что мы собрали данные ребенка, свяжитесь с нами.</p>
                    </section>
                    <section id="changes" className="terms-section">
                        <h2>Изменения политики</h2>
                        <p>Мы можем обновлять эту Политику конфиденциальности. Изменения вступают в силу с момента публикации на сайте. Рекомендуем периодически проверять эту страницу.</p>
                    </section>
                    <section id="contact" className="terms-section">
                        <h2>Контакты</h2>
                        <p>По вопросам, связанным с конфиденциальностью, обращайтесь:</p>
                        <p><strong>Email:</strong> <a href="mailto:privacy@poduschko.ru">privacy@poduschko.ru</a></p>
                        <p><strong>Почтовый адрес:</strong> Москва, ул. Тверская, д. 10, отдел конфиденциальности</p>
                        <p><strong>Телефон:</strong> <a href="tel:+78001234567">8 (800) 123-45-67</a></p>
                    </section>
                </div>
            </div>
        </main>
    )
}

export default PrivacyPage;