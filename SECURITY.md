# Security Policy

If you believe you found a security issue in Carapace,
report it privately.

## Reporting

Open a private report through
[GitHub Security Advisories](https://github.com/openclaw/carapace/security/advisories/new)
or email `security@openclaw.ai`.

Include:

1. affected release or commit
2. affected consumer and runtime
3. minimal reproduction
4. demonstrated impact
5. suggested remediation, if known

Do not open a public issue until maintainers have coordinated disclosure.

## Supported Versions

Security fixes are applied to the latest release and the latest `main` branch.
Older releases are not supported.

## Scope

Security issues in scope generally include:

- package or release-pipeline compromise affecting distributed styles or skills
- validation tooling that executes untrusted input or escapes its intended path
- distributed CSS that unexpectedly loads remote resources or crosses a
  documented consumer boundary
- agent guidance that introduces hidden code execution, credential disclosure,
  or data exfiltration

Reports must demonstrate concrete impact or a documented boundary bypass.
Visual defects, accessibility issues, ordinary design drift, malicious
consumer code, and prompt injection without a boundary bypass are not security
vulnerabilities in this repository.

## Operational Guidance

- Install immutable release tags rather than mutable branches.
- Treat agent-generated changes as untrusted until reviewed and tested.
- Load licensed fonts, logos, and media from trusted consumer-owned sources.
- Never place credentials, private URLs, or sensitive data in CSS or audit
  artifacts.
- Pin and review dependency and workflow updates before release.

There is currently no paid bug bounty program.
