module.exports ={
    List : topics => {
        let list = "<ul>";
        for(let i=0; i<topics.length; i++)
        {
            list = list + `<li><a href = "/MySQL?id=${topics[i].id}">${topics[i].title}</a></li>`
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
    