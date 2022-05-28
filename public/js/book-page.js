const getBookByUrl = async () => {
    const bookName = window.location.href.slice(url.length + '/books/'.length).replace('%20', ' ')
    const response = await fetch(url + '/books/' + bookName,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Is-Fetch': `true`
            },
        })
    const res = await response.json()
    return res
}

const primaryFunc = async () => {
    book = await getBookByUrl()
    appendDBBookToContainer(book, document.querySelector('#books-container'))
    addDescriptionToContainer(book.description, document.querySelector('#books-container'))

    const user = await authUser()
    if (user.name)
        return navBarToSignedIn()
    navBarToSignedOut()
}

primaryFunc().
    then()
