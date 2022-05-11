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
    bookContainer.id = dbbook.name/////////// can cause bugs
    bookContainer.name = dbbook.name
    addNameToContainer(dbbook.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
    addAuthorToContainer(dbbook.author.name.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()), bookContainer)
    addImageToContainer(dbbook.image, bookContainer, 'book-img-container')
    appendElToEl(bookContainer, container)
    if (quantity) {
        const quanDiv = document.createElement('div')
        quanDiv.innerText = `Quantity: ${quantity}`
        bookContainer.append(quanDiv)
    }
}
