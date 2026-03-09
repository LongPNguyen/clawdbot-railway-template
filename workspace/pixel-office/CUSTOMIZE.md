# Customizing Pixel Office

## Quick Setup: Change Agent Names

The pixel office comes pre-configured with example agents. To match YOUR agents:

### 1. Edit `src/config.ts`

Find the `AGENT_DEFS` array (~line 54) and update the agent IDs to match your OpenClaw agent config:

```typescript
export const AGENT_DEFS: AgentDef[] = [
  { id: 'your-main-agent', name: 'Captain', role: 'Leader', ... },
  { id: 'your-builder', name: 'Builder', role: 'Dev', ... },
  // etc.
];
```

Also update `AGENT_IDENTITY` (~line 116) and `AGENT_LINKED_IDS` (~line 108).

### 2. Edit `update-state.sh`

Update the AGENTS list to match:

```python
AGENTS = ["your-main-agent", "your-builder", "your-reviewer"]
```

### 3. Rebuild

```bash
npm install
npx vite build
```

### 4. Restart

```bash
systemctl restart pixel-office
# or just refresh the browser if using browser-sync
```

## Change Timezone

Edit `src/effects.ts` and `src/main.ts` — search for `America/Chicago` and replace with your timezone.

## Add a Custom Theme

See `src/themes/types.ts` for the interface. Copy `modern-office.ts` as a starting point.
