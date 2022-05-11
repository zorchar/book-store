const booksContainer = document.querySelector('#books-container')
const bookSearchInput = document.querySelector('#book-search-input')
const bookSearchButton = document.querySelector('#book-search-button')

const getBooks = async () => {
    const response = await fetch(url + '/books')
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const getBook = async (bookName) => {
    const response = await fetch(`${url}/books/${bookName}`)
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const findBooks = async (searchString) => {
    let books = await getBooks()

    books = books.filter((book) => {
        const bookName = book.name
        const authorName = book.author.name
        if (bookName.includes(searchString.toLowerCase()) || authorName.includes(searchString.toLowerCase()))
            return book
    })

    if (books.length > 0) {
        return books
    }
    return 'No books found.'
}

bookSearchButton?.addEventListener('click', async () => {
    const foundBooks = await findBooks(bookSearchInput.value)
    booksContainer.replaceChildren()
    if (foundBooks !== 'No books found.') {
        foundBooks.forEach((book) => {
            appendDBBookToContainer(book, booksContainer)
        });
        addClickEventToQueryAll('.book-container', async function () {
            putBookInModal(this)
        })
    }
    else {
        booksContainer.append(foundBooks)
    }
})

const addClickEventToQueryAll = (queryAllText, callback) => {
    const bookContainers = document.querySelectorAll(queryAllText)
    for (let el of bookContainers)
        el.addEventListener('click', callback)
}

const primaryFunc = async () => {
    try {
        if (window.location.href !== url + '/') {
            const user = await authUser()
            const substringAfterUser = window.location.href.substring(url.length + '/user/'.length)
            if (user.name !== substringAfterUser)
                window.location.replace(url)
        }
        else {
            const user = await authUser()
            if (user.name)
                window.location.replace(url + '/user/' + user.name)
        }
    }
    catch (error) {
        if (error.error != 'no authentication')
            window.location.replace(url)
    }
    try {
        const dbBooks = await findBooks('')
        dbBooks.forEach((book) => {
            appendDBBookToContainer(book, booksContainer)
        });
        addClickEventToQueryAll('.book-container', async function () {
            const finalSentence = this.id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            console.log(finalSentence);
            putBookInModal(this)
        })
    } catch (error) {
        console.log('can not find books');
    }
}

const putBookInModal = async (theThis) => {
    const bookContainerPlaceholder = addToCartModal.querySelector('.book-container-placeholder')
    const bookContainer = bookContainerPlaceholder.querySelector('.book-container')
    if (bookContainer)
        bookContainerPlaceholder.removeChild(bookContainer)
    addToCartModal.classList.remove('display-none')//do transition or loading..
    const book = await getBook(theThis.id)
    appendDBBookToContainer(book, bookContainerPlaceholder)
}

authUser()
    .then((res) => {
        if (res === 'no authentication')
            return
        document.querySelector('#admin-page').remove()
    })
    .catch((error) => {
        console.log('authUser.catch, error: ', error);
    })

primaryFunc()