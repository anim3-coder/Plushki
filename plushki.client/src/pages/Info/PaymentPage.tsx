import '../../styles/info-pages.css';
import '../../styles/utils/variables.css';
import '../../styles/utils/helpers.css';
import { Link } from 'react-router-dom';
const PaymentPage: React.FC = () => {
    return (
        <main className="container">
            <div className="info-page">
                <nav className="breadcrumbs">
                    <Link to="/">Главная</Link>
                    <span>/</span>
                    <span>Оплата</span>
                </nav>
                <h1>Способы оплаты</h1>
                <div className="page-content">
                    <div className="payment-methods">
                        <div className="cookies-section">
                            <div className="method-info">
                                <i className="fas fa-credit-card" />
                                <l>Банковские карты</l>
                                <p>Оплата картами Visa, MasterCard, Mir</p>
                                <ul>
                                    <li>Мгновенное подтверждение оплаты</li>
                                    <li>Защита 3D Secure</li>
                                    <li>Без комиссии</li>
                                </ul>
                            </div>
                        </div>
                        <div className="cookies-section">
                            <div className="method-info">
                                <i className="fas fa-mobile-alt" />
                                <l>СБП (Система быстрых платежей)</l>
                                <p>Оплата через мобильный банк</p>
                                <ul>
                                    <li>Мгновенное зачисление</li>
                                    <li>Без комиссии</li>
                                    <li>Поддержка всех крупных банков</li>
                                </ul>
                            </div>
                        </div>
                        <div className="cookies-section">
                            <div className="method-info">
                                <i className="fas fa-wallet" />
                                <l>Электронные кошельки</l>
                                <p>ЮMoney, QIWI, WebMoney</p>
                                <ul>
                                    <li>Быстрая оплата</li>
                                    <li>Защищенные транзакции</li>
                                    <li>Круглосуточная доступность</li>
                                </ul>
                            </div>
                        </div>
                        <div className="cookies-section">
                            <div className="method-info">
                                <i className="fas fa-money-bill-wave" />
                                <l>Наличные в отеле</l>
                                <p>Оплата при заселении</p>
                                <ul>
                                    <li>Доступно для некоторых отелей</li>
                                    <li>Подтверждение не требуется</li>
                                    <li>Оплата в местной валюте</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="info-section">
                        <h2>Безопасность платежей</h2>
                        <div className="security-features">
                            <div className="cookies-section">
                                <i className="fas fa-shield-alt" />
                                <l>SSL шифрование</l>
                                <p>Все данные передаются по защищенному соединению</p>
                            </div>
                            <div className="cookies-section">
                                <i className="fas fa-lock" />
                                <l>PCI DSS соответствие</l>
                                <p>Сертифицированная система обработки платежей</p>
                            </div>
                            <div className="cookies-section">
                                <i className="fas fa-user-shield" />
                                <l>3D Secure</l>
                                <p>Дополнительная проверка для карточных платежей</p>
                            </div>
                            <div className="cookies-section">
                                <i className="fas fa-eye-slash" />
                                <l>Конфиденциальность</l>
                                <p>Данные карт не сохраняются на наших серверах</p>
                            </div>
                        </div>
                    </div>
                    <div className="info-section">
                        <h2>Частые вопросы об оплате</h2>
                        <div className="faq-list">
                            <div className="faq-item">
                                <h3>Есть ли комиссия при оплате?</h3>
                                <p>Нет, мы не взимаем дополнительных комиссий за оплату. Вы платите ровно ту сумму, которая указана в подтверждении бронирования.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Что такое предварительная авторизация?</h3>
                                <p>При бронировании некоторые отели могут временно блокировать сумму на вашей карте для гарантии бронирования. Эта сумма разблокируется в течение 3-14 дней в зависимости от банка.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Можно ли оплатить часть суммы онлайн, а часть в отеле?</h3>
                                <p>Это зависит от условий конкретного отеля. Некоторые отели предлагают возможность частичной предоплаты. Информация об условиях оплаты указана на странице отеля при бронировании.</p>
                            </div>
                            <div className="faq-item">
                                <h3>Что делать, если платеж не прошел?</h3>
                                <p>Если платеж не прошел, проверьте:</p>
                                <ul>
                                    <li>Достаточно ли средств на карте</li>
                                    <li>Не превышен ли лимит операций</li>
                                    <li>Подключена ли услуга онлайн-платежей</li>
                                    <li>Правильность ввода данных карты</li>
                                </ul>
                                <p>Если проблема не решена, свяжитесь с вашим банком или нашей поддержкой.</p>
                            </div>
                        </div>
                    </div>
                    <div className="support-section">
                        <h2>Нужна помощь с оплатой?</h2>
                        <p>Наша служба поддержки готова помочь с любыми вопросами, связанными с оплатой.</p>
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

export default PaymentPage;