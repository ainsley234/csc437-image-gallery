import { React, useId, useState, useEffect, useActionState } from "react"
import { MainLayout } from "./MainLayout.jsx";

//fetch include: { headers: {'Authorization': `Bearer ${token}`} }
export function UploadPage({ token }) {
    const ID = useId()
    const [imagePreview, setImagePreview] = useState(null)

    function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    }

    async function handleUpload(e) {
        const file = e.target.files[0];
        if (!file) { setImagePreview(null) }

        try {
            const imgURL = await readAsDataURL(file);
            setImagePreview(imgURL);
        } catch (err) {
            console.error("Failed to read file", err);
            setImagePreview(null);
        }
    };

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const image = formData.get("image");
            const name = formData.get("name");

            if (!image || !name) {
                setImagePreview(null);
                return "Missing image or file name.";
            }

            let response=null

            try {
                response = await fetch("/api/images", {
                  method: "POST",
                  headers: { headers: {'Authorization': `Bearer ${token}`} },
                  body: JSON.stringify({image, name}) }
                );
                if (!response.ok) {
                  throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
                }
                return
          } catch (error) {
              setImagePreview(null);
              return error.message;
          }

          return null
        },
        null
    );

    return (
        <div>
            <h2>Upload</h2>
            <form>
                <div>
                    <label htmlFor={ID}>Choose image to upload: </label>
                    <input
                        id={ID}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={handleUpload}
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={isPending}/>
                    </label>
                </div>

                <div> {/* Preview img element */}
                    <img style={{width: "20em", maxWidth: "100%"}} src={imagePreview} alt="" />
                </div>

                <input type="submit" value="Confirm upload" disabled={isPending} />
            </form>
        </div>
    );
}
