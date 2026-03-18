import { useState } from "react";

export function ImageNameEditor({ imageId, initialValue, runMe, token }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [nameInput, setNameInput] = useState(initialValue);

    function handleEditPressed() {
        setNameInput(initialValue);
        setIsEditingName(true);
    }

    async function handleSubmitPressed() {
        setError("")
        setIsSaving(true)
        try{
            const response = await fetch(
                `/api/image/${imageId}/name?name=${encodeURIComponent(nameInput)}`,
                { method: "PUT",
                 headers: {'Authorization': `Bearer ${token}`}
                 }
            )
            if (!response.ok) {
                try {
                    if (response.status == 400) {
                         setError("Invalid image name");
                    } else if (response.status === 403) {
                        setError("You don’t have permission to edit this image");
                    } else if (response.status === 413) {
                         setError("Image name is too long");
                        }
                } catch {
                    setError("Unknown Error")
                }
                return
            }
            setIsEditingName(false)
            runMe(nameInput)
        } catch (err){
            setError("Unknown Error")
        } finally {
            setIsSaving(false)
        }
    }

    if (isEditingName) {
        return (
            <div>
                <div aria-live="polite">
                    {isSaving && <p>Renaming image...</p>}
                    {error && <p>{error}</p>}
                </div>
                <div style={{ margin: "1em 0" }}>
                    <label>
                        New Name
                        <input
                            disabled={isSaving}
                            required
                            style={{ marginLeft: "0.5em" }}
                            value={nameInput}
                            onChange={e => setNameInput(e.target.value)}
                        />
                    </label>
                    <button disabled={isSaving || nameInput.length === 0} onClick={handleSubmitPressed}>Submit</button>
                    <button disabled={isSaving} onClick={() => setIsEditingName(false)}>Cancel</button>
                </div>
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }
}