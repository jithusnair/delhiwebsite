const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.join(__dirname, '__sapper__/build')

function copyFolderSync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to)
  }
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element))
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element))
    }
  })
}

function buildPackageJson() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json')).toString())
  const buildPackageJson = {
    name: packageJson.name,
    dependencies: packageJson.dependencies,
    scripts: {
      start: 'node .'
    }
  }
  fs.writeFileSync(path.join(BUILD_DIR, 'package.json'), JSON.stringify(buildPackageJson, null, 2))
}

function copyStatic() {
  copyFolderSync(path.join(__dirname, 'static'), path.join(BUILD_DIR, 'static'))
}

function hackBuildDir() {
  const serverPath = path.join(BUILD_DIR, 'server/server.js')
  let serverText = fs.readFileSync(serverPath).toString()
  serverText = serverText.replace('__sapper__/build', '.')
  fs.writeFileSync(serverPath, serverText)
}

buildPackageJson()
copyStatic()
hackBuildDir()