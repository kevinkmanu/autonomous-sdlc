package sdlc

protected_path(path) if startswith(path, ".github/workflows/")
protected_path(path) if path == ".github/CODEOWNERS"
protected_path(path) if path == ".github/copilot-instructions.md"
protected_path(path) if startswith(path, "governance/")
protected_path(path) if startswith(path, "infra/")
protected_path(path) if startswith(path, "migrations/")
protected_path(path) if contains(path, "/auth/")
protected_path(path) if contains(path, "/crypto/")

protected_path(path) if {
  endswith(path, ".lock")
}

deny contains message if {
  some path in input.pr.changed_files
  protected_path(path)
  not path in input.pr.human_approved_protected_paths
  message := sprintf("protected path changed without explicit human approval: %s", [path])
}
