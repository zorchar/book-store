const primaryFunc = async () => {
    const admin = await authAdmin()
    if (admin.name)
        window.location.replace(url + '/admins/' + admin.name)
}

primaryFunc()
    .then(() => {
    })