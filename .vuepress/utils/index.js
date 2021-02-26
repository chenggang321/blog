const path = require('path')
const fs = require('fs')

// 根据目录结构生成配置
function autoGenSideBarConfig(dirPath) {
    const {childDir} = getDirChild(dirPath)
    let config = [];
    childDir.forEach(dir => {
        const children = [];
        const {childFiles} = getDirChild(`${dirPath}/${dir}`)
        childFiles.forEach(files => children.push(`${dir}/${files}`))
        if(childFiles.length){
            config.push({
                title: dir,
                children: children
            })
        }
    })

    return config
}

function getDirChild(dirPath) {
    let childDir = [];
    let childFiles = [];
    fs.readdirSync(dirPath).forEach(function (item) {
        const stat = fs.lstatSync(`${dirPath}/${item}`)
        if (stat.isDirectory()) {
            childDir.push(item)
        } else {
            childFiles.push(item)
        }
    })

    return {
        childDir,
        childFiles
    }
}

// const targetPath = path.join(__dirname, '../../note');
// console.log(autoGenSideBarConfig(targetPath))

module.exports = {
    autoGenSideBarConfig
}

