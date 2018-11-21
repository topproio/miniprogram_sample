// @TODO 创建新功能

const fs = require('fs');

fs.exists('./src', function(exist) {
    if (!exist) {
        console.error('src not exist!');
    } else {
        createPage();
    }
});

function buildTargetDocument(pageName) {
    return [
        {
            name: `${pageName}.json`,
            content: '{}',
        },
        {
            name: `${pageName}.html`,
            content: '<view>Hello World</view>',
        },
        {
            name: `${pageName}.scss`,
            content: '/** style **/',
        },
        {
            name: `${pageName}.js`,
            content: 'Page({});',
        }
    ];
}

function createPage() {
    const pageName = process.argv[2];

    if (!pageName) {
        console.error('error: enter page name!');
        return;
    }

    const pagePath = `pages/${pageName}`;
    const createPagePath = `src/${pagePath}`;

    fs.exists(createPagePath, function(exists) {
        if (exists) {
            console.error('folder exists!');
        } else {
            fs.mkdirSync(createPagePath);
            const TARGET_DOCUMENT = buildTargetDocument(pageName);
            TARGET_DOCUMENT.forEach(function(item) {
                const writable = fs.createWriteStream(`${createPagePath}/${item.name}`);

                writable.on('finish', function() {
                    console.log(`write ${item.name} finished`);
                });

                writable.on('error', function(error) {
                    console.error(`write ${item.name} fail: ${error.message}`);
                });

                writable.write(item.content, 'utf8');
                writable.end();
            });

            signPagePath(`${pagePath}/${pageName}`);
        }
    });
}

function signPagePath(pagePath) {
    fs.readFile('src/app.json', function(err, data) {
        if (err) console.error(err);
        const appJSON = JSON.parse(data.toString());
        appJSON.pages.push(pagePath);
        fs.writeFile('src/app.json', JSON.stringify(appJSON, null, 2), function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log('sign page success');
            }
        });
    });
}
