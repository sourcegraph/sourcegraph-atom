'use babel';

import SourcegraphView from './sourcegraph-view';
import { CompositeDisposable } from 'atom';

export default {

  sourcegraphView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.sourcegraphView = new SourcegraphView(state.sourcegraphViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.sourcegraphView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'sourcegraph:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.sourcegraphView.destroy();
  },

  serialize() {
    return {
      sourcegraphViewState: this.sourcegraphView.serialize()
    };
  },

  toggle() {
    console.log('Sourcegraph was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
