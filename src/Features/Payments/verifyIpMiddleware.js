const allowedIps = [
    '52.140.8.88',
    '3.7.89.1',
    '180.179.174.1',
    '3.7.89.2',
    '180.179.174.2',
    '3.7.89.3',
    '180.179.165.250',
    '3.7.89.8',
    '52.140.8.64',
    '3.7.89.9',
    '10.251.7.118',
    '3.7.89.10',
    '52.140.8.65',
    '52.140.8.89'
];

export const verifyIp = async function (req, res, next) {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if (allowedIps.includes(clientIp)) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: IP not allowed' });
    }
}

export default verifyRequestOrigin = async function (req, res, next) {
    const origin = req.headers.origin;
    const allowedOrigins = ['https://test.payu.in', "https://secure.payu.in"];

    if (allowedOrigins.includes(origin)) {
        next();
    } else {
        res.status(403).json({ error: 'Forbidden: Invalid origin' });
    }
}