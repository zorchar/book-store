const authUser = async () => {
    const response = await fetch(url + '/user/auth_user',
        {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        }
    )
    const res = await response.json()
    if (!response.ok) {
        console.log('response !ok. res: ' + res);
        throw res
    }

    return res
}

const authAdmin = async () => {
    const response = await fetch(url + '/admin/auth_admin',
        {
            method: 'Get',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
        }
    )
    const res = await response.json()
    if (!response.ok) {
        throw res
    }
    return res
}