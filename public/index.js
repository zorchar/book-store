const url = 'http://localhost:3000'

const signInModal = document.querySelector('#sign-in-modal-container')
const addToCartModal = document.querySelector('#add-to-cart-modal-container')

// const signOutButton = document.querySelector('#sign-out')
// if (signOutButton != null) {
//     document.querySelector('#sign-out').addEventListener('click', () => {
//         userLogout()
//     })
// }

document.querySelector('#add-to-cart-modal-backdrop').addEventListener('click', () => {
    addToCartModal.classList.add('display-none')
})

document.querySelector('#sign-in')?.addEventListener('click', () => {
    signInModal.classList.remove('display-none')
})

document.querySelector('#sign-in-modal-backdrop').addEventListener('click', () => {
    signInModal.classList.add('display-none')
})

document.querySelector('#sign-in-form').addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const email = document.querySelector('#sign-in-email-input').value
        const password = document.querySelector('#sign-in-password-input').value

        res = await userLogin(email, password)
        window.location.replace(url + '/user/' + res.user.name)

        // window.location.replace(url)
        // navBarToSignedIn()
        // signInModal.classList.add('display-none')
    }
    catch (error) {
        console.log(error);
    }
})

document.querySelector('#home-page').addEventListener('click', async (event) => {
    try {
        const user = await authUser()
        window.location.replace(url + '/user/' + user.name)

        // signInModal.classList.add('display-none')
    }
    catch (error) {
        window.location.replace(url)
        console.log(error);
    }
})

document.querySelector('#sign-out')?.addEventListener('click', async (event) => {
    try {
        const user = await userLogout()
        window.location.replace(url)

        // signInModal.classList.add('display-none')
    }
    catch (error) {
        // window.location.replace(url)// should or should not keep?
        console.log(error);
    }
})


const authUser = async () => {
    const response = await fetch(url + '/user/auth_user',
        {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
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

const userLogin = async (email, password) => {
    try {
        const response = await fetch(url + '/user/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        email,
                        password
                    }
                )
            })
        const res = await response.json()
        if (!response.ok) { //// fetch does not handle errors. must check response.ok
            throw res
        }
        localStorage.setItem('token', res.token)
        return res
    }
    catch (error) {
        console.log('got to catch in userLogin');
        throw error
    }
}

const addToCart = async (bookName) => {
    try {
        const response = await fetch(url + '/user/add_to_cart',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(
                    {
                        bookName
                    }
                )
            })
        const res = await response.json()
        if (!response.ok) { //// fetch does not handle errors. must check response.ok
            throw res
        }
        return res
    }
    catch (error) {
        console.log('got to catch in userLogin');
        throw error
    }
}

const userLogout = async () => {
    try {
        const response = await fetch(url + '/user/logout',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
        localStorage.setItem('token', null)//maybe change location or add in another location or add verification with database
        /////// currently no response sent here
        // const res = await response.json() 
        // if (!response.ok) {
        //     throw res
        // }
        // return res
    }
    catch (error) {
        console.log('got to catch in userLogout');
        throw error
    }

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

const addClickEventToQueryAll = (queryAllText, callback) => {
    const bookContainers = document.querySelectorAll(queryAllText)
    for (let el of bookContainers)
        el.addEventListener('click', callback)
}

const primaryFunc = async () => {
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

primaryFunc()

const navBarToSignedIn = () => {
    document.querySelector('#sign-in').remove()
    document.querySelector('#sign-up').remove()

    const signOut = document.createElement('div')

    signOut.classList.add('nav-item')
    signOut.id = 'sign-out'
    signOut.innerText = 'Sign Out'

    document.querySelector('#nav-right-items').append(signOut)
}

const navBarToSignedOut = () => {
    document.querySelector('#sign-out').remove()

    const signIn = document.createElement('div')
    const signUp = document.createElement('div')

    signIn.classList.add('nav-item')
    signUp.classList.add('nav-item')
    signIn.id = 'sign-in'
    signUp.id = 'sign-up'
    signIn.innerText = 'Sign In'
    signUp.innerText = 'Sign Up'

    const navRightItems = document.querySelector('#nav-right-items')
    navRightItems.insertBefore(signUp, navRightItems.firstChild)
    navRightItems.insertBefore(signIn, navRightItems.firstChild)

}