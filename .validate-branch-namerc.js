module.exports = {
  pattern:
    "^(main|master|srv/dev|srv/pre)$|^(feature|fix|hotfix|experimental|minor|major|release)/.+$",
  errorMsg:
    "🤨 La branche que tu essaies de pusher ne respecte pas nos conventions, tu peux la renommer avec `git branch -m <nom-actuel> <nouveau-nom>`"
}
