import "./MoviePage.css";
export default function MoviePage() {

    const renderStars = (rating) => {
        const stars = Math.round(rating / 2);
        return "★".repeat(stars) + "☆".repeat(5 - stars);
    };

    return (
        <div className="movie-container">
            <div className="movie-header">
                <img
                    className="movie-poster"
                    src="/images/image_placeholder.svg"
                    alt="Movie Poster"
                />


                <div className="movie-info">
                    <h1>Leffan Nimi</h1>
                    <p className="stars">{renderStars(8.0)}</p>
                    <p><strong>Vuosi:</strong> 2025</p>
                    <p><strong>Genret:</strong> Toiminta, Seikkailu</p>
                    <p><strong>Lisätietoja:</strong>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Suspendisse vehicula nunc quis tortor pulvinar, nec porta nisl tempor.
                    </p>
                </div>
            </div>
            <div className="genre-container">
                <span className="genre-tag">Toiminta</span>
                <span className="genre-tag">Seikkailu</span>
                <span className="genre-tag">Fantasia</span>
            </div>


            <h2>Näyttelijät</h2>
            <ul className="actors">
                <li><strong>Näyttelijä 1</strong> &nbsp;as&nbsp; Hahmo A</li>
                <li><strong>Näyttelijä 2</strong> &nbsp;as&nbsp; Hahmo B</li>
                <li><strong>Näyttelijä 3</strong> &nbsp;as&nbsp; Hahmo C</li>
            </ul>


            <h2>Arvostelut</h2>

            <div className="review">
                <h4>Arvostelu 1</h4>
                <p className="stars">{renderStars(8.0)}</p>
                <p>Mahtava leffa boidi!!</p>
            </div>

        </div>
    );
}
