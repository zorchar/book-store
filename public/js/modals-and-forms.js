const signInModal = document.querySelector('#sign-in-modal-container')
const signUpModal = document.querySelector('#sign-up-modal-container')
const signInAdminModal = document.querySelector('#sign-in-admin-modal-container')
const addToCartModal = document.querySelector('#add-to-cart-modal-container')

document.querySelector('#add-to-cart-modal-backdrop')?.addEventListener('click', () => {
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
        window.location.replace(url + '/user/' + res.user.name)
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
        window.location.replace(url + '/user/' + res.user.name)
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
        window.location.replace(url + '/admin/' + res.admin.name)
    }
    catch (error) {
        signInModal.classList.add('display-none')
    }
})

document.querySelector('#add-to-cart-form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    addToCartModal.classList.add('display-none')
    addToCart(addToCartModal.querySelector('.book-container').name)///////////////////// keep on
        .then(() => {
            console.log('book added');
        })
        .catch((error) => {
            console.log(error);
        })
})