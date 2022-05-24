const authUser = async () => {
    const response = await fetch(url + '/users/auth-user',
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

const authAdmin = async () => {
    const response = await fetch(url + '/admins/auth',
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

//maybe change location///////////////////
const addClickEventToQueryAll = (queryAllText, callback) => {
    const bookContainers = document.querySelectorAll(queryAllText)
    for (let el of bookContainers)
        el.addEventListener('click', callback)
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
//////////////////////////