const signout = (req, res, next) => {
    res.clearCookie('id_token', { httpOnly: true, secure: false, sameSite: 'Lax' });
    res.clearCookie('access_token', { httpOnly: true, secure: false, sameSite: 'Lax' });
    res.clearCookie('refresh_token', { httpOnly: true, secure: false, sameSite: 'Lax' });
    
    console.log('Cookies Cleared');
    next();
};

module.exports = {
    signout,
};