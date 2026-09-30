name: Pull Request
description: Describe your changes for review
body:
  - type: textarea
    id: summary
    attributes:
      label: Summary
      description: What does this PR change, and why?
    validations:
      required: true
  - type: dropdown
    id: type
    attributes:
      label: Change type
      options:
        - Feature
        - Bug fix
        - Refactor
        - Documentation
        - Chore / CI
    validations:
      required: true
  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: Backend compiles (`mvn clean compile`)
        - label: Frontend builds (`npm run build`)
        - label: New endpoints have authorization rules in SecurityConfig
        - label: No secrets or build artifacts committed
        - label: Docs/README updated where needed
  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots (UI changes)
    validations:
      required: false
