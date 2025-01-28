// Create web server
// Load the comments from comments.json
// Serve comments on /comments
// Add a new comment on POST /comments

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/comments' && req.method === 'GET') {
        fs.readFile('comments.json', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(data);
            }
        });
    } else if (req.url === '/comments' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk;
        });
        req.on('end', () => {
            let comments = [];
            try {
                comments = JSON.parse(fs.readFileSync('comments.json', 'utf8'));
            } catch (err) {
                // Do nothing
            }
            let newComment = JSON.parse(body);
            comments.push(newComment);
            fs.writeFile('comments.json', JSON.stringify(comments), err => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(201, { 'Content-Type': 'text/plain' });
                    res.end('Comment added');
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});  