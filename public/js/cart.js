const editUser = async (fieldsToChangeInObjectForm) => {
    const response = await fetch(url + '/user/me',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify(fieldsToChangeInObjectForm)
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
    .then(() => {
    })
    .catch((error) => {
        console.log(error);
    })

authUser()
    .then((res) => {
        if (res !== 'no authentication') {
            navBarToSignedIn()
            document.querySelector('#admin-page')?.remove()
            document.querySelector('#sign-out')?.addEventListener('click', async (event) => {
                try {
                    const user = await userLogout()
                    window.location.replace(url)
                }
                catch (error) {
                    console.log(error);
                }
            })
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