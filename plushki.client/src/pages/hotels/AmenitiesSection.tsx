import '../../styles/hotel-page.css';

interface AmenityCategory {
    icon: string;
    name: string;
    type: string;
    data: string[];
}

interface AmenitiesSectionProps {
    categories: AmenityCategory[];
}


const RenderIcon: React.FC<AmenityCategory> = ({ icon, name, type }) => {
    if (type === "Fas") {
        return (
            <>
                <i className={`fas fa-${icon}`} /> {name}
            </>
        );
    }
};

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ categories }) => {
    return (
        <div className="detail-section">
            <h2>Удобства и услуги</h2>
            <div className="amenities-grid ">
                {categories.map((cat, idx) => (
                    <div key={idx} className="amenity-category background">
                        <h3><RenderIcon {...cat} /></h3>
                        <ul>
                            {cat.data.map((data, i) => (
                                <li key={i}>{data}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AmenitiesSection;