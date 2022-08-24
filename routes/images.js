// route bugs URI to function
const express = require('express')
const router = express.Router()
const images = require('../services/images')

// image upload
const multer = require('multer')

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, callback) => {
        file.filename = 'bug' + '-' + Date.now() + '.' + file.originalname.split('.').pop()
        callback(null, file.filename)
    },
    fileFilter: (req, file, cb) => {
        // Allowed ext
        const allowed_filetypes = /jpeg|jpg|png|gif|webp/
        // Validate ext
        const file_extension = allowed_filetypes.test(path.extname(file.originalname).toLowerCase())
        // Validate mime
        const file_mimetype = allowed_filetypes.test(file.mimetype)

        if (file_mimetype && file_extension) {
            return cb(null, true)
        } else {
            cb('Error: Images Only!')
        }
    }
})
const upload = multer({ storage: storage }).single('image')

// POST image
router.post('/', upload, (req, res) => {
    res.json({ path: res.req.file })
})

// DELETE image
router.delete('/:filename', async (req, res, next) => {
    try {
        res.json(await images.remove(req.params.filename))
    } catch (err) {
        next(err)
    }
})

module.exports = router