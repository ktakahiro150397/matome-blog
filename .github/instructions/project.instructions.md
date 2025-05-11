---
applyTo: "**"
---

# Directory

If you want to execute npm command, you MUST check weather your current working directory is correct. This is NOT an option.

## YOU MUST NOT

You MUST NOT execute like below (You must check your current directory)

```bash
cd xxxx && npm install something-awesome-package
```

## YOU MUST DO

```bash
ls -l
```

See command output, and check your working directory is correct, and:

```bash
npm install something-awesome-package
```
