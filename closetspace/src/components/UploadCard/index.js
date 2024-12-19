const UploadCard = ({ file, removeFn, updateFileMetadata }) => {
    return (
        <div className="upload-card-wrapper">
            <div className="image-box">
                <img src={file.preview} />
                <button
                    className="remove-btn"
                    onClick={() => {
                        removeFn(file.name);
                    }}
                >
                    Remove
                </button>
            </div>

            <div className="fields-container">
                <div>
                    <label className="input-label">Name</label>
                    <input
                        className="text-input"
                        placeholder="Name..."
                        onInput={(e) => {
                            let newMetadata = {
                                display_name: e.target.value,
                            };
                            updateFileMetadata(file.name, newMetadata);
                        }}
                    />
                </div>
                <div>
                    <label className="input-label">Brand</label>
                    <input className="text-input" placeholder="Brand..." />
                </div>
            </div>
        </div>
    );
};

export default UploadCard;
