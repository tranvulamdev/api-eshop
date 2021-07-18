const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer = require('multer')

CLOUD_NAME = process.env.CLOUD_NAME
API_KEY = process.env.API_KEY
API_SECRET = process.env.API_SECRET

// xem MIME types
const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'eshop',
        allowed_formats: ['png', 'jpg', 'jpeg'],
        use_filename: true,
        filename_override: function (req, file) {
            const fileName = file.originalname.split(' ').join('-')

            return fileName
        },
    },
})

const cloudinaryParser = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const isValid = FILE_TYPE_MAP[file.mimetype]

        if (isValid) cb(null, true)
        else
            return cb(
                new Error('Only .png, .jpg and .jpeg format allowed!'),
                false
            )
    },
})

module.exports = cloudinaryParser
