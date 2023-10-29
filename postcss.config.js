module.exports = {
  plugins: [
    // removes all messages from postcss
    {
      postcssPlugin: 'autoprefixer-warnings-cleaner',
      OnceExit(_, result) {
        result.result.messages = result.result.messages.filter((msg) => {
          return msg.plugin !== 'autoprefixer'
        })
      }
    }
  ]
}
