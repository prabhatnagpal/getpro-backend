module.exports.userLogout = async (req, res) => {
    res.clearCookie('userLoginToken');
    res.status(200).json({
        message: "successfully logout"
    })
}