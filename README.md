# Smart Home Assistant

The demo home has rooms and devices; type what you want in natural language - "dim
the bedroom lights a bit", "turn off all the lights", "it is too warm in the living
room". One [TypeSafe](https://docs.typesafe.ai) System One call turns that sentence
into a set of typed decisions. The home applies them straight away, and the app shows
every answer with its probabilities.

## Getting started

```bash
npm install
cp .env.example .env.local   # then set TYPESAFE_API_KEY
npm run dev
```

Open <http://localhost:3000>. The demo home starts fresh on every load.

## How it works

The devices and their statuses live in React state in `HomeProvider` (`hooks/use-home.tsx`),
and start from the demo home in `lib/demo-home.ts` on every load. There is no database and no account.

A submitted action posts `{ command, home: { rooms, devices } }` to `/api/actions`. The
route builds the questions **on the server** from the home it was given - the System One
state is `{ command, home }`, and the room and device questions offer the ids of the rooms
and devices that exist - and asks Jev, the TypeSafe SDK's default model, all of them in one call.
It applies the answers and replies with `{ latencyMs, tokens, decisions, actions }` -
one `{ question, choice, confidence, choices }` per question, and `actions`, each device
the command changed with its new status - or `{ message }` with an error status:

| Question           | Primitive | What it decides                                                                            |
| ------------------ | --------- | ------------------------------------------------------------------------------------------ |
| `scope`            | choice    | one device, a whole room, one type in a room, or one type everywhere                       |
| `targetRoom`       | choice    | which room, built from the rooms that exist                                                |
| `targetDeviceType` | choice    | light, fan, thermostat, lock, blind or speaker                                             |
| `targetDevice`     | choice    | which single device, built from the devices that exist                                     |
| `change`           | choice    | what change: turn on/off, up/down a step, to the lowest/highest, lock, unlock, open, close |

They are asked together and only some are read: the scope decides which target
question matters. Asking them
speculatively in one call costs a few tokens; resolving the scope first and asking
again would cost a second round trip on every action.

Each question's options are defined once, as `{ label, criteria }` keyed by answer, by
`optionsOf` in `app/api/actions/build-questions.ts`: the fixed ones and the "all"/"none"
answers in `app/api/actions/constants.ts`, plus the rooms and devices.
`buildQuestions` sends each question's instructions and its options' criteria;
`buildDecisions` in `app/api/actions/build-decisions.ts` loops through the questions and
turns each answer into a decision, named by the question's instructions, with every
choice shown by its label.

`applyAnswers` in `app/api/actions/apply-answers.ts` turns the answers into new device
statuses: which devices they reach, and what the change does to each. A change that
means nothing for a device leaves it alone. Turning up or down moves one fixed step:
15 points, 3 degrees or one fan speed. The level limits it keeps to are
`LEVEL_LIMITS` in `lib/constants.ts`, the same ones the controls use. The assistant applies the
returned `actions` to the devices in `hooks/use-home.tsx`.

## Layout

```text
app/api/actions/route.ts            the one endpoint; the API key never leaves the server
app/api/actions/build-questions.ts  the five questions, built from the home
app/api/actions/build-decisions.ts  turns the answers into decisions for the person
app/api/actions/apply-answers.ts    decodes the answers into the changed devices
app/api/actions/constants.ts        the questions' instructions and fixed options
app/api/actions/types.ts            the question, scope, change and option types
hooks/use-home.tsx                  the devices' state, shared by the floorplan and the assistant
lib/demo-home.ts                    the demo home's rooms and devices as they start out
lib/devices.ts                      a device in words: active, status, reading, primary toggle
lib/constants.ts                    device constants shared by the UI and the API: fan speeds, level limits
lib/types.ts                        the shared types, T-prefixed: devices, statuses, request and response
components/                         the two panels
```

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build, including a full typecheck
npm run lint     # eslint
npm run format   # prettier
```
