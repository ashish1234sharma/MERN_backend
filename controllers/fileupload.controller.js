import * as dotenv from 'dotenv';

dotenv.config()
export const profileupload = (req, res) => {
    const { key } = req.file;

    try {
        const uploadedFileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
        console.log(uploadedFileUrl)
        return res.status(200).json({ url: uploadedFileUrl });
    } catch (error) {
        return res.status(400).json({ status: "failed to upload profile image", message: e.message });
    }
}
export const productimageupload = (req, res) => {

    try {
        if (!req?.files?.length) return res.status(400).json({ status: "failed to upload thumbnails", message: e.message });
        const thumbnails = req?.files?.map((value, _) => `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${value?.key}`)
        return res.status(200).json({ thumbnails: thumbnails });
    } catch (error) {
        return res.status(400).json({ status: "failed to upload thumbnails", message: e.message });
    }
}
