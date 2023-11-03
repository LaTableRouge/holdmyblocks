const mix = require('laravel-mix')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')
const { resolve } = require('path')

require('laravel-mix-webp')
require('laravel-mix-replace-in-file')

const isProduction = mix.inProduction()
const state = process.env.npm_config_state
const chore = process.env.npm_config_chore

/*
 |--------------------------------------------------------------------------
 | Theme config
 |--------------------------------------------------------------------------
 |
 | Url (for browserSync)
 | Assets path
 | Assets destination path
 |
 */
const url = 'local.your-local-development-url.com'

/*
 |--------------------------------------------------------------------------
 | Assets Config
 |--------------------------------------------------------------------------
 | JS = [
 |    {
 |     - File name
 |     - File input
 |     - File output
 |    }
 |  ]
 |
 | SCSS = [
 |    {
 |     - File name
 |     - File input
 |     - File output
 |    }
 |  ]
 |
 | PHP = [
 |    - File path
 |  ]
 |
 */
const entryFiles = [
  {
    scripts: [
      {
        name: 'admin',
        input: 'assets/js',
        output: 'build/js'
      },
      {
        name: 'editor',
        input: 'assets/js',
        output: 'build/js'
      }
    ],
    styles: [
      {
        name: 'admin',
        input: 'assets/scss',
        output: 'build/css'
      }
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
    config: `npx eslint --config ${resolve(__dirname, '.eslintrc.js')} --no-error-on-unmatched-pattern --ignore-path ${resolve(__dirname, '.eslintignore')} --fix`,
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.scripts.flatMap(script => script.input)))),
      'components/blocks/**/src'
    ]
  },
  js_prettier: {
    config: `npx prettier --config ${resolve(__dirname, '.prettierrc.js')} --no-error-on-unmatched-pattern --ignore-path ${resolve(__dirname, '.prettierignore')} --write`,
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.scripts.flatMap(script => script.input)))),
      'components/blocks/**/src'
    ]
  },
  scss_lint: {
    config: `npx stylelint --config ${resolve(__dirname, '.stylelintrc.json')} --allow-empty-input --ignore-path ${resolve(__dirname, '.stylelintignore')} --fix`,
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.styles.flatMap(style => style.input)))),
      'components/blocks/**/src'
    ]
  },
  scss_prettier: {
    config: `npx prettier --config ${resolve(__dirname, '.prettierrc.js')} --no-error-on-unmatched-pattern --ignore-path ${resolve(__dirname, '.prettierignore')} --write`,
    files: [
      ...Array.from(new Set(entryFiles.flatMap(element => element.styles.flatMap(style => style.input)))),
      'components/blocks/**/src'
    ]
  },
  php_lint: {
    config: `php ${resolve(__dirname, 'vendor/bin/php-cs-fixer')} fix -v --show-progress=dots --using-cache=no --config=${resolve(__dirname, '.php-cs-fixer.php')}`,
    files: [
      'includes',
      'holdmyblocks.php',
      // resolve(__dirname, 'components/blocks/acf/src/**/includes/fields.php')
    ]
  }
}

/*
 |--------------------------------------------------------------------------
 | Watcher config
 |--------------------------------------------------------------------------
 | Files to watch
 |
 | - compiled CSS
 | - compiled JS
 |
 */
const filesToWatch = ['build/css/**/*.css']

/*
 |--------------------------------------------------------------------------
 | Cleanning config
 |--------------------------------------------------------------------------
 |
 | Files to apply cleanning through regex
 |
 */
const fileToClean = ['./**/holdmyblocks.php', 'holdmyblocks.php']

/*
 |--------------------------------------------------------------------------
 | Copy config
 |--------------------------------------------------------------------------
 |
 | Files to copy from smwh to smwh else
 |
 | {
 |   - File input
 |   - File output
 | }
 |
 |
 */
const filesToCopy = [
  {
    input: 'assets/fonts',
    output: 'build/fonts'
  },
  {
    input: 'assets/img',
    output: 'build/img'
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

if (entryFiles.length) {
  entryFiles.forEach(group => {
    if (group) {
      /*
      |--------------------------------------------------------------------------
      | Javascript Compilation
      |--------------------------------------------------------------------------
      |
      | Loop through the javascript array to compile them
      | Non minified file in dev
      | Minified file in production
      |
      */
      if (group.scripts?.length) {
        group.scripts.forEach(file => {
          mix
            .js(
              `${file.input}/${file.name}.js`,
              isProduction
                ? `${file.output}/${file.name}.min.js`
                : `${file.output}/${file.name}.js`
            )
        })
      }

      /*
      |--------------------------------------------------------------------------
      | SCSS Compilation
      |--------------------------------------------------------------------------
      |
      | Loop through the scss array to compile them
      | Non minified file in dev
      | Minified file in production
      |
      */
      if (group.styles?.length) {
        group.styles.forEach(file => {
          mix
            .sass(
              `${file.input}/${file.name}.scss`,
              isProduction
                ? `${file.output}/${file.name}.min.css`
                : `${file.output}/${file.name}.css`
            )
        })
      }
    }
  })
}

/*
 |--------------------------------------------------------------------------
 | Global Webpack config
 |--------------------------------------------------------------------------
 |
 | Enable source maps
 | Plugins :
 |  - Shell :
 |    - execute scss lint command
 |    - execute scss prettier command
 |    - execute js lint command
 |    - execute js prettier command
 |    - execute php lint command
 |
 */
mix.webpackConfig({
  devtool: isProduction ? false : 'source-map',
  mode: state === 'build' ? 'production' : false,
  stats: {
    warnings: false,
    children: false,
  },
  ignoreWarnings: [
    {
      message: /process.env.NODE_ENV/
    }
  ],
  optimization: {
    minimize: isProduction
  },
  plugins: [
    chore
      ? new WebpackShellPluginNext({
        onBuildStart: {
          scripts: [
            chore === 'all'
              ? [
                'echo ----------',
                'echo SCSS Prettier start',
                `${beautifyObject.scss_prettier.config} ${beautifyObject.scss_prettier.files.length > 1 ? `{${beautifyObject.scss_prettier.files.join(',')}}` : beautifyObject.scss_prettier.files.join(',')}/**/*.scss`,
                'echo SCSS Prettier end',
                'echo ----------',

                'echo ----------',
                'echo SCSS Lint start',
                `${beautifyObject.scss_lint.config} ${beautifyObject.scss_lint.files.length > 1 ? `{${beautifyObject.scss_lint.files.join(',')}}` : beautifyObject.scss_lint.files.join(',')}/**/*.scss`,
                'echo SCSS Lint end',
                'echo ----------',

                'echo ----------',
                'echo JS Prettier start',
                `${beautifyObject.js_prettier.config} ${beautifyObject.js_prettier.files.length > 1 ? `{${beautifyObject.js_prettier.files.join(',')}}` : beautifyObject.js_prettier.files.join(',')}/**/*.js`,
                'echo JS Prettier end',
                'echo ----------',

                'echo ----------',
                'echo JS Lint start',
                `${beautifyObject.js_lint.config} ${beautifyObject.js_lint.files.length > 1 ? `{${beautifyObject.js_lint.files.join(',')}}` : beautifyObject.js_lint.files.join(',')}/**/*.js`,
                'echo JS Lint end',
                'echo ----------',

                'echo ----------',
                'echo PHP Linter start',
                `${beautifyObject.php_lint.config} ${beautifyObject.php_lint.files.join(' ')}`,
                'echo PHP Linter end',
                'echo ----------',
              ].flat()
              : false
          ].flat().filter(Boolean),
          blocking: true,
          parallel: false
        }
      })
      : false,
    {
      apply(compiler) {
        // Watching
        compiler.hooks.watchRun.tap('WatchRunAlert', (params) => {
          console.log('')
          console.log('Watching files')
          console.log('(⌐■_■)')
          console.log('')
        })

        // Done alert
        compiler.hooks.done.tap('DoneAlert', (params) => {
          console.log('')
          if (isProduction) {
            state === 'build' ? console.log('Build prod complete') : console.log('Compilation prod complete')
            console.log('─=≡Σ((( つ•̀ω•́)つ ─=≡Σ((( つ•̀ω•́)つ ─=≡Σ((( つ•̀ω•́)つ ─=≡Σ((( つ•̀ω•́)つ')
          } else {
            state === 'build' ? console.log('Build dev complete') : console.log('Compilation dev complete')
            console.log('ヾ(•ω•`)o')
          }
          console.log('')
        })

        // Fail alert
        compiler.hooks.failed.tap('FailAlert', (params) => {
          console.log('')
          console.log('Build failed')
          console.log('(╯°□°）╯︵ ┻━┻')
          console.log('')
        })
      }
    }
  ].filter(Boolean)
})

/*
 |--------------------------------------------------------------------------
 | Mix options
 |--------------------------------------------------------------------------
 |
 | No manifest file
 | Make css url Work (why is that even an option ????)
 | Autoprefixer config
 | Uglify/Terser config
 |
 */
mix.options({
  postCss: [
    // require('node-css-mqpacker')() // Group media queries
  ],
  manifest: false,
  processCssUrls: false,
  autoprefixer: {
    options: {
      browsers: [
        'last 2 version',
        '> 1%',
        'safari 5',
        'ie 8',
        'ie 9',
        'opera 12.1',
        'ios 6',
        'android 4'
      ]
    }
  },
  uglify: isProduction
    ? {
      extractComments: false,
      uglifyOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            'console.log'
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
        }
      }
    }
    : false,
  terser: isProduction
    ? {
      extractComments: false,
      terserOptions: {
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
        }
      }
    }
    : false
})

/*
 |--------------------------------------------------------------------------
 | Source maps
 |--------------------------------------------------------------------------
 |
 | Enable source maps for dev files
 |
 */
mix.sourceMaps(!isProduction)

/*
 |--------------------------------------------------------------------------
 | BrowserSync config
 |--------------------------------------------------------------------------
 |
 | Reload page on selected file change
 |
 */
mix.browserSync({
  watch: true,
  watchOptions: {
    ignoreInitial: true,
    ignored: '*.map.css'
  },
  proxy: url,
  port: 3000,
  injectChanges: true,
  files: filesToWatch,
  notify: {
    styles: {
      top: '0',
      right: '0',
      left: 'auto',
      bottom: 'auto',
      opacity: '0.5'
    }
  }
})

/*
 |--------------------------------------------------------------------------
 | Clean files
 |--------------------------------------------------------------------------
 |
 | Remove var_dumps();
 |
 */
if (chore === 'clean' || chore === 'all') {
  if (fileToClean.length) {
    mix
      .replaceInFile({
        files: fileToClean,
        from: /\bvar_dump\(([^)]+)\);/g,
        to: ''
      })
  }
}

/*
 |--------------------------------------------------------------------------
 | Copy assets
 |--------------------------------------------------------------------------
 |
 | Copy assets to specific location
 |
 */
if (filesToCopy.length) {
  filesToCopy.forEach(file => {
    mix.copy(file.input, file.output)
  })
}

/*
 |--------------------------------------------------------------------------
 | Notification
 |--------------------------------------------------------------------------
 |
 | Snore toast compilation alert
 | Disable all notifications
 | Disable only success notifications
 |
 */
mix.disableNotifications()
// mix.disableSuccessNotifications()
