import type { ClientAnimoRankAPI } from '$lib/api/client';
import { ClientPlugin } from '$lib/plugin/clientPlugin';
import type { SessionLogsWindowRegistry } from '../../../routes/instructor/analytics/session-logs/windowRegistry';
import { NotepadWindow } from './Notepad.window';

/** The key this plugin's view is registered under, in the plugin's own namespace. */
const VIEW = 'notepad';

/** Registers the notepad view on the Session Logs page. It does not open itself:
 *  the code replay is the view that comes forward, and this one is a tab away. */
export default class NotepadReplayClientPlugin extends ClientPlugin {
  public async init(api: ClientAnimoRankAPI): Promise<void> {
    const registrar =
      await api.clientRegistryProviderRegistrar.getRegistrarById<SessionLogsWindowRegistry>('window.session_logs');
    registrar.register(VIEW, NotepadWindow);
  }
}
