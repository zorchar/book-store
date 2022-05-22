const addBookToGenCart = async (bookName) => {
    try {
        const book = await getBook(bookName)
        let cart = []
        if (sessionStorage.getItem('cart')) {
            cart = sessionStorage.getItem('cart')
            cart = JSON.parse(cart)
        }
        let isExists = false
        cart.forEach((el) => {
            if (el.book?.name == book.name) {
                el.quantity++
                isExists = true
            }
        })

        if (!isExists)
            cart.push({ book, quantity: 1 })
        cart = JSON.stringify(cart)
        sessionStorage.setItem('cart', cart)
    }
    catch (error) {
        return error
    }
}

const addToCart = async (bookName) => {
    try {
        const response = await fetch(url + '/users/add-to-cart',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: JSON.stringify(
                    {
                        bookName
                    }
                )
            })
        const res = await response.json()
        if (res === 'no authentication') {
            addBookToGenCart(bookName)
        }
    }
    catch (error) {
        console.log('got to catch in addToCart');
        console.log((error));
        throw error
    }
}

const getCart = async () => {
    try {
        const response = await fetch(url + '/users/send-cart',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        const res = await response.json()
        if (res === 'no authentication') { //// fetch does not handle errors. must check response.ok
            return JSON.parse(sessionStorage.getItem('cart'))
        }
        return res
    }
    catch (error) {
        console.log(error);
    }
}