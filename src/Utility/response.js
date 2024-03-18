export const sendResponse = (res, message, http_status_code, data = null, token = null) => {
    return res.sendStatus(http_status_code).send({
        "message": message,
        "http_status_code": http_status_code,
        "success": true,
        "data": data,
        "token": token
    });
};


export const sendError = (res, message, http_status_code, data) => {
    return res.sendStatus(http_status_code).send({
        "message": message,
        "http_status_code": http_status_code,
        "success": false,
        "data": data || null,
        "token": null
    })
}