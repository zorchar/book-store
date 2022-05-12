const url = 'http://localhost:3000'

document.querySelector('#cart')?.addEventListener('click', () => {
    window.location.replace(url + '/user/cart')
})

document.querySelector('#sign-in')?.addEventListener('click', () => {
    signInModal.classList.remove('display-none')
})

document.querySelector('#sign-up')?.addEventListener('click', () => {
    signUpModal.classList.remove('display-none')
})

document.querySelector('#home-page').addEventListener('click', async (event) => {
    try {
        const user = await authUser()
        if (user.name)
            return window.location.replace(url + '/user/' + user.name)
        window.location.replace(url)
    }
    catch (error) {
        console.log(error);
    }
})

document.querySelector('#sign-out')?.addEventListener('click', async (event) => {
    try {
        await userLogout()
        window.location.replace(url)
    }
    catch (error) {
        console.log(error);
    }
})

document.querySelector('#admin-page').addEventListener('click', () => {
    document.querySelector('#sign-in-admin-modal-container')?.classList.remove('display-none')
})

const userLogout = async () => {
    try {
        const response = await fetch(url + '/user/logout',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
            })
        sessionStorage.setItem('token', null)
    }
    catch (error) {
        console.log('got to catch in userLogout');
        throw error
    }
}

const userSignUp = async (name, email, password) => {
    try {
        const response = await fetch(url + '/user/new',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        name,
                        email,
                        password
                    }
                )
            })
        const res = await response.json()
        if (!response.ok) { //// fetch does not handle errors. must check response.ok
            throw res
        }
        sessionStorage.setItem('token', res.token)
        return res
    }
    catch (error) {
        console.log('got to catch in userSignUp');
        throw error
    }
}

const userLogin = async (email, password) => {
    try {
        const response = await fetch(url + '/user/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        email,
                        password
                    }
                )
            })
        const res = await response.json()
        if (!response.ok) {
            throw res
        }
        sessionStorage.setItem('token', res.token)
        return res
    }
    catch (error) {
        console.log('got to catch in userLogin');
        throw error
    }
}

const adminLogin = async (email, password) => {
    try {
        const response = await fetch(url + '/admin/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        email,
                        password
                    }
                )
            })
        const res = await response.json()
        if (!response.ok) {
            throw res
        }
        sessionStorage.setItem('token', res.token)
        return res
    }
    catch (error) {
        console.log('got to catch in adminLogin');
        throw error
    }
}

const navBarToSignedIn = () => {
    document.querySelector('#sign-in')?.remove()
    document.querySelector('#sign-up')?.remove()
    document.querySelector('#admin-page')?.remove()

    const signOut = document.createElement('div')

    signOut.classList.add('nav-item')
    signOut.id = 'sign-out'
    signOut.innerText = 'Sign Out'

    document.querySelector('#nav-right-items').append(signOut)
}

const navBarToSignedOut = () => {
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
}