const fetchData = (setFiles) => {
    /* update this to do it dynamically later */
    let files = [{path: '/data/dev-images/stussyhoodie.jpg', label: 'Stussy Hoodie'}, 
        {path: '/data/dev-images/stussybeanie.jpg', label: 'Stussy Beanie'}, 
        {path: '/data/dev-images/stussyjeans.jpg', label: 'Stussy Jeans'}, 
        {path: '/data/dev-images/stussytee.jpg', label: 'Stussy Tee'}]

    setFiles(files)
}

export {fetchData};