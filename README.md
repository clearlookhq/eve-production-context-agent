[deploy-with-vercel]: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fclearlookhq%2Feve-production-context-agent%2Ftree%2Fmain&project-name=production-context-agent&repository-name=production-context-agent&from=templates&products=%5B%7B%22type%22%3A%22blob%22%2C%22access%22%3A%22private%22%7D%5D&connect=%5B%7B%22type%22%3A%22slack%22%2C%22env%22%3A%22SLACK_CONNECTOR%22%2C%22triggers%22%3Atrue%2C%22triggerPath%22%3A%22%2Feve%2Fv1%2Fslack%22%7D%2C%7B%22type%22%3A%22github%22%2C%22env%22%3A%22GITHUB_CONNECTOR%22%7D%2C%7B%22type%22%3A%22vercel%22%2C%22env%22%3A%22SRE_VERCEL_CONNECTOR%22%7D%5D&env=CLEARLOOK_API_KEY%2CCLEARLOOK_PROJECT&envDescription=A+read-only+Clearlook+service+key+%28Settings+%E2%80%BA+API+keys%29+and+the+project+to+watch+%28its+slug+or+id%29.&envLink=https%3A%2F%2Fdocs.clearlook.dev%2Fai%2Feve

# Production context agent

[![MIT License](https://img.shields.io/badge/License-MIT-000?style=flat-square&logo=opensourceinitiative&logoColor=white&labelColor=000&color=000)](LICENSE)

An [eve](https://eve.dev) agent that finds out why something changed in production, and hands the evidence to the pull request that can fix it.

It starts every question with [Clearlook](https://clearlook.dev)'s investigation engine: analytics, errors, server logs, page speed, uptime and recordings for the same site, answered with ranked causes, numbered evidence and a link for every number. Then it checks the deploy on Vercel and the change on GitHub, and offers to comment the answer on the pull request that shipped it. A person approves every comment; everything else is read only.

Ask in Slack (`@sre why did sign-ups drop yesterday?`), watch an alerts channel, or call it from any system with a webhook.

[![Deploy with Vercel](https://vercel.com/button)][deploy-with-vercel]

Built on Vercel's [eve SRE agent template](https://github.com/vercel-labs/eve-sre-agent-template) (MIT), with Clearlook in place of Datadog.

## What it does

1. **Why did this change?** Clearlook's `investigate` returns a verdict (changed, within chance, within the usual range), likely causes ranked with evidence numbers, and what it ruled out. When nothing unusual happened, the agent says so and stops.
2. **What changed then?** A release Clearlook saw, the error it brought, the page that slowed or the API path that started failing. The agent confirms the deploy with Vercel's tools.
3. **Which code?** From the release's commit to its pull request and the lines that match the evidence, with GitHub's tools.
4. **Hand it over.** With your approval, a comment on that pull request: what broke, for whom, since when, the evidence with links, and the suspected change.

## Set up

Select [**Deploy with Vercel**][deploy-with-vercel]. It clones this repository, creates the project and storage, connects Slack, GitHub and Vercel, and asks for:

| Variable | Required | What it is |
| --- | --- | --- |
| `CLEARLOOK_API_KEY` | For webhook and channel-watch runs | A Clearlook service key with read scopes only: Settings › API keys › New key, with read access to analytics, errors, uptime and replays. |
| `CLEARLOOK_PROJECT` | No | The project to investigate when a request names none (its slug, name or id). |
| `CLEARLOOK_URL` | No | Your own Clearlook server. Default `https://app.clearlook.dev`. |

Without `CLEARLOOK_API_KEY`, the agent signs in to Clearlook through Vercel Connect (`vercel connect create https://app.clearlook.dev/mcp --connection-method mcp --name sre`). That works only in sessions a Slack user starts, since webhook runs have no person to sign in.

For a full CLI setup, see [`docs/setup-for-agents.md`](./docs/setup-for-agents.md).

After deployment:

1. Invite the Slack app to a channel.
2. Ask `@sre did my last deploy break anything?` and confirm it answers with Clearlook evidence.
3. For automated runs from an alert, follow [`docs/automate-investigations.md`](./docs/automate-investigations.md).

## Try it on the Clearlook demo

Every Clearlook account can open a sample project, **Demo**, with a planted bug: release `tandem-web@1.6.0` broke the sign-up form on Safari. Set `CLEARLOOK_PROJECT=demo` and ask `@sre why are Safari sign-ups down since the last release?`. The agent should name the release and the error `Cannot read properties of undefined (reading 'plan')`, show that the visitors who hit it rarely signed up, and stop short of a pull request comment (the demo has no repository).

## Local development

```bash
pnpm install
vercel link
vercel env pull
pnpm dev
```

Model calls go through Vercel AI Gateway, so `vercel link` is needed even locally.

## Environment

| Variable | Default | What it does |
| --- | --- | --- |
| `CLEARLOOK_API_KEY` | none | Read-only Clearlook service key for unattended runs. |
| `CLEARLOOK_PROJECT` | none | Default Clearlook project. |
| `CLEARLOOK_URL` | `https://app.clearlook.dev` | Clearlook server. |
| `CLEARLOOK_CONNECTOR` | `clearlook/sre` | Vercel Connect UID for Clearlook when no key is set. |
| `SLACK_CONNECTOR` | `slack/sre` | Slack channel and bot. |
| `GITHUB_CONNECTOR` | `github/sre` | GitHub tools. |
| `SRE_VERCEL_CONNECTOR` | `vercel/sre` | Vercel MCP tools. |
| `WEBHOOK_SECRET` | none | Shared secret for `POST /v1/investigate`. Use `randomBytes(32)`. |

Copy [`.env.example`](./.env.example) to `.env` for local values.

## Customize

- `agent/instructions/instructions.md`: general behavior, including "Clearlook first".
- `agent/skills/release-to-pr/`: the release check and the pull request handoff.
- `agent/connections/clearlook.ts`: which Clearlook tools the agent may call (read only).
- `agent/extensions/github.ts`: GitHub tools; the one write, `addPullRequestComment`, always asks for approval.

## Verify

```bash
pnpm validate
pnpm test
```

## Troubleshooting

- **Clearlook asks for sign-in in a webhook run:** set `CLEARLOOK_API_KEY`; webhook runs can't use a person's sign-in.
- **A Clearlook tool says it isn't allowed:** the key is missing a scope. Give it read access to analytics, errors, uptime and replays.
- **A webhook returns `401`:** the caller and the deployment must use the same `WEBHOOK_SECRET`.

## License

MIT. Based on [vercel-labs/eve-sre-agent-template](https://github.com/vercel-labs/eve-sre-agent-template), copyright Vercel, Inc.
