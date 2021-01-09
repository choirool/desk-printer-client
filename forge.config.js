const path = require('path')
const { version } = require('./package.json')
const { platform, arch } = process

module.exports = {
  make_targets: {
    win32: [
      'squirrel',
      'zip'
    ],
    'darwin': [
      'zip'
    ],
    'linux': [
      'deb',
      // 'rpm',
      'zip'
    ]
  },
  electronPackagerConfig: {
    asar: true,
    ignore: [
      '^/\\.',
      '^/[\\w\\.]+\\.log$',
      '^/node_modules/uws',
      '^/node_modules/\\.cache'
    ],
    appCopyright : 'Copyright (C) 2020 Choirool.',
    icon         : 'src/assets/icons/mac/icon.icns',
    // win32metadata: {
    //   CompanyName     : 'Choirool',
    //   FileDescription : '',
    //   InternalName    : '',
    //   ProductName     : '',
    //   OriginalFilename: 'xxx.exe',
    // },
    download: {
      cache: 'node_modules/.cache/electron',
    },
  },
  electronWinstallerConfig: {
    name: `printer-desk-host-${platform}-${arch}`
  },
  electronInstallerDebian: {
    icon: {
      '48x48'  : 'src/assets/icons/png/48x48.png',
      '64x64'  : 'src/assets/icons/png/64x64.png',
      '128x128': 'src/assets/icons/png/128x128.png',
      '256x256': 'src/assets/icons/png/256x256.png',
    },
    rename (dest, src) {
      return path.join(dest, `printer-desk-host-${platform}-${arch}-${version}.deb`)
    },
  },
  electronInstallerRedhat: {
    icon: {
      '48x48'  : 'src/assets/icons/png/48x48.png',
      '64x64'  : 'src/assets/icons/png/64x64.png',
      '128x128': 'src/assets/icons/png/128x128.png',
      '256x256': 'src/assets/icons/png/256x256.png',
    },
    rename (dest, src) {
      return path.join(dest, `printer-desk-host-${platform}-${arch}-${version}.rpm`)
    },
  },
  github_repository: {
    owner: 'Choirool',
    name: 'Khoirul Fatihin'
  },
  windowsStoreConfig: {
    packageName: '',
    name: 'printerdeskhost'
  }
}
