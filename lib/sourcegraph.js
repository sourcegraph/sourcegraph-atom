'use babel'

import { CompositeDisposable } from 'atom'

const opn = require('opn')
const copy = require('copy')
const execa = require('execa')
const url = require('url')
const path = require('path')

const VERSION = "v1.0.5"

// gitRemotes returns the names of all git remotes, e.g. ["origin", "foobar"]
async function gitRemotes(repoDir: string) {
  return execa("git", ["remote"], { cwd: repoDir }).then(result => {
    return result.stdout.split("\n")
  })
}

// gitRemoteURL returns the remote URL for the given remote name.
// e.g. "origin" -> "git@github.com:foo/bar"
async function gitRemoteURL(repoDir: string, remoteName: string) {
  return execa("git", ["remote", "get-url", remoteName], { cwd: repoDir }).then(result => {
    return result.stdout
  })
}

// gitDefaultRemoteURL returns the remote URL of the first Git remote found.
async function gitDefaultRemoteURL(repoDir: string) {
  const remotes = await gitRemotes(repoDir)
  if (remotes.length == 0) {
    return Promise.reject("no configured git remotes")
  }
  if (remotes.length > 1) {
    console.log("using first git remote:", remotes[0])
  }
  return gitRemoteURL(repoDir, remotes[0])
}

// gitRootDir returns the repository root directory for any directory within the
// repository.
async function gitRootDir(repoDir: string) {
  return execa("git", ["rev-parse", "--show-toplevel"], { cwd: repoDir }).then(result => {
    return result.stdout
  })
}

// gitBranch returns either the current branch name of the repository OR in all
// other cases (e.g. detached HEAD state), it returns "HEAD".
async function gitBranch(repoDir: string) {
  return execa("git", ["rev-parse", "--abbrev-ref", "HEAD"], { cwd: repoDir }).then(result => {
    return result.stdout
  })
}

function sourcegraphURL() {
  const url = atom.config.get('sourcegraph.URL')
  if (!url.endsWith("/")) {
    return url + "/"
  }
  return url
}

// repoInfo returns the Sourcegraph repository URI, and the file path relative
// to the repository root. If the repository URI cannot be determined, empty
// strings are returned.
async function repoInfo(fileName: string) {
  let remoteURL = ""
  let branch = ""
  let fileRel = ""
  try{
    // Determine repository root directory.
    const fileDir = path.dirname(fileName)
    const repoRoot = await gitRootDir(fileDir)

    // Determine file path, relative to repository root.
    remoteURL = await gitDefaultRemoteURL(repoRoot)
    branch = await gitBranch(repoRoot)
    fileRel = fileName.slice(repoRoot.length + 1)
  } catch (e) {
    console.log("repoInfo:", e)
  }
  return [remoteURL, branch, fileRel]
}

// open is the command implementation for opening the selection on
// Sourcegraph.
async function open() {
  let editor = atom.workspace.getActiveTextEditor()
  if (!editor) {
    return
  }
  let r = editor.getSelectedBufferRange()

  const [remoteURL, branch, fileRel] = await repoInfo(editor.getPath())
  if (remoteURL == "") {
      return
  }

  // Open in browser.
  copy(`${sourcegraphURL()}-/editor`
    + `?remote_url=${encodeURIComponent(remoteURL)}`
    + `&branch=${encodeURIComponent(branch)}`
    + `&file=${encodeURIComponent(fileRel)}`
    + `&editor=${encodeURIComponent("Atom")}`
    + `&version=${encodeURIComponent(VERSION)}`
    + `&start_row=${encodeURIComponent(r.start.row)}`
    + `&start_col=${encodeURIComponent(r.start.column)}`
    + `&end_row=${encodeURIComponent(r.end.row)}`
    + `&end_col=${encodeURIComponent(r.end.column)}`)
}

// search is the command implementation for searching a selection on
// Sourcegraph.
async function search() {
  let editor = atom.workspace.getActiveTextEditor()
  if (!editor) {
    return
  }

  const [remoteURL, branch, fileRel] = await repoInfo(editor.getPath())

  let query = editor.getSelectedText()
  if (query == "") {
    return // nothing to query
  }

  // Search in browser.
  opn(`${sourcegraphURL()}-/editor`
    + `?remote_url=${encodeURIComponent(remoteURL)}`
    + `&branch=${encodeURIComponent(branch)}`
    + `&file=${encodeURIComponent(fileRel)}`
    + `&editor=${encodeURIComponent("Atom")}`
    + `&version=${encodeURIComponent(VERSION)}`
    + `&search=${encodeURIComponent(query)}`)
}

async function copy() {
  let editor = atom.workspace.getActiveTextEditor()
  if (!editor) {
    return
  }
  let r = editor.getSelectedBufferRange()

  const [remoteURL, branch, fileRel] = await repoInfo(editor.getPath())
  if (remoteURL == "") {
      return
  }

  // Open in browser.
  opn(`${sourcegraphURL()}-/editor`
    + `?remote_url=${encodeURIComponent(remoteURL)}`
    + `&branch=${encodeURIComponent(branch)}`
    + `&file=${encodeURIComponent(fileRel)}`
    + `&editor=${encodeURIComponent("Atom")}`
    + `&version=${encodeURIComponent(VERSION)}`
    + `&start_row=${encodeURIComponent(r.start.row)}`
    + `&start_col=${encodeURIComponent(r.start.column)}`
    + `&end_row=${encodeURIComponent(r.end.row)}`
    + `&end_col=${encodeURIComponent(r.end.column)}`)
}

async function edit() {

}

export default {

  config: {
    "URL": {
      "type": "string",
      "default": "https://sourcegraph.com",
    }
  },
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable()

    // Register commands.
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sourcegraph:open': () => open(),
      'sourcegraph:search': () => search()
    }))
  },

  deactivate() {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
  },

  serialize() {
    return {}
  },
}
