// route writings URI to function
const express = require('express')
const router = express.Router()
const writings = require('../services/writing')
const fsasync = require('fs/promises')
const fs = require('fs')

// GET writings
router.get('/', async function (req, res, next) {
    try {
        res.json(await writings.getMultiple(req.query.page, req.query.done && req.query.done == 'true', req.query.developerFilter))
    } catch (err) {
        next(err)
    }
})

// GET specific writing
router.get('/:id', async function (req, res, next) {
    try {
        // if id is specified, get specific writing
        res.json(await writings.getById(req.params.id))
    } catch (err) {
        next(err)
    }
})

// POST writing
router.post('/', async function (req, res, next) {
    try {
        const postResponse = await writings.create(req.body.params)

        if (postResponse.details?.length > 0) res.status(500).send(postResponse.details)
        else res.json({ message: postResponse.message, id: postResponse.result.insertId })
    } catch (err) {
        next(err)
    }
})

// PUT writings
router.put('/:id', async function (req, res, next) {
    try {
        // if image changed, remove old image if there is one and it exists
        const OLDDATA = await writings.getById(req.params.id)

        const OLDIMAGE = OLDDATA.data[0].image
        // delete if exists
        if (OLDIMAGE && OLDIMAGE != '' && OLDIMAGE != req.body.params.image)
            if (fs.existsSync(`public/uploads/${OLDIMAGE.split('/').pop()}`)) await fsasync.unlink(OLDIMAGEPATH)

        // update writing
        res.json(await writings.update(req.params.id, req.body.params))
    } catch (err) {
        next(err)
    }
})

// DELETE writings
router.delete('/:id', async function (req, res, next) {
    try {
        // if image changed, remove old image if there is one and it exists
        const OLDDATA = await writings.getById(req.params.id)
        const OLDIMAGE = OLDDATA.data[0].image
        const OLDIMAGEPATH = `public/uploads/${OLDIMAGE.split('/').pop()}`

        // delete if exists
        if (OLDIMAGE && OLDIMAGE.length != '' && fs.existsSync(OLDIMAGEPATH))
            await fsasync.unlink(OLDIMAGEPATH)

        // delete writing
        res.json(await writings.remove(req.params.id))
    } catch (err) {
        next(err)
    }
})

// Add writingtype to writing
router.post('/:id/tag/:writingtypeid', async function (req, res, next) {
    try {
        res.json(await writings.tag(req.param.id, req.param.writingtypeid))
    } catch (err) {
        next(err)
    }
})

// Remove writingtype from writing
router.delete('/:id/tag/:writingtypeid', async function (req, res, next) {
    try {
        res.json(await writings.removeTag(req.param.id, req.param.writingtypeid))
    } catch (err) {
        next(err)
    }
})

module.exports = router