module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build', // changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
        'chore', // updating tacks etc; no production code change
        // 'ci',
        'docs', // change to the documentation only
        'feat', // new feature to the user
        'fix', // bug fix for the user
        // 'perf', // a code change that improves performance
        'refactor', // refactoring code, eg. renaming a variable (a change that neighter fixes or adds a feature)
        'revert', // revert a previous commit
        'style', // style propre au code (formatage du code, indentation, virgule et point-virgule de fin, espaces, ...)
        // 'test',
        'wordpress', // tout ce qui touche à wordpress (installation/maj de plugin, de wordpress, ...)
        'wp', // alias de wordpress
      ],
    ],
  },
}
