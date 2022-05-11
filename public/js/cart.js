getCart()
    .then((res) => {
        navBarToSignedIn()
        const cart = document.querySelector('#books-container')

        res.forEach(element => {
            appendDBBookToContainer(element.book, cart, element.quantity)
        });
    })
    .catch((error) => {
        navBarToSignedOut()
        console.log(error);
    })