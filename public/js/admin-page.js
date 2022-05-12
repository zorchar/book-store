authAdmin()
    .then(() => {
        navBarToSignedIn()
        document.querySelector('#cart')?.remove()
        document.querySelector('#sign-out')?.addEventListener('click', async (event) => {
            try {
                await userLogout()
                window.location.replace(url)
            }
            catch (error) {
                console.log(error);
            }
        })
    })
    .catch(() => {
        navBarToSignedOut()
    })

renderAllBooksOnPage()

const deleteBook = async (bookName) => {
    const response = await fetch(url + '/book/delete',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            },
            body: JSON.stringify({
                name: bookName
            })
        })
    const res = await response.json()
    if (!response.ok) return console.log(res)
    console.log(res);
    return res
}


document.querySelector('#delete-book').addEventListener('submit', async (event) => {
    event.preventDefault()
    const bookName = document.querySelector('.book-container-placeholder').querySelector('.book-container').id
    console.log(bookName);

    await deleteBook(bookName)
})

// const addAdmin = async (admin) => {
//     const response = await fetch(url + '/admin/add_admin',
//         {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(admin
//                 // {
//                 //     name: 'admin13',
//                 //     email: 'asdfghjaf@gmail.com',
//                 //     password: 'password'
//                 // }
//             )
//         })
//     const res = await response.json()
//     if (!response.ok) return console.log(res)
//     console.log(res);
//     return res
// }

// const deleteAdmin = async (email, token) => {
//     const response = await fetch(url + '/admin/delete_admin',
//         {
//             method: 'DELETE',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`
//             },
//             body: JSON.stringify({ email })
//         })
//     const res = await response.json()
//     if (!response.ok) return console.log(res)
//     return res.message
// }