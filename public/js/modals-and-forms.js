const signInModal = document.querySelector('#sign-in-modal-container')
const signUpModal = document.querySelector('#sign-up-modal-container')
const signInAdminModal = document.querySelector('#sign-in-admin-modal-container')
const addToCartModal = document.querySelector('#add-to-cart-modal-container')

document.querySelector('#add-to-cart-modal-backdrop')?.addEventListener('click', () => {
    document.querySelector('#add-to-cart-modal-container').querySelector('.message-container').innerText = ""
    addToCartModal.classList.add('display-none')
})

document.querySelector('#sign-in-modal-backdrop')?.addEventListener('click', () => {
    signInModal.classList.add('display-none')
})

document.querySelector('#sign-up-modal-backdrop')?.addEventListener('click', () => {
    signUpModal.classList.add('display-none')
})

document.querySelector('#sign-in-admin-modal-backdrop')?.addEventListener('click', () => {
    signInAdminModal.classList.add('display-none')
})

document.querySelector('#sign-in-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const email = document.querySelector('#sign-in-email-input').value
        const password = document.querySelector('#sign-in-password-input').value

        res = await userLogin(email, password)
        window.location.replace(url + '/users/' + res.user.name)
    }
    catch (error) {
        document.querySelector('#sign-in-modal-container').classList.add('display-none')
    }
})

document.querySelector('#sign-up-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const name = document.querySelector('#sign-up-name-input').value
        const email = document.querySelector('#sign-up-email-input').value
        const password = document.querySelector('#sign-up-password-input').value

        res = await userSignUp(name, email, password)
        window.location.replace(url + '/users/' + res.user.name)
    }
    catch (error) {
        document.querySelector('#sign-up-modal-container').classList.add('display-none')
    }
})

document.querySelector('#sign-in-admin-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    try {
        const email = document.querySelector('#sign-in-admin-email-input').value
        const password = document.querySelector('#sign-in-admin-password-input').value

        res = await adminLogin(email, password)
        window.location.replace(url + '/admins/' + res.admin.name)
    }
    catch (error) {
        signInModal?.classList.add('display-none')
    }
})

document.querySelector('#add-to-cart-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    addToCartModal.classList.add('display-none')
    addToCart(addToCartModal.querySelector('.book-container').name)
        .then(() => {
            console.log('book added');
        })
        .catch((error) => {
            console.log(error);
        })
})

document.querySelector('#view-cart-form')?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const bookName = addToCartModal.querySelector('.book-container').id
    const newQuantityString = addToCartModal.querySelector('#change-quantity-input').value

    if (newQuantityString < 1) {
        return document.querySelector('#add-to-cart-modal-container').querySelector('.message-container').innerText = 'invalid quantity'
    }

    let cart = await getCart()
    for (let book of cart) {
        if (book.book?.name === bookName)
            book.quantity = parseInt(newQuantityString)
    }

    await updateUserCart({ cart })

    addToCartModal.classList.add('display-none')
    cart = JSON.stringify(cart)
    sessionStorage.setItem('cart', cart)

    user = await authUser()
    if (user.name)
        window.location.replace(url + '/users/' + user.name + '/cart')
    else
        window.location.replace(url + '/cart')
})