<script lang="ts">
  import Button from '$lib/components/ui/buttons/Button.svelte';
  import { formatLogTimestamp } from '$lib/analytics/sessionLogTime';
  import type { SessionLogsViewContext } from '../../../routes/instructor/analytics/session-logs/context.svelte';
  import { notepadDeltas, notepadTexts } from './notepadReplay';

  let { context }: { context: SessionLogsViewContext } = $props();

  /** How long one edit stays on screen during playback. */
  const PLAY_INTERVAL_MS = 800;

  // The service hands entries newest first; a reconstruction runs oldest first.
  const entries = $derived([...context.logs].reverse());
  const edits = $derived(notepadDeltas(entries));
  // One text per step: index 0 is the blank note, index i the note after edit i - 1.
  const texts = $derived(notepadTexts(edits));

  let rawPosition = $state(0);
  const position = $derived(Math.min(rawPosition, edits.length));
  const text = $derived(texts[position] ?? '');
  const lastEdit = $derived(position > 0 ? edits[position - 1] : null);

  let playing = $state(false);

  // A different selection is a different session: rewind it.
  const identity = $derived(`${entries.length}\u0000${entries[0]?.id ?? ''}\u0000${entries.at(-1)?.id ?? ''}`);
  let shownIdentity = '';
  $effect(() => {
    const current = identity;
    if (current === shownIdentity) return;
    shownIdentity = current;
    rawPosition = 0;
    playing = false;
  });

  $effect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      if (position >= edits.length) {
        playing = false;
        return;
      }
      rawPosition = position + 1;
    }, PLAY_INTERVAL_MS);
    return () => clearInterval(id);
  });

  function seek(next: number): void {
    playing = false;
    rawPosition = Math.min(Math.max(0, next), edits.length);
  }
</script>

<section class="flex flex-col gap-3">
  <div class="flex flex-wrap items-baseline justify-between gap-2">
    <h2 class="font-display text-lg font-semibold">Notepad</h2>
    <span class="text-xs text-base-content/60">
      {edits.length} notepad edit{edits.length === 1 ? '' : 's'} · {position} / {edits.length}
    </span>
  </div>

  {#if edits.length === 0}
    <p
      class="rounded-box bg-base-200 p-8 text-center text-base-content/60"
      data-testid="notepad-replay-empty"
    >
      This session has no notepad edits.
    </p>
  {:else}
    <div class="flex flex-wrap items-center gap-2">
      <Button
        class="btn-sm"
        disabled={position === 0}
        onclick={() => seek(0)}>Restart</Button
      >
      <Button
        class="btn-sm"
        disabled={position === 0}
        onclick={() => seek(position - 1)}>Previous</Button
      >
      {#if playing}
        <Button
          class="btn-sm btn-primary"
          onclick={() => (playing = false)}>Pause</Button
        >
      {:else}
        <Button
          class="btn-sm btn-primary"
          onclick={() => {
            if (position >= edits.length) rawPosition = 0;
            playing = true;
          }}>Play</Button
        >
      {/if}
      <Button
        class="btn-sm"
        disabled={position >= edits.length}
        onclick={() => seek(position + 1)}>Next</Button
      >
      {#if lastEdit}
        <time
          class="ml-auto text-xs text-base-content/60"
          datetime={lastEdit.timestamp}>{formatLogTimestamp(lastEdit.timestamp)}</time
        >
      {/if}
    </div>

    <input
      class="range range-primary range-xs w-full"
      type="range"
      min="0"
      max={edits.length}
      bind:value={rawPosition}
      oninput={() => (playing = false)}
      aria-label="Notepad replay position"
    />

    <pre
      data-testid="notepad-replay"
      class="min-h-64 max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-box bg-base-200 p-4 text-sm">{text}</pre>
  {/if}
</section>
