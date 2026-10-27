# Step 5 — Load Guides

Load the full guide before you use it. Follow every rule and phase in it. Do not skim or skip steps.

| Guide                                                                  | When to load                    |
| ---------------------------------------------------------------------- | ------------------------------- |
| [clean-code](../../../../guides/CLEAN_CODE/ENTRY_POINT.md)             | Always                          |
| [security-scanner](../../../../guides/SECURITY_SCANNER/ENTRY_POINT.md) | Always                          |
| [aaa-testing](../../../../guides/AAA_TESTING.md)                       | Only if the diff has test files |

> Run `security-scanner` on the diff only. Do the deep security scan and data-flow checks yourself. You do not need outside SAST tools. But do run `.claude/guides/SECURITY_SCANNER/scripts/scan-secrets.sh --diff` on the diff.
