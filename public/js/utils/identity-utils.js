const url = 'http://localhost:3000'

const userLogout = async () => {
    try {
        await fetch(url + '/users/logout',
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
        const response = await fetch(url + '/users/new',
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
        if (!response.ok) {
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
        const response = await fetch(url + '/users/login',
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

        const response = await fetch(url + '/admins/login',
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
        console.log('here');

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