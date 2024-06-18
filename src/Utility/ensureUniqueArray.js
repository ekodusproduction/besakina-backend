const ensureUniqueArray = async (id, Model, fieldname) => {
    const user = await Model.findById(id);
    const modelName = Model.modelName;

    if (!user) {
        throw new ApplicationError(`${modelName} not found`, 404);
    }

    const uniqueArray = [...new Set(user[fieldname].map(item => item.toString()))];
    user[fieldname] = uniqueArray;
    await user.save();

    return user;
};
