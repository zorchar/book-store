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
        let totalPrice = 0
        if (res) {
            res.forEach(element => {
                appendDBBookToContainer(element.book, booksContainer, element.quantity)
                if (element?.book)
                    totalPrice += element?.book?.price * element?.quantity
            });
            addClickEventToQueryAll('.book-container', async function () {
                putBookInModal(this)
            })
            if (totalPrice === 0) {
                document.querySelector('#checkout-button').classList.add('display-none')
                return document.querySelector('#total-price').innerText = 'No books in cart!'
            }
            document.querySelector('#checkout-button').classList.remove('display-none')
            document.querySelector('#total-price').innerText = 'Total price: ' + totalPrice
        }
    })
    .catch((error) => {
        console.log(error);
    })

authUser()
    .then((res) => {
        if (res !== 'no authentication') {
            navBarToSignedIn()
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

document.querySelector('#checkout').addEventListener('submit', async (event) => {
    event.preventDefault()
    alert('Bought books!')
    await emptyCart()
})