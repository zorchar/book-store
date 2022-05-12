const booksContainer = document.querySelector('#books-container')

const createBookContainer = () => {
    const div = document.createElement('div')
    div.classList.add('book-container')
    return div
}

const addNameToContainer = (bookName, container) => {
    const nameContainer = document.createElement('div')
    const h3 = document.createElement('h3')
    h3.innerText = bookName
    nameContainer.append(h3)
    container.append(nameContainer)
}

const addAuthorToContainer = (authorName, container) => {
    const authorNameContainer = document.createElement('div')
    authorNameContainer.innerText = authorName
    container.append(authorNameContainer)
}

const addImageToContainer = (imageLink, container, imgContainerClassName = 'img-container') => { // later think about class name and classname implementation
    const img = document.createElement('img')
    const imgContainer = document.createElement('div')
    img.src = imageLink
    imgContainer.classList.add(imgContainerClassName)
    imgContainer.append(img)
    container.append(imgContainer)
}

const appendElToEl = (elFrom, elTo) => {
    elTo.append(elFrom)
}

const appendDBBookToContainer = (dbbook, container, quantity = false) => {
    const bookContainer = createBookContainer()
    if (dbbook) {
        bookContainer.id = dbbook.name/////////// can cause bugs
        bookContainer.name = dbbook.name
        addNameToContainer(dbbook.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
        addAuthorToContainer(dbbook.author.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
        addImageToContainer(dbbook.image, bookContainer, 'book-img-container')
        appendElToEl(bookContainer, container)
        if (quantity) {
            const quanDiv = document.createElement('div')
            quanDiv.classList.add('quantity')
            quanDiv.innerText = `Quantity: ${quantity}`
            bookContainer.append(quanDiv)
        }
    }
}

const renderAllBooksOnPage = async () => {
    try {
        const dbBooks = await findBooks('')
        dbBooks.forEach((book) => {
            appendDBBookToContainer(book, booksContainer)
        });
        addClickEventToQueryAll('.book-container', async function () {
            putBookInModal(this)
        })
    } catch (error) {
        console.log('can not find books');
    }
}

const getBook = async (bookName) => {
    const response = await fetch(`${url}/books/${bookName}`)
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const getBooks = async () => {
    const response = await fetch(url + '/books')
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

const bookSearchInput = document.querySelector('#book-search-input')
const bookSearchButton = document.querySelector('#book-search-button')

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
