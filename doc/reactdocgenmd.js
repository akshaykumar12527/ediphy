const path = require('path');
const fs = require('fs');
const reactDocgen = require('react-docgen');
// const ReactDocGenMarkdownRenderer = require('react-docgen-markdown-renderer');
const generateMarkdown = require('./generateMarkdown');

let editorPath = (path.join('.', '_editor/components'));
let visorPath = (path.join('.', '_visor/components'));
let files = [];

function genDoc(componentPath) {
    fs.readFile(componentPath, (error, content) => {
        const documentationPath = path.join('doc/files', path.basename(componentPath, path.extname(componentPath)) + '.md');
        const doc = reactDocgen.parse(content);
        fs.writeFile(documentationPath, generateMarkdown(
            /* The path to the component, used for linking to the file. */
            componentPath,
            /* The actual react-docgen AST */
            doc,
            /* Array of component ASTs that this component composes*/
            []));
    });
}

function getFiles(filePath) {
    fs.readdirSync(filePath).forEach(function(file) {
        if (file) {
            let subpath = filePath + '/' + file;

            if(fs.lstatSync(subpath).isDirectory()) {
                getFiles(subpath);
            } else if (path.extname(file) && path.extname(file) === '.jsx') {
                files.push(path.basename(file, path.extname(file)));
                genDoc(filePath + '/' + file);
            }
        }
    });
}

function writeModuleFile(modPath) {
    /* let content = '[';
    files.map(file=>{content += '\n' + file +','}) ;
    content = content.substring(0, content.length - 1) + '\n]';
    console.log(content)*/
    let content = "";
    files.map(file=>{
        content += "export * as " + file + " from './files/" + file + ".md';\n";// export " + file + ';\n';
    });

    fs.writeFile(modPath, content);
}
for(lang in lan)
{console.log('\nREACT-DOCGEN\n');}
console.log('Generating component props documentation for Editor');
getFiles(editorPath);
console.log('Generating component props documentation for Visor');
getFiles(visorPath);
writeModuleFile('./doc/importMdFiles.es6');
console.log('\n\n\n');

