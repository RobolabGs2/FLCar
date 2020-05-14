export function extractImageData(img: ImageBitmap): ImageData {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.height = img.height;
    tmpCanvas.width = img.width;
    const ctx = tmpCanvas.getContext("2d");
    if (!ctx) {
        throw "Не получилось получить невидимый контекст невиданного канваса"
    }
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height)
}

export function downloadBitmap(path: String): Promise<ImageBitmap> {
    return new Promise<ImageBitmap>((resolve, reject) => {
        let img = new Image();
        img.onload = () => {
            resolve(createImageBitmap(img))
        };
        img.onerror = reject;
        img.src = "./resources/" + path;
    });
}