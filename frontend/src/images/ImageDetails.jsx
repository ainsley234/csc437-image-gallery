import { useState, useEffect } from "react";
import { fetchById } from "./ImageFetcher.js";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor.jsx"

export function ImageDetails({ token }) {
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")
    const { imgId } = useParams();
    const [image, setImage] = useState(undefined);

    function runMe(newName) {
        const newImg = {...image}
        newImg.name = newName
        setImage(newImg)
    }

    useEffect(() => {
        const url = `/api/image/${imgId}`;

        async function doFetch() {
            try {
                const response = await fetch(url, { headers: {'Authorization': `Bearer ${token}`} });

                if (!response.ok) {
                  throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }
                const result = await response.json(); //parses to JSON
                setImage(result);
            } catch (error) {
                setErrorMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        doFetch();
    }, [imgId, token]);

    if (loading){
        return <h2>Loading...</h2>
    }
    if (errorMessage) {
        return <h2>{errorMessage}</h2>;
    }
    if (!image) {
        return <h2>Image not found</h2>
    }

    return (
        <div>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor imageId={imgId} initialValue={image.name} runMe={runMe} token={token} />
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
