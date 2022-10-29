exports.getImages = (req, res) => {
    const name =  req.params.id;
    const path = process.cwd() + "/src/images";
    const image = path + `/${name}.png`;
    res.sendFile(image)
}

