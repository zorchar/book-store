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

const addImageToContainer = (imageLink, container, imgContainerClassName = 'img-container') => {
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
        bookContainer.id = dbbook.name
        bookContainer.name = dbbook.name
        addImageToContainer(dbbook.image, bookContainer, 'book-img-container')
        addNameToContainer(dbbook.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
        addAuthorToContainer(dbbook.author.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
        appendElToEl(bookContainer, container)
        if (quantity) {
            const quanDiv = document.createElement('div')
            quanDiv.classList.add('quantity')
            quanDiv.innerText = `Quantity: ${quantity}`
            bookContainer.append(quanDiv)
        }
    }
}

const getBook = async (bookName) => {
    const response = await fetch(`${url}/books/${bookName}`)
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const getBooks = async (page, limit) => {
    const response = await fetch(url + `/books?page=${page}&limit=${limit}`)
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const findBooks = async (searchString, page, limit) => {
    let books = await getBooks(page, limit)
    books = books.results

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

const renderNextAndPreviousIfNeeded = (page, limit) => {
    if (page * limit < foundBooks.length)
        nextButton.classList.remove('display-none')
    else {
        nextButton.classList.add('display-none')
    }
    if (page > 1)
        previousButton.classList.remove('display-none')
    else {
        previousButton.classList.add('display-none')
    }
}

const nextButton = document.querySelector('#next')
const previousButton = document.querySelector('#previous')

nextButton?.addEventListener('click', async () => {
    paginate(nextButton)
})

previousButton?.addEventListener('click', async () => {
    paginate(previousButton)
})

const changeNextAndPreviousLinks = (pageNumber) => {
    nextButton.children[0].id = pageNumber + 1
    previousButton.children[0].id = pageNumber - 1
}

const paginate = (button) => {
    const pageNumber = parseInt(button.children[0].id)
    changeNextAndPreviousLinks(pageNumber)
    renderNextAndPreviousIfNeeded(pageNumber, 5)
    searchRender((pageNumber - 1) * 5)
}

const searchRender = (startIndex) => {
    booksContainer.replaceChildren()
    if (foundBooks !== 'No books found.') {
        for (let i = startIndex; i < startIndex + 5; i++) {
            appendDBBookToContainer(foundBooks[i], booksContainer)
        }
        addClickEventToQueryAll('.book-container', async function () {
            putBookInModal(this)
        })
    }
    else {
        booksContainer.append(foundBooks)
    }
}

let foundBooks
bookSearchButton?.addEventListener('click', async () => {
    if (window.location.href.includes('cart')) {
        const foundCart = await getCart()
        foundBooks = []
        if (foundCart?.length > 0) {
            for (let el of foundCart) {
                foundBooks.push(el?.book)
            }
        }
        let tempBooks = []
        if (foundBooks?.length > 0) {
            for (let el of foundBooks) {
                if (el?.name.includes(bookSearchInput.value) || el?.author.name.includes(bookSearchInput.value)) {
                    tempBooks.push(el)
                }
            }
        }
        foundBooks = tempBooks
    }
    else {
        foundBooks = await findBooks(bookSearchInput.value)
    }
    changeNextAndPreviousLinks(1)
    renderNextAndPreviousIfNeeded(1, 5)
    searchRender(0)
})
