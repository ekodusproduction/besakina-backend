import Banner from "./BannerModel.js"

const getBanner = async () => {
    try {
        const data = await Banner.find({});
        return { error: false, data: { message: "Banner list .", statusCode: 200, data: data } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
}

const addBanner = async (requestBody, files) => {
    try {
        requestBody.images = files;
        const banner = new Banner(requestBody);
        const [savedBanner, error] = await banner.save();
        if (error) {
            return { error: true, data: { message: "Error adding banner.", statusCode: 400, data: null } };
        }
        return { error: false, data: { message: "Banner added successfully", statusCode: 200, data: { id: savedBanner._id } } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
}

const editBanner = async (id, body, images) => {
    try {
        body.images = files;
        const banner = Banner.findOneAndUpdate({ _id: id }, body, { new: true });
        if (error) {
            return { error: true, data: { message: "Error editing banner .", statusCode: 400, data: null } };
        }
        return { error: false, data: { message: "Banner edited successfully .", statusCode: 200 } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
}

const deleteBanner = async (id) => {
    try {
        await Banner.deleteOne({ _id: id });
        return { error: false, data: { message: "Banner deleted successfully", statusCode: 200 } };
    } catch (error) {
        console.error(error);
        logger.info(error);
        throw new ApplicationError(error, 500);
    }
}

export default repository = {
    getBanner, addBanner, editBanner, deleteBanner
}