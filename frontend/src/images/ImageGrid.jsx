import "./Images.css";

export function ImageGrid(props) {
    const imageElements = props.images.map((image) => (
        <div key={image._id} className="ImageGrid-photo-container">
            <a href={"/images/" + image._id}>
                <img src={image.src} alt={image.name}/>
            </a>
        </div>
    ));
    return (
        <div className="ImageGrid">
            {imageElements}
        </div>
    );
}
