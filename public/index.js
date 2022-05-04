const url = 'http://localhost:3000'

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

const addAdmin = async (admin) => {
    const response = await fetch(url + '/admin/add_admin',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(admin
                // {
                //     name: 'admin13',
                //     email: 'asdfghjaf@gmail.com',
                //     password: 'password'
                // }
            )
        })
    const res = await response.json()
    if (!response.ok) return console.log(res)
    console.log(res);
    return res
}

const deleteAdmin = async (email, token) => {
    const response = await fetch(url + '/admin/delete_admin',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        })
    const res = await response.json()
    if (!response.ok) return console.log(res)
    return res.message
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

const createBookContainer = () => {
    const div = document.createElement('div')
    div.classList.add('book-container')
    return div
}

const addNameToContainer = (bookName, container) => {
    const nameContainer = document.createElement('div')
    nameContainer.innerText = bookName
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

const appendElToEl = (elFrom, elToQueryString) => {
    document.querySelector(elToQueryString).append(elFrom)
}


// deleteAdmin('lala@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjZmNjNjNTYzNWViNGJiZTVlMTk0NjkiLCJpYXQiOjE2NTE1NzkxNzYsImV4cCI6MTY1MTYwMDc3Nn0.19yn2XUE_a3EYfHdiyIbpOzPf7ZufQbnxI_l9eRezUM').then((res) => {
//     console.log(res);
// })

// getBook("test_book6").then((res) => {
//     console.log(res);
// })

// getBooks().
//     then((res) => {
//         res.forEach((element) => {
//             addImageToDiv(element.image, 'books-container')
//         });
//     })

const addClickEventToQueryAll = (queryAllText, callback) => {
    const bookContainers = document.querySelectorAll(queryAllText)
    for (let el of bookContainers)
        el.addEventListener('click', callback)
}

const appendDBBookToContainer = (dbbook, container) => {
    const bookContainer = createBookContainer()
    bookContainer.id = dbbook.name
    addNameToContainer(dbbook.name, bookContainer)
    addAuthorToContainer(dbbook.author.name, bookContainer)
    addImageToContainer(dbbook.image, bookContainer, 'book-img-container')
    appendElToEl(bookContainer, container)
}

const primaryFunc = async () => {
    const dbBooks = await findBooks('')
    dbBooks.forEach((element) => {
        appendDBBookToContainer(element, '#books-container')
    });
    addClickEventToQueryAll('.book-container', function () {
        console.log(this.id);
    })
}

primaryFunc()