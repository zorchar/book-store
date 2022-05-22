const primaryFunc = async () => {
    redirectIfNeeded()
    foundBooks = await findBooks(bookSearchInput.value)
    searchRender(0)
}

const redirectIfNeeded = async () => {
    try {
        if (window.location.href !== url + '/') {
            const user = await authUser()
            if (user !== 'no authentication') {
                document.querySelector('#admin-page').remove()
            }
            const substringAfterUser = window.location.href.substring(url.length + '/users/'.length)
            if (user.name !== substringAfterUser)
                window.location.replace(url)
            navBarToSignedIn()
        }
        else {
            const user = await authUser()
            if (user.name)
                window.location.replace(url + '/users/' + user.name)
            navBarToSignedOut()
        }
    }
    catch (error) {
        if (error.error != 'no authentication')
            window.location.replace(url)
    }
}
primaryFunc()