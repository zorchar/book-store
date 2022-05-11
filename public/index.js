const signInModal = document.querySelector('#sign-in-modal-container')
const signUpModal = document.querySelector('#sign-up-modal-container')
const signInAdminModal = document.querySelector('#sign-in-admin-modal-container')
const addToCartModal = document.querySelector('#add-to-cart-modal-container')

document.querySelector('#add-to-cart-modal-backdrop')?.addEventListener('click', () => {
    addToCartModal.classList.add('display-none')
})

document.querySelector('#sign-in-modal-backdrop')?.addEventListener('click', () => {
    signInModal.classList.add('display-none')
})

document.querySelector('#sign-up-modal-backdrop')?.addEventListener('click', () => {
    signUpModal.classList.add('display-none')
})

document.querySelector('#sign-in-admin-modal-backdrop')?.addEventListener('click', () => {
    signInAdminModal.classList.add('display-none')
})

document.querySelector('#sign-in-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const email = document.querySelector('#sign-in-email-input').value
        const password = document.querySelector('#sign-in-password-input').value

        res = await userLogin(email, password)
        window.location.replace(url + '/user/' + res.user.name)
    }
    catch (error) {
        signInModal.classList.add('display-none')
        console.log(error);
    }
})

document.querySelector('#sign-up-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const name = document.querySelector('#sign-up-name-input').value
        const email = document.querySelector('#sign-up-email-input').value
        const password = document.querySelector('#sign-up-password-input').value

        res = await userSignUp(name, email, password)
        window.location.replace(url + '/user/' + res.user.name)
    }
    catch (error) {
        signInModal.classList.add('display-none')
        console.log(error);
    }
})

document.querySelector('#sign-in-admin-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const email = document.querySelector('#sign-in-admin-email-input').value
        const password = document.querySelector('#sign-in-admin-password-input').value

        res = await adminLogin(email, password)
        window.location.replace(url + '/admin/' + res.admin.name)
    }
    catch (error) {
        signInModal.classList.add('display-none')
        console.log(error);
    }
})

const authUser = async () => {
    const response = await fetch(url + '/user/auth_user',
        {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        }
    )
    const res = await response.json()
    if (!response.ok) {
        throw res
    }
    return res
}

document.querySelector('#add-to-cart-form').addEventListener('submit', (event) => {
    event.preventDefault()
    addToCartModal.classList.add('display-none')
    addToCart(addToCartModal.querySelector('.book-container').name)///////////////////// keep on
        .then(() => {
            console.log('book added');
            // window.location.replace(url + '/user/login2')
        })
        .catch((error) => {
            console.log(error);
        })
})

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

const addClickEventToQueryAll = (queryAllText, callback) => {
    const bookContainers = document.querySelectorAll(queryAllText)
    for (let el of bookContainers)
        el.addEventListener('click', callback)
}

const primaryFunc = async () => {
    try {
        if (window.location.href !== url + '/') {
            const user = await authUser()
            console.log(user.name);
            const substringAfterUser = window.location.href.substring(url.length + '/user/'.length)
            if (user.name !== substringAfterUser)
                window.location.replace(url)

        }
        const dbBooks = await findBooks('')
        const bookContainer = document.querySelector('#books-container')
        dbBooks.forEach((book) => {
            appendDBBookToContainer(book, bookContainer)
        });
        addClickEventToQueryAll('.book-container', function () {
            const finalSentence = this.id.replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
            console.log(finalSentence);
        })
        addClickEventToQueryAll('.book-container', async function () {
            const bookContainerPlaceholder = addToCartModal.querySelector('.book-container-placeholder')
            const bookContainer = bookContainerPlaceholder.querySelector('.book-container')
            if (bookContainer)
                bookContainerPlaceholder.removeChild(bookContainer)
            addToCartModal.classList.remove('display-none')//do transition or loading..
            const book = await getBook(this.id)
            appendDBBookToContainer(book, bookContainerPlaceholder)
        })
    }
    catch {
        window.location.replace(url)
    }
}

primaryFunc()