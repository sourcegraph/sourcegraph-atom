# Sourcegraph for Atom [![Atom Plugin](https://img.shields.io/badge/Atom-Sourcegraph-green.svg)](https://atom.io/packages/sourcegraph)

The Sourcegraph plugin for Atom enables you to quickly open and search code on Sourcegraph.com easily and efficiently.

### Status: Prerelease. Not yet ready for use.

## Installation

- Open `Atom` -> `Preferences` (<kbd>Cmd+,</kbd>).
- Select `Install` on the left.
- Search for `Sourcegraph` and press enter, then `Install`.
- Restart Atom.


## Usage

In the command palette (`Cmd+Shift+P` or `Ctrl+Shift+P`), search for `Sourcegraph:` to see available actions.

Keyboard Shortcuts:

| Description                     | Mac                 | Linux / Windows  |
|---------------------------------|---------------------|------------------|
| Open file in Sourcegraph        | <kbd>Option+A</kbd> | <kbd>Alt+A</kbd> |
| Search selection in Sourcegraph | <kbd>Option+S</kbd> | <kbd>Alt+S</kbd> |


## Questions & Feedback

Please file an issue: https://github.com/sourcegraph/sourcegraph-atom/issues/new


## Uninstallation

- Open `Atom` -> `Preferences` (<kbd>Cmd+,</kbd>).
- Select `Packages` on the left.
- Search for `Sourcegraph`, then `Uninstall`.
- Restart Atom.


## Development

To develop the plugin:

- `git clone` the repository into `~/.atom/Packages/sourcegraph` (lowercase `packages` on Mac)
- Use <kbd>Cmd+Shift+P</kbd> to open the command pallette, and choose `Window: Reload` to reload the extension in the current Atom window.
- Atom does some really bad things with respect to reopening the workspace, so `File` -> `Reopen Project` and `View` -> `Toggle Tree View` (<kbd>Cmd+\\</kbd>) are your friends here. Consider using a separate editor to make changes.
- To release a new version, you MSUT update the following files:
  1. `CHANGELOG.md` (describe ALL changes)
  3. `lib/sourcegraph.js` (`VERSION` constant)
  4. `git commit -m "all: release v<THE VERSION>` and `git push`.
  5. `apm publish <major|minor|patch>`


## Version History

See [CHANGELOG.md](CHANGELOG.md)
