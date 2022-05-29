document.querySelector('#cart')?.addEventListener('click', async () => {
    user = await authUser()
    if (user.name)
        window.location.replace(url + '/users/' + user.name + '/cart')
    else
        window.location.replace(url + '/cart')
})

document.querySelector('#sign-in')?.addEventListener('click', () => {
    signInModal.classList.remove('display-none')
})

document.querySelector('#sign-up')?.addEventListener('click', () => {
    signUpModal.classList.remove('display-none')
})

document.querySelector('#home-page').addEventListener('click', async () => {
    try {
        sessionStorage.setItem('searchString', '')
        const user = await authUser()
        if (user.name)
            return window.location.replace(url + '/users/' + user.name)
        window.location.replace(url)
    }
    catch (error) {
        console.log(error);
    }
})

const addUserLogoutClickEvent = async () => {
    document.querySelector('#sign-out')?.addEventListener('click', async (event) => {
        try {
            await userLogout()
            window.location.replace(url)
        }
        catch (error) {
            console.log(error);
        }
    })
}

const navBarToSignedIn = async () => {
    document.querySelector('#sign-in')?.remove()
    document.querySelector('#sign-up')?.remove()

    const signOut = document.createElement('div')

    signOut.classList.add('nav-item')
    signOut.id = 'sign-out'
    signOut.innerText = 'Sign Out'

    document.querySelector('#nav-right-items').append(signOut)
    await addUserLogoutClickEvent()
}

const addAddBookButton = () => {
    const addBookButton = document.createElement('div')

    addBookButton.classList.add('nav-item')
    addBookButton.id = 'add-book-button'
    addBookButton.innerText = 'Add Book'

    document.querySelector('#nav-right-items').append(addBookButton)
}

const navBarToSignedOut = async () => {
    document.querySelector('#sign-out')?.remove()

    const signIn = document.createElement('div')
    const signUp = document.createElement('div')

    signIn.classList.add('nav-item')
    signUp.classList.add('nav-item')
    signIn.id = 'sign-in'
    signUp.id = 'sign-up'
    signIn.innerText = 'Sign In'
    signUp.innerText = 'Sign Up'

    const navRightItems = document.querySelector('#nav-right-items')
    navRightItems.insertBefore(signUp, navRightItems.firstChild)
    navRightItems.insertBefore(signIn, navRightItems.firstChild)

    document.querySelector('#sign-in')?.addEventListener('click', () => {
        signInModal.classList.remove('display-none')
    })
    document.querySelector('#sign-up')?.addEventListener('click', () => {
        signUpModal.classList.remove('display-none')
    })
}