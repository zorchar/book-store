const addAdmin = async (admin) => {
    const response = await fetch(url + '/admin/add_admin',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(admin
                // {
                //     name: 'admin13',
                //     email: 'asdfghjaf@gmail.com',
                //     password: 'password'
                // }
            )
        })
    const res = await response.json()
    if (!response.ok) return console.log(res)
    console.log(res);
    return res
}

const deleteAdmin = async (email, token) => {
    const response = await fetch(url + '/admin/delete_admin',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        })
    const res = await response.json()
    if (!response.ok) return console.log(res)
    return res.message
}
