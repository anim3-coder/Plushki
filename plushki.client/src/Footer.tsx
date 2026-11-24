import './index.css';
import './styles/main.css';
import './styles/utils/helpers.css';
import './styles/components/footer.css';
import { Link } from 'react-router-dom';
function Footer() {
    return (
        <footer>
            <div className="container">
                <div className="footer-content">
                    <div className="footer-column">
                        <h3>О нас</h3>
                        <ul>
                            <Link to='/about'><li>О компании</li></Link>
                            <Link to='/contacts'><li>Контакты</li></Link>
                            <Link to='/careers'><li>Вакансии</li></Link>
                            <Link to='/affiliate'><li>Партнерская программа</li></Link>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Помощь</h3>
                        <ul>
                            <Link to='/how-to-book'><li>Как забронировать</li></Link>
                            <Link to='/faq'><li>Частые вопросы</li></Link>
                            <Link to='/payment'><li>Оплата</li></Link>
                            <Link to='/terms'><li>Правила использования</li></Link>
                        </ul>
                    </div>
                    <div className="footer-column">
                        <h3>Направления</h3>
                        <ul>
                            <Link to='/search?city=Москва'><li>Отели Москвы</li></Link>
                            <Link to='/search?city=Санкт-Петербург'><li>Отели Санкт-Петербурга</li></Link>
                            <Link to='/search?city=Сочи'><li>Отели Сочи</li></Link>
                            <Link to='/search?city=Крым'><li>Отели Крыма</li></Link>
                        </ul>
                    </div>
                </div>
                <div className="copyright">
                    <p>© 2023 ПодУшко. Все права защищены.</p>
                    <div className="footer-links">
                        <Link to='/privacy'><li>Политика конфиденциальности</li></Link>
                        <Link to='/cookies'><li>Использование cookies</li></Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;