import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'
import { run } from 'vite-plugin-run'
import { viteStaticCopy } from 'vite-plugin-static-copy'
const { resolve } = require('path')
const { stringReplaceOpenAndWrite, stringReplace } = require('@mlnop/string-replace')

const chore = process.env.npm_config_chore
const actualVersion = process.env.npm_package_version
const newVersion = process.env.npm_config_newversion
const isProduction = process.env.NODE_ENV === 'production'

/*
 |--------------------------------------------------------------------------
 | Global config
 |--------------------------------------------------------------------------
 |
 | Assets path
 | Destination path
 |
 */
const pluginName = 'holdmyblocks'
const assetsPath = 'assets'
const distPath = 'build'

/*
 |--------------------------------------------------------------------------
 | Assets config
 |--------------------------------------------------------------------------
 | {
 |  scripts = [
 |      {
 |        - File name
 |        - File input
 |      }
 |    ]
 |
 |  styles = [
 |      {
 |        - File name
 |        - File input
 |      }
 |    ]
 | }
 |
 */
const entryFiles = [
  {
    scripts: [
      {
        name: 'admin',
        input: `${assetsPath}/js`
      },
      {
        name: 'editor',
        input: `${assetsPath}/js`
      },
    ],
    styles: [
      {
        name: 'admin',
        input: `${assetsPath}/scss`
      },
    ]
  }
]

/*
 |--------------------------------------------------------------------------
 | Beautify config (lint/prettier files)
 |--------------------------------------------------------------------------
 | {
 |    js|php|scss: {
 |     - Config (string)
 |     - Files (array of strings)
 |    }
 | }
 |
 */
const beautifyObject = {
  js_lint: {
    config: 'npx eslint --no-error-on-unmatched-pattern --fix',
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.scripts.flatMap(script => script.input)))),
      'components/blocks',
      'components/patterns'
    ]
  },
  js_prettier: {
    config: 'npx prettier --no-error-on-unmatched-pattern --write',
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.scripts.flatMap(script => script.input)))),
      'components/blocks',
      'components/patterns'
    ]
  },
  scss_lint: {
    config: 'npx stylelint --allow-empty-input --fix',
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.styles.flatMap(style => style.input)))),
      'components/blocks',
      'components/patterns'
    ]
  },
  scss_prettier: {
    config: 'npx prettier --no-error-on-unmatched-pattern --write',
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.styles.flatMap(style => style.input)))),
      'components/blocks',
      'components/patterns'
    ]
  },
  php_lint: {
    config: `${resolve(__dirname, 'vendor/bin/php-cs-fixer.bat')} fix -v --show-progress=dots --using-cache=no --config=${resolve(__dirname, '.php-cs-fixer.php')}`,
    files: [
      'includes',
      'holdmyblocks.php',
      'components/blocks'
    ]
  }
}

/*
 |--------------------------------------------------------------------------
 | Files to edit
 |--------------------------------------------------------------------------
 |  [
 |    {
 |     - File path (array of strings)
 |     - Replace (array)
 |       {
 |        from (regex of string)
 |        to (string)
 |       }
 |    }
 |  ]
 |
 */
const filesToEdit = []
if (chore === 'version') {
  if (actualVersion && newVersion) {
    const isGreaterThanOldVersion = newVersion.localeCompare(actualVersion, undefined, { numeric: true, sensitivity: 'base' })
    if (isGreaterThanOldVersion === 1) {
      filesToEdit.push(
        {
          filePath: [
            resolve(__dirname, 'package.json'),
            resolve(__dirname, 'update/info.json'),
            resolve(__dirname, 'holdmyblocks.php')
          ],
          replace: [
            {
              from: /"version":\s?"[0-9]+.[0-9]+.[0-9]+"/g,
              to: `"version": "${newVersion}"`
            },
            {
              from: /Version:\s?[0-9]+.[0-9]+.[0-9]+/g,
              to: `Version: ${newVersion}`
            },
            {
              from: /Stable tag:\s?[0-9]+.[0-9]+.[0-9]+/g,
              to: `Stable tag: ${newVersion}`
            },
            {
              from: /\/commits\/[0-9]+.[0-9]+.[0-9]+/g,
              to: `/commits/${newVersion}`
            },
            {
              from: /\/download\/[0-9]+.[0-9]+.[0-9]+/g,
              to: `/download/${newVersion}`
            }
          ]
        }
      )
    } else {
      console.warn('The new version is not greater than the old one')
    }
  } else {
    console.warn('No version number specified please add a --newversion=x.x.x to your command line')
  }
} else {
  filesToEdit.push(
    {
      filePath: [
        resolve(__dirname, 'includes/'),
        resolve(__dirname, 'holdmyblocks.php')
      ],
      replace: [
        {
          from: /\bvar_dump\(([^)]+)\);/g,
          to: ''
        }
      ]
    }
  )
}

/*
 |--------------------------------------------------------------------------
 | Copy config
 |--------------------------------------------------------------------------
 |  [
 |    {
 |      - File input (string)
 |      - File output (string)
 |    }
 |  ]
 |
 */
const filesToCopy = [
  {
    src: `${assetsPath}/img`,
    dest: 'assets/'
  }
]

/*
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 | That's all, stop editing, happy development
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 |--------------------------------------------------------------------------
 */

const entriesToCompile = []

if (entryFiles.length) {
  entryFiles.forEach(group => {
    if (group) {
      /*
      |--------------------------------------------------------------------------
      | Javascript Compilation
      |--------------------------------------------------------------------------
      |
      | Create array of files to compile
      |
      */
      if (group.scripts?.length) {
        group.scripts.forEach(file => {
          if (!entriesToCompile.includes(`${file.input}/${file.name}.js`)) {
            entriesToCompile.push(`${file.input}/${file.name}.js`)
          }
        })
      }

      /*
      |--------------------------------------------------------------------------
      | SCSS Compilation
      |--------------------------------------------------------------------------
      |
      | Create array of files to compile
      |
      */
      if (group.styles?.length) {
        group.styles.forEach(file => {
          if (chore === undefined || chore === 'all' || chore.includes('scss')) {
            if (!entriesToCompile.includes(`${file.input}/${file.name}.scss`)) {
              entriesToCompile.push(`${file.input}/${file.name}.scss`)
            }
          }
        })
      }
    }
  })
}

/*
|--------------------------------------------------------------------------
| Replace in file
|--------------------------------------------------------------------------
|
| Replace string in file
| Change vite constant in watch
| Change vite constant in build
|
*/
if (chore !== 'ci') {
  if (isProduction) {
    stringReplaceOpenAndWrite(
      resolve(__dirname, 'holdmyblocks.php'),
      [
        {
          from: /\bdefine\([ ]?'HMB_VITE_DEVELOPMENT',[ ]?true[ ]?\);/g,
          to: "define('HMB_VITE_DEVELOPMENT', false);"
        }
      ]
    )
  } else {
    stringReplaceOpenAndWrite(
      resolve(__dirname, 'holdmyblocks.php'),
      [
        {
          from: /\bdefine\([ ]?'HMB_VITE_DEVELOPMENT',[ ]?false[ ]?\);/g,
          to: "define('HMB_VITE_DEVELOPMENT', true);"
        }
      ]
    )
  }
}

/*
 |--------------------------------------------------------------------------
 | Global Vite config
 |--------------------------------------------------------------------------
 |
 | Plugins :
 |  - Replace in file
 |  - Live reload :
 |    - Files to refresh
 |  - Run :
 |    - execute scss lint command
 |    - execute scss prettier command
 |    - execute js lint command
 |    - execute js prettier command
 |    - execute php lint command
 | Options :
 |  - Build
 |    - minify when production build
 |    - terser options
 |    - define build directory
 |    - empty build dir
 |  - Server
 |    - hot reload config
 |  - CSS
 |    - autoprefixer when production build
 |
 */
export default defineConfig({
  base: isProduction ? './' : `/wp-content/plugins/${pluginName}`, // Url to apply refresh
  plugins: [
    isProduction
      ? stringReplace(filesToEdit)
      : false,

    isProduction
      ? viteStaticCopy({
        targets: filesToCopy
      })
      : false,

    isProduction
      ? run({
        silent: false,
        skipDts: true,
        input: [
          chore === 'all' || chore === 'prettier:scss'
            ? {
              name: 'prettier:scss',
              run: [`${beautifyObject.scss_prettier.config} ${beautifyObject.scss_prettier.files.length > 1 ? `{${beautifyObject.scss_prettier.files.join(',')}}` : beautifyObject.scss_prettier.files.join(',')}/**/*.scss`],
            }
            : false,
          chore === 'all' || chore === 'lint:scss'
            ? {
              name: 'lint:scss',
              run: [`${beautifyObject.scss_lint.config} ${beautifyObject.scss_lint.files.length > 1 ? `{${beautifyObject.scss_lint.files.join(',')}}` : beautifyObject.scss_lint.files.join(',')}/**/*.scss`],
            }
            : false,
          chore === 'all' || chore === 'prettier:js'
            ? {
              name: 'prettier:js',
              run: [`${beautifyObject.js_prettier.config} ${beautifyObject.js_prettier.files.length > 1 ? `{${beautifyObject.js_prettier.files.join(',')}}` : beautifyObject.js_prettier.files.join(',')}/**/*.js`],
            }
            : false,
          chore === 'all' || chore === 'lint:js'
            ? {
              name: 'lint:js',
              run: [`${beautifyObject.js_lint.config} ${beautifyObject.js_lint.files.length > 1 ? `{${beautifyObject.js_lint.files.join(',')}}` : beautifyObject.js_lint.files.join(',')}/**/*.js`],
            }
            : false,
          chore === 'all' || chore === 'lint:php'
            ? {
              name: 'lint:php',
              run: [`${beautifyObject.php_lint.config} ${beautifyObject.php_lint.files.join(' ')}`],
            }
            : false
        ].filter(Boolean)
      })
      : false,
  ].filter(Boolean),

  build: {
    rollupOptions: {
      input: entriesToCompile,
    },
    write: true,
    minify: isProduction ? 'terser' : false,
    terserOptions: isProduction
      ? {
        keep_fnames: true,
        enclose: true,
        compress: {
          pure_funcs: [
            'console.log',
            '__'
            // 'console.error',
            // 'console.warn',
            // ...
          ]
        },
        // Make sure symbols under `pure_funcs`,
        // are also under `mangle.reserved` to avoid mangling.
        mangle: {
          reserved: [
            'console.log',
            '__'
            // 'console.error',
            // 'console.warn',
            // ...
          ]
        },
        output: {
          comments: false
        }
      }
      : null,
    outDir: distPath,
    emptyOutDir: true,
    manifest: true,
    sourcemap: !isProduction,
  },

  server: {
    cors: true,
    strictPort: true,
    port: 5174,
    https: false,
    open: false,
    hmr: {
      host: 'localhost'
    },
    watch: {
      usePolling: true
    },
  },

  css: {
    devSourcemap: !isProduction,
    postcss: {
      plugins: [
        autoprefixer
      ],
    }
  },

  clearScreen: false
})
