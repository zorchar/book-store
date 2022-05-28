const deleteBook = async (bookName) => {
    const response = await fetch(url + '/books/' + bookName,
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

const addBook = async (bookName, authorName, imageURL, description, price) => {
    const response = await fetch(url + '/books/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: bookName,
                author: authorName,
                image: imageURL,
                description,
                price
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
    const description = document.querySelector('#description').value
    const price = document.querySelector('#price').value

    const res = await addBook(bookName, authorName, url, description, price)
    if (res.message) {
        return document.querySelector('#add-book-modal-container').querySelector('.message-container').innerText = res.message
    }
    window.location.replace(window.location.href)
})

const editBook = async (currentBookName, bookName, authorName, imageURL, description, price) => {
    const response = await fetch(url + '/books/' + currentBookName,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                currentName: currentBookName,
                name: bookName,
                author: authorName,
                image: imageURL,
                description,
                price
            })
        })
    const res = await response.json()
    return res
}

document.querySelector('#edit-book-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    const currentBookName = document.querySelector('#edit-current-book-name').value
    const bookName = document.querySelector('#edit-book-name').value
    const authorName = document.querySelector('#edit-author-name').value
    const url = document.querySelector('#edit-image-url').value
    const description = document.querySelector('#edit-description').value
    const price = document.querySelector('#edit-price').value

    const res = await editBook(currentBookName, bookName, authorName, url, description, price)
    if (res.message) {
        return document.querySelector('#edit-book-modal-container').querySelector('.message-container').innerText = res.message
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

document.querySelector('#edit-book-modal-backdrop').addEventListener('click', () => {
    const bookModalContainer = document.querySelector('#edit-book-modal-container')
    bookModalContainer.querySelector('.message-container').innerText = ""
    bookModalContainer.classList.add('display-none')
})

const primaryFunc = async () => {
    try {
        const admin = await authAdmin()
        if (!admin.name) {
            window.location.replace(url + '/admins')
        }
    }
    catch {
        window.location.replace(url)
    }
    addAddBookButton()
    navBarToSignedIn()
    document.querySelector('#cart')?.remove()

    addClickEventToQueryAll('.book-container', async function () {
        putBookInModal(this)
    })

    // foundBooks = await getAllBooks(bookSearchInput.value)
    // searchRender(0)

    await addUserLogoutClickEvent()

    document.querySelector('#add-book-button').addEventListener('click', () => {
        document.querySelector('#add-book-modal-container').classList.remove('display-none')
    })

    document.querySelector('#edit-book-button').addEventListener('click', () => {
        document.querySelector('#edit-book-modal-container').classList.remove('display-none')
    })

}

primaryFunc()