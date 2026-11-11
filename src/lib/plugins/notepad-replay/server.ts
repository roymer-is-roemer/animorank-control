import { ServerPlugin } from '$lib/plugin/serverPlugin';

/** No server surface: this plugin contributes one browser-side log view. */
export default class NotepadReplayServerPlugin extends ServerPlugin {
  public async init(): Promise<void> {}
}
