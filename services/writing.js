// writing API functions
const db = require('./db')
const helper = require('../helper')
const config = require('../config')
const { schema } = require('../schemas/writing')

// get multiple writings
async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage)
    const rows = await db.query(
        `SELECT * FROM writing
        LIMIT ?,?`,
        [offset, config.listPerPage]
    )
    let data = helper.emptyOrRows(rows)

    // fetch pageCount
    let pageCount = await db.query(
        `SELECT COUNT(*) as resultCount FROM writing`
    )

    pageCount = Math.ceil(pageCount[0].resultCount / config.listPerPage)

    const meta = { page, pageCount }

    return {
        data,
        meta
    }
}

// get one writing
async function getById(id) {
    if (!id) throw 'no writing id specified'

    const rows = await db.query(
        `SELECT * FROM writing WHERE writing_id = ?`,
        [id]
    )
    let data = helper.emptyOrRows(rows)

    if (data.length == 0) throw 'writing not found'

    // fetch tags
    const tags = await db.query(
        `SELECT * FROM writing_tag
        WHERE fk_writing = ?`,
        [id]
    )
    data[0].tags = helper.emptyOrRows(tags)

    const meta = { id }

    return {
        data,
        meta
    }
}

// create a new writing
async function create(writing) {
    if (writing.image === null) delete writing.image

    // validate
    let validatedwriting = schema.validate(writing)
    if (validatedwriting.error) return validatedwriting.error

    // create writing
    const result = await db.query(`
        INSERT INTO writing
        (image, content, favourite, draft)
        VALUES
        (?, ?, ?, ?)`,
        [writing.image, writing.content, writing.favourite, writing.draft])

    // create writingtype entries in writings_writingtypes table
    let typesResult

    if (writing.tags && writing.tags.length > 0) {
        typesResult = await db.query(`
        INSERT INTO writing_tag (fk_writing, title)
        VALUES ?`, [writing.tags.map(bt => [result.insertId, bt.toString()])]
        )
    }

    let message = result.affectedRows && (!typesResult || typesResult.affectedRows) ?
        'writing created successfully.' :
        'Error creating writing.'

    return { message, result }
}

// update a writing
async function update(id, writing) {
    writing.image = writing.image || ''

    let validatedwriting = schema.validate(writing)
    if (validatedwriting.error) throw validatedwriting.error


    const result = await db.query(
        `UPDATE writing
        SET image=?, content=?, favourite=?, draft=?
        WHERE writing_id=?`,
        [writing.image, writing.content, writing.favourite, writing.draft, id]
    )

    // update tags
    await db.query(`
        DELETE FROM writing_tag WHERE fk_writing = ?
    `, [id])

    if (writing.tags?.length > 0) await db.query(`
        INSERT INTO writing_tag(title, fk_writing) VALUES ?
    `, [writing.tags.map(title => [title, id])])

    let message = result.affectedRows ?
        'writing updated successfully.' :
        'Error updating writing.'

    return { message }
}

// remove a writing
async function remove(id) {
    // delete the writings_writingtypes entries
    await db.query(
        `DELETE FROM writing_tag WHERE fk_writing=?`, [id]
    )

    // delete the writing
    const result = await db.query(
        `DELETE FROM writing WHERE writing_id=?`, [id]
    )

    let message = result.affectedRows ?
        'writing removed successfully.' :
        'Error removing writing.'

    return { message }
}

// add tag to writing
async function tag(id, writingtypeid) {
    const result = await db.query(`
        INSERT INTO writing_tag
        (fk_writing, fk_writingtype)
        VALUES
        (?, ?)
        `, [id, writingtypeid])

    let message = result.affectedRows ?
        'writing tagged successfully.' :
        'Error tagging writing.'

    return { message }
}

// remove tag from writing
async function removeTag(id, writingtypeid) {
    const result = await db.query(`
        DELETE FROM writing_tag
        WHERE fk_writing=? AND fk_writingtype=?
    `, [id, writingtypeid])

    let message = result.affectedRows ?
        'writing tagged successfully.' :
        'Error tagging writing.'

    return { message }
}

module.exports = {
    getMultiple,
    getById,
    create,
    update,
    remove,
    tag,
    removeTag
}