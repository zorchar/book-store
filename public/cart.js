const url = 'http://localhost:3000'

document.querySelector('#sign-in-form').addEventListener('submit', (event) => {
    event.preventDefault()
    showCart()
        .then((res) => {
            console.log('this is res');
            console.log(res)// need to render cart instead of console.log
            console.log(res[0])
            console.log(res[1])
            const cart = document.querySelector('#cart')

            res.forEach(element => {
                appendDBBookToContainer(element.book, cart)
            });


        })
        .catch((error) => {
            console.log('event listener error');
            console.log(error);
        })
})

const addToCart = async () => {
    try {
        const response = await fetch(url + '/user/add_to_cart',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(
                    {
                        bookID: '62712e6005cb220b129e2b4f'
                    }
                )
            })
        const res = await response.json()
        if (!response.ok) { //// fetch does not handle errors. must check response.ok
            console.log('got to !response.ok');
            throw res
        }
        return res
    }
    catch (error) {
        console.log('got to catch in addToCart');
        throw error
    }
}

const showCart = async () => {
    try {
        const response = await fetch(url + '/user/cart',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
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
        console.log('got to catch in showCart');
        throw error
    }
}