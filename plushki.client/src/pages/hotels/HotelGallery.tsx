import '../../styles/hotel-page.css';

interface HotelGalleryProps {
    images: string[]; // массив URL изображений
    mainImageIndex?: number;
    onThumbnailClick?: (index: number) => void;
}

const HotelGallery: React.FC<HotelGalleryProps> = ({
    images,
    mainImageIndex = 0,
    onThumbnailClick
}) => {
    const mainImage = images[mainImageIndex];
    const thumbnails = images.slice(0, 4); // показываем до 4 миниатюр

    return (
        <div className="hotel-gallery">
            <div className="main-image">
                <img src={mainImage} alt="Hotel main" />
            </div>
            <div className="thumbnail-grid">
                {thumbnails.map((img, idx) => (
                    <div
                        key={idx}
                        className="thumbnail"
                        onClick={() => onThumbnailClick?.(idx)}
                    >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelGallery;