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

const addPriceToContainer = (price, container) => {
    const priceContainer = document.createElement('div')
    priceContainer.innerText = "Price: " + price
    container.append(priceContainer)
}

const addDescriptionToContainer = (description, container) => {
    const descContainer = document.createElement('div')
    descContainer.classList.add('desc-container')
    descContainer.innerText = description
    container.append(descContainer)
}

const appendDBBookToContainer = (dbbook, container, quantity = false) => {
    const bookContainer = createBookContainer()
    if (dbbook) {
        bookContainer.id = dbbook.name
        bookContainer.name = dbbook.name
        addImageToContainer(dbbook.image, bookContainer, 'book-img-container')
        addNameToContainer(dbbook.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
        addAuthorToContainer(dbbook.author.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
        addPriceToContainer(dbbook.price, bookContainer)
        container.append(bookContainer)
        if (quantity) {
            const quanDiv = document.createElement('div')
            quanDiv.classList.add('quantity')
            quanDiv.innerText = `Quantity: ${quantity}`
            bookContainer.append(quanDiv)
        }
    }
}

const getBook = async (bookName) => {
    const response = await fetch(`${url}/books/${bookName}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Is-Fetch': `true`
            },
        }
    )
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const getBooks = async () => {
    const response = await fetch(url + `/books`)
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const getAllBooks = async () => {
    const response = await fetch(url + `/all-books`)
    if (!response.ok) return console.log(response.statusText)
    return await response.json()
}

const findBooks = (searchString) => {
    const href = window.location.href.slice(0, window.location.href.indexOf('?'))
    window.location.replace(href + `?search=` + searchString)
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
    const queryStartLocation = window.location.href.indexOf('?')
    const href = window.location.href.slice(0, queryStartLocation !== -1 ? queryStartLocation : window.location.href.length)
    const searchString = sessionStorage.getItem('searchString') ? sessionStorage.getItem('searchString') : ""
    return window.location.replace(href + '?search=' + searchString + '&limit=5&page=' + pageNumber)
}

const searchRender = (startIndex) => {
    const booksContainer = document.querySelector('#books-container')
    booksContainer.replaceChildren()
    if (foundBooks !== 'No books found.') {
        for (let i = startIndex; i < startIndex + 5; i++) {
            appendDBBookToContainer(foundBooks[i], booksContainer)
        }
        addClickEventToQueryAll('.book-container', async function () {
            if (window.location.href.includes(url + '/admins/'))
                putBookInModal(this)
            else
                window.location.replace(url + '/books/' + this.name)
        })
    }
    else {
        booksContainer.append(foundBooks)
    }
}

let foundBooks
bookSearchButton?.addEventListener('click', async () => {
    sessionStorage.setItem('searchString', bookSearchInput.value)
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
                if (el?.name.includes(bookSearchInput.value) || el?.author.includes(bookSearchInput.value)) {
                    tempBooks.push(el)
                }
            }
        }
        foundBooks = tempBooks
    }
    else {
        foundBooks = findBooks(bookSearchInput.value)
    }
    bookSearchInput.value = ""
    searchRender(0)
})
