// helper functions

// calculate the offset for pagination
function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage]
}

// provide empty array as fallback if no rows
function emptyOrRows(rows) {
    return !rows ? [] : rows
}

module.exports = {
    getOffset,
    emptyOrRows
}