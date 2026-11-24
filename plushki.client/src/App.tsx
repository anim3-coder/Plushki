import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext';
import ModalAuth from './components/ModalAuth';
import ErrorModal from './context/ErrorModal';
import Header from './Header';
import Footer from './Footer';
import BookingPage from './pages/booking/BookingPage';
import HomePage from './pages/Home/HomePage';
import Hotels from './pages/hotels/Hotels';
import FavoritesPage from './pages/Home/FavoritesPage';
import AboutPage from './pages/Info/AboutPage';
import AffiliatePage from './pages/Info/AffiliatePage';
import CareersPage from './pages/Info/CareersPage';
import ContactsPage from './pages/Info/ContactsPage';
import CookiesPage from './pages/Info/CookiesPage';
import FaqPage from './pages/Info/FaqPage';
import HowToBookPage from './pages/Info/HowToBookPage';
import PrivacyPage from './pages/Info/PrivacyPage';
import TermsPage from './pages/Info/TermsPage';
import PaymentPage from './pages/Info/PaymentPage';
import Profile from './pages/profiles/Profile';
import Settings from './pages/profiles/Settings';
import Booking from './pages/profiles/Booking';
import Reviews from './pages/profiles/Reviews';
import BookingDetails from './pages/profiles/BookingDetails';

const AppContent = () => {
    const { isAuthModalOpen, closeAuthModal } = useModal();

    return (
        <BrowserRouter>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<HomePage />} >
                        <Route path="search"/>
                    </Route>
                    <Route path="/hotel/:id" element={<Hotels />} />
                    <Route path="/booking/:hotelId/:roomId" element={<BookingPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/affiliate" element={<AffiliatePage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/contacts" element={<ContactsPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
                    <Route path="/faq" element={<FaqPage />} />
                    <Route path="/how-to-book" element={<HowToBookPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/payment" element={<PaymentPage />} />
                    <Route path="/booking-details/:id" element={<BookingDetails />} />
                    <Route path="/profile" element={<Profile />}>
                        <Route index element={<Navigate to="booking" replace />} />
                        <Route path="booking" element={<Booking />} />           {/* /profile */}
                        <Route path="settings" element={<Settings />} />  {/* /profile/settings */}
                        <Route path="reviews" element={<Reviews />} />      {/* /profile/orders */}
                    </Route>
                </Routes>
            </main>
            <Footer />
            <ModalAuth isOpen={isAuthModalOpen} onClose={closeAuthModal} />
            <ErrorModal/>
        </BrowserRouter>
    );
};

function App() {
    return (
        <AuthProvider>
            <ModalProvider>
                <AppContent />
            </ModalProvider>
        </AuthProvider>
    );
}

export default App;