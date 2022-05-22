const deleteBook = async (bookName) => {
    const response = await fetch(url + '/book/' + bookName,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: bookName
            })
        })
    const res = await response.json()
    if (!response.ok) return console.log(res)
    return res
}

const addBook = async (bookName, authorName, imageURL) => {
    const response = await fetch(url + '/book/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: bookName,
                author: authorName,
                image: imageURL
            })
        })
    const res = await response.json()
    return res
}

document.querySelector('#add-book-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const bookName = document.querySelector('#book-name').value
    const authorName = document.querySelector('#author-name').value
    const url = document.querySelector('#image-url').value

    const res = await addBook(bookName, authorName, url)
    if (res.message) {
        return document.querySelector('#add-book-modal-container').querySelector('.message-container').innerText = res.message
    }
    window.location.replace(window.location.href)
})

document.querySelector('#delete-book').addEventListener('submit', async (event) => {
    event.preventDefault()
    const bookName = document.querySelector('.book-container-placeholder').querySelector('.book-container').id

    await deleteBook(bookName)
    window.location.replace(window.location.href)
})

document.querySelector('#add-book-modal-backdrop').addEventListener('click', () => {
    const bookModalContainer = document.querySelector('#add-book-modal-container')
    bookModalContainer.querySelector('.message-container').innerText = ""
    bookModalContainer.classList.add('display-none')
})

const primaryFunc = async () => {
    try {
        await authAdmin()
    }
    catch {
        window.location.replace(url)
    }
    addAddBookButton()
    navBarToSignedIn()
    document.querySelector('#cart')?.remove()
    foundBooks = await findBooks(bookSearchInput.value)
    searchRender(0)

    await addUserLogoutClickEvent()

    document.querySelector('#add-book-button').addEventListener('click', () => {
        document.querySelector('#add-book-modal-container').classList.remove('display-none')
    })
}

primaryFunc()