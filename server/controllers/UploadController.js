import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

const photoDir = process.cwd() + '/images'

const fileUpload = async (req, res, next) => {
    try {
        let id = ''
        if (req.params.folder !== 'avatar' && req.params.folder !== 'cardata') return res.status(400).send({ message: 'Image upload target is null or has wrong value.' })
        if (req.params.folder === 'avatar') {
            if (req.params.id === undefined || isNaN(req.params.id)) return res.status(400).send({ message: 'ID of image owner is null or has wrong type.' })
            id = req.params.id
        }
        if (req.params.folder === 'cardata') id = req.params.number
        if (!fs.existsSync(photoDir)) fs.mkdirSync(photoDir)

        const images = []

        let dataUploaded = {
            images
        }

        const form = formidable({ multiples: true, uploadDir: photoDir, keepExtensions: true })

        form.on('fileBegin', (key, file) => {
            if (req.params.folder === 'avatar') {
                if (file.name === '') return res.status(500).send({ message: 'Avatar can\'t be empty.' })
                if (file.type.split('/')[0] !== 'image') return res.status(400).send({ message: 'File should be an image.' })
            }
            const specificFolder = photoDir + `/${req.params.folder}/`
            if (!fs.existsSync(specificFolder)) fs.mkdirSync(specificFolder)
            const specificPath = specificFolder + `/${id}/`
            if (!fs.existsSync(specificPath)) fs.mkdirSync(specificPath)
            file.path = path.join(specificPath + file.name)
        })
            .parse(req, async (err, fields) => {
                if (err) return res.status(500).send({ message: `Upload file: ${error}.` })
                if (fields) dataUploaded = { ...dataUploaded, fields: fields }
        })
            .on('file', (key, file) => {
                const fileName = file.name
                const fileSize = file.size
                const fileType = file.type
                images.push({ key, fileName, fileSize, fileType })
        })
            .on('end', () => {
                console.log('-> Uploading done')
                req.dataUploaded = dataUploaded
                next()
        })
    } catch (error) {
        return res.status(500).send({ message: `File upload ${error}.` })
    }
}

export default { fileUpload }