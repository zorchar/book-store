getCart()
    .then((res) => {
        const booksContainer = document.querySelector('#books-container')
        res.forEach(element => {
            appendDBBookToContainer(element.book, booksContainer, element.quantity)
        });
    })
    .then(() => {
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