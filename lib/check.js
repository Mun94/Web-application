module.exports = {
    IS:function(request, response) {
        return request.session.is_logined ? true : false
    },
    UI:function(request, response) {
        var authStatusUI = '<a href="/auth/login">login</a>'
        if (this.IS(request, response)) {
            authStatusUI = `${request.session.nickname} | <a href="/auth/logout">logout</a>`;
        }
        return authStatusUI;
    }
} 