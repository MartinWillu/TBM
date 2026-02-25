import "./Styles/Footer.css";

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="container footer-content">
                <a href="https://github.com/MartinWillu/TBM"><p>&copy; {currentYear} The Forbidden Fridge</p></a>
            </div>
        </footer>
    );
}
