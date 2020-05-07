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
                    <a href = "/MySQL/authors">authors</a>
                    ${control}
                    ${body}
                </body>
                </html>`;
    },
    
    authorSelect : (authors, author_id) => {
        let tag='';
        for(let i =0; i < authors.length; i++)
        {
            let check = '';
            if(authors[i].id === author_id) check = ' selected';
            tag += `<option value = "${authors[i].id}"${check}>${authors[i].name}</option>`
        }
        return `<select name = author>
                ${tag}
                </select>`;
    },
    authorTable : (authors) => {
        let tag = '';
        for(let i = 0; i < authors.length; i++)
        {
            tag += `<tr>
                        <td>${authors[i].name}</td>
                        <td>${authors[i].profile}</td>
                        <td><a href="/MySQL/authors/update?id=${authors[i].id}">update</a></td>
                        <td>delete</td>
                    </tr>`
        }
        return `<table id = "authortable">
                    ${tag}
                </table>`
    }
}
    