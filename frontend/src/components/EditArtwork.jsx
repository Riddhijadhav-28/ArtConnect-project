import { useState } from "react";

function EditArtwork({ artwork, onSave, onCancel, loading }) {

    const [title, setTitle] = useState(artwork.title || "");
    const [description, setDescription] = useState(artwork.description || "");
    const [category, setCategory] = useState(artwork.category || "");

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            title,
            description,
            category
        });
    };

    return (
        <form className="artwork-edit-form" onSubmit={handleSubmit}>
            <div className="artwork-edit-field">
                <label>Title</label>

                <input type="text" value={title} onChange={(e) =>setTitle(e.target.value)} required/>
            </div>

            <div className="artwork-edit-field">
                <label>Description</label>

                <textarea value={description} onChange={(e) =>setDescription(e.target.value)} required />
            </div>


            <div className="artwork-edit-field">
                <label>Category</label>

                <select value={category} onChange={(e) =>setCategory(e.target.value)}required >
                    <option value="">Select Category</option>
                    <option value="Digital">Digital</option>
                    <option value="Sketch">Sketch</option>
                    <option value="Painting">Painting</option>
                    <option value="Watercolor">Watercolor</option>
                    <option value="Portrait">Portrait</option>
                    <option value="Illustration">Illustration</option>
                    <option value="Photography">Photography</option>
                    <option value="Sculpture">Sculpture</option>
                    <option value="Calligraphy">Calligraphy</option>
                    <option value="Abstract">Abstract</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="artwork-edit-actions">

                <button type="submit" className="save-artwork-btn" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : "Save Changes"}
                </button>

                <button type="button" className="cancel-artwork-btn" onClick={onCancel} disabled={loading} >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EditArtwork;