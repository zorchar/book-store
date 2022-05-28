const primaryFunc = async () => {
    redirectIfNeeded()
    addClickEventToQueryAll('.book-container', async function () {
        window.location.replace(url + '/books/' + this.id)
    })
}

const redirectIfNeeded = async () => {
    try {
        const user = await authUser()
        const currentUrl = window.location.href
        if (currentUrl !== url + '/' && !currentUrl.includes('?')) {
            const substringAfterUser = window.location.href.substring(url.length + '/users/'.length)
            if (user.name !== substringAfterUser)
                window.location.replace(url)
            navBarToSignedIn()
        }
        else {
            if (user.name && !currentUrl.includes('?'))
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