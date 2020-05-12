module.exports ={
    List : filelist => {
        let list = "<ul>";
        for(let i=0; i<filelist.length; i++)
        {
            list = list + `<li><a href = "/topic/${filelist[i].id}">${filelist[i].title}</a></li>`
        }
        list = list + "</ul>";
        return list;
    },
    HTML : (title,UI, list, control, body) => {
        return `<!doctype html>
                <html>
                <head>
                    <meta charset = "utf-8">
                    <title>${title} page</title>
                    <style>
                    a{                      
                      text-decoration : none;
                    }
                    </style>
                <head>
    
                <body>
                    ${UI}
                    <h1><a href = '/'>WEB</a></h1>
                    ${list}
                    ${control}
                    ${body}
                </body>
                </html>`;
    }}
    