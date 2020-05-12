module.exports = {
    IS:function(request, response) {
        return request.user ? true : false
    },
    UI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a> | <a href = "/auth/register">Register</a>'
        if (this.IS(request, response)) {
            delete request.flash()
            authStatusUI = `${request.user.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
} 