import { ServerPlugin } from '$lib/plugin/serverPlugin';

/** No server surface: this plugin contributes one browser-side window. */
export default class NotepadServerPlugin extends ServerPlugin {
  public async init(): Promise<void> {}
}
