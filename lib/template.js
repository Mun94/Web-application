module.exports ={
    List : filelist => {
        let list = "<ul>";
        for(let i=0; i<filelist.length; i++)
        {
            list = list + `<li><a href = "/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list = list + "</ul>";
        return list;
    },
    HTML : (title, list, control, body) => {
        return `<!doctype html>
                <html>
                <head>
                    <meta charset = "utf-8">
                    <title>${title} page</title>
                <head>
    
                <body>
                    <h1><a href = '/'>WEB</a></h1>
                    ${list}
                    ${control}
                    ${body}
                </body>
                </html>`;
    }}
    