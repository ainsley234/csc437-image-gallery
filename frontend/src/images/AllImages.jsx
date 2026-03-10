import { useState, useEffect } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";

export function AllImages() {
    const [imageData, _setImageData] = useState([]);
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const url = "/api/images";

        async function doFetch() {
            try {

                const response = await fetch(url);
                console.log("it is running")
                if (!response.ok) {
                  throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }
                const result = await response.json(); //parses to JSON
                _setImageData(result);
            } catch (error) {
                setErrorMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        doFetch();
    }, []);

    if (loading){
        return <h2>Loading...</h2>
    }

    return (
        <div>
            <h2>All Images</h2>
            <ImageGrid images={imageData} />
        </div>
    );
}
