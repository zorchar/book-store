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
            if (el.book.name == book.name) {
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
        const response = await fetch(url + '/user/add-to-cart',
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
        if (!response.ok) { //// fetch does not handle errors. must check response.ok
            if (res.error === 'no authentication') {
                addBookToGenCart(bookName)
            }
            else throw res
        }
        return res
    }
    catch (error) {
        console.log('got to catch in addToCart');
        console.log((error));
        throw error
    }
}

const getCart = async () => {
    try {
        const response = await fetch(url + '/user/get-cart',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })

        const res = await response.json()
        if (!response.ok) { //// fetch does not handle errors. must check response.ok
            console.log('got to !response.ok');
            throw res
        }
        return res
    }
    catch (error) {
        return JSON.parse(sessionStorage.getItem('cart'))
    }
}