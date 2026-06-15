const cloudinary = require("../lib/cloudinary");

const uploadImages = async (req, res) => {
    try {
        const uploadedImages = [];

        for (const file of req.files) {
            const base64 =
                `data:${file.mimetype};base64,${file.buffer.toString(
                    "base64"
                )}`;

            const result =
                await cloudinary.uploader.upload(
                    base64,
                    {
                        folder:
                            "industrial-marketplace",
                    }
                );

            uploadedImages.push(
                result.secure_url
            );
        }

        res.json(uploadedImages);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Upload failed",
        });
    }
};

module.exports = {
    uploadImages,
};