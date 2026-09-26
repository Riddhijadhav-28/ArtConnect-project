function DeleteArtworkModal({
    artwork,
    onConfirm,
    onCancel,
    loading
}) {
    if (!artwork) {
        return null;
    }

    return (
        <div className="delete-modal-overlay">
            <div className="delete-modal">
                <div className="delete-modal-icon">
                    🗑️
                </div>

                <h2>Delete Artwork?</h2>
                <p>Are you sure you want to delete
                    <strong> "{artwork.title}"</strong>?
                </p>

                <span>This action cannot be undone.</span>

                <div className="delete-modal-actions">
                    <button className="delete-modal-cancel" onClick={onCancel} disabled={loading}>
                        Cancel
                    </button>

                    <button className="delete-modal-confirm" onClick={onConfirm} disabled={loading}>
                        {loading
                            ? "Deleting..."
                            : "Delete Artwork"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteArtworkModal;