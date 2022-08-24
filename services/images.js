const fsasync = require('fs/promises')
const fs = require('fs')
const db = require('./db')
const bugs = require('./writing')

async function remove(filename) {
    if (!filename || filename.length == 0) throw 'No filename specified'

    const OLDIMAGEPATH = `public/uploads/${filename.split('/').pop()}`

    // delete if exists
    if (fs.existsSync(OLDIMAGEPATH)) await fsasync.unlink(OLDIMAGEPATH)
    else throw 'File does not exist'

    // delete image from bugs
    const AFFECTEDBUGS = await db.query(`SELECT * FROM bugs WHERE image LIKE '%?'`, [OLDIMAGEPATH])
    for (let bug of AFFECTEDBUGS) {
        bug.image = ''
        bug.done = bug.done === 1
        await bugs.update(bug.id, bug)
    }
}

module.exports = {
    remove
}