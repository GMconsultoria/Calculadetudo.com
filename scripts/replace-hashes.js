const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk(__dirname + '/../').filter(f => f.endsWith('.js') || f.endsWith('.html'));

files.forEach(file => {
    if (file.includes('node_modules') || file.includes('.git') || file.includes('dist')) return;
    
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('href="/')) {
        content = content.replace(/href="#\//g, 'href="/');
        changed = true;
    }
    
    if (content.includes("href='/")) {
        content = content.replace(/href='#\//g, "href='/");
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content);
        console.log('Updated ' + file);
    }
});
console.log('Replacement complete.');
