const updateUserCart = async (cartInObjectForm) => {
    const response = await fetch(url + '/users/me',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(cartInObjectForm)
        })
    const res = await response.json()
    return res
}

getCart()
    .then((res) => {
        const booksContainer = document.querySelector('#books-container')
        res.forEach(element => {
            appendDBBookToContainer(element.book, booksContainer, element.quantity)
        });
        addClickEventToQueryAll('.book-container', async function () {
            putBookInModal(this)
        })

    })
    .catch((error) => {
        console.log(error);
    })

authUser()
    .then((res) => {
        if (res !== 'no authentication') {
            navBarToSignedIn()
            document.querySelector('#admin-page')?.remove()
            addUserLogoutClickEvent().then()
        }
        else {
            navBarToSignedOut()
            document.querySelector('#sign-in')?.addEventListener('click', () => {
                signInModal.classList.remove('display-none')
            })
            document.querySelector('#sign-up')?.addEventListener('click', () => {
                signUpModal.classList.remove('display-none')
            })
        }
    })
    .catch((err) => {
        console.log(err);
    })