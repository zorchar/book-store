const deleteBook = async (bookName) => {
    const response = await fetch(url + '/book/delete',
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
        const div = document.createElement('div')
        div.innerText = res.message
        return document.querySelector('#add-book-modal-container').querySelector('.modal').append(div)
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
    document.querySelector('#add-book-modal-container').classList.add('display-none')
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

    document.querySelector('#sign-out')?.addEventListener('click', async (event) => {
        try {
            await userLogout()
            window.location.replace(url)
        }
        catch (error) {
            console.log(error);
        }
    })

    document.querySelector('#add-book-button').addEventListener('click', () => {
        document.querySelector('#add-book-modal-container').classList.remove('display-none')
    })
}

primaryFunc()