const path = require('path');
const fs = require('fs');


const uploadSingleFileImage = async (fileObject) => {
    //Đường dẫn thư mục lưu trữ ảnh
    let uploadPath = path.resolve(__dirname, "../public/images");

    //Lấy đuôi mở rộng (jpg)
    let extName = path.extname(fileObject.name);

    //Lấy tên ảnh (avatar)
    let baseName = path.basename(fileObject.name, extName)

    let finalName = `${baseName}-${Date.now()}${extName}`;
    let finalPath = `${uploadPath}/${finalName}`;

    try {
        await fileObject.mv(finalPath);
        return {
            errMsg: "Success",
            path: finalName,
            error: null
        }
    } catch (error) {
        return {
            status: 'failed',
            path: null,
            error: JSON.stringify(error)
        }
    }
}


// Hàm xóa ảnh
const deleteImage = async (imagePath) => {
    try {
        // Xóa ảnh từ đường dẫn
        await fs.promises.unlink(imagePath);
    } catch (error) {
        console.log('Error deleting image: ', imagePath, error);
    }
}

module.exports = { uploadSingleFileImage, deleteImage }

