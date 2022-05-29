const addBookToGenCart = async (bookName) => {
    try {
        const book = await getBook(bookName)
        let cart = []
        if (sessionStorage.getItem('cart') && sessionStorage.getItem('cart') !== 'null') {
            cart = sessionStorage.getItem('cart')
            cart = JSON.parse(cart)
        }
        let isExists = false
        cart.forEach((el) => {
            if (el?.book?.name == book.name) {
                el.quantity++
                isExists = true
            }
        })
        if (!isExists)
            cart.push({ book: book, quantity: 1 })
        cart = JSON.stringify(cart)
        sessionStorage.setItem('cart', cart)
        alert('book added to cart')
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
            return addBookToGenCart(bookName)
        }
        user = await authUser()
        alert('book added to cart')
    }
    catch (error) {
        console.log('got to catch in addToCart');
        console.log((error));
        throw error
    }
}

const getCart = async () => {
    try {
        document.querySelector('#total-price').innerText = ''
        const response = await fetch(url + '/users/send-cart',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        const res = await response.json()
        if (res === 'no authentication') {
            return JSON.parse(sessionStorage.getItem('cart'))
        }
        return res
    }
    catch (error) {
        console.log(error);
    }
}

const emptyCart = async () => {
    try {
        const response = await fetch(url + '/users/empty-cart',
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                }
            })
        const res = await response.json()
        if (res === 'no authentication') {
            sessionStorage.setItem('cart', null)
        }
        window.location.replace(window.location.href)
    }
    catch (error) {
        console.log(error);
    }
}