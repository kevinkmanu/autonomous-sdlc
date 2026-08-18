package sdlc

allowed_scope(name) if startswith(name, "@types/")
allowed_scope(name) if startswith(name, "@typescript-eslint/")
allowed_scope(name) if startswith(name, "eslint/")
allowed_scope(name) if startswith(name, "prettier/")
allowed_scope(name) if name == "vitest"
allowed_scope(name) if startswith(name, "@vitest/")
allowed_scope(name) if startswith(name, "@stryker-mutator/")
allowed_scope(name) if name == "yaml"
allowed_scope(name) if name == "ajv"

approved_license(license) if license == "MIT"
approved_license(license) if license == "Apache-2.0"
approved_license(license) if license == "BSD-2-Clause"
approved_license(license) if license == "BSD-3-Clause"
approved_license(license) if license == "ISC"
approved_license(license) if license == "0BSD"
approved_license(license) if license == "CC0-1.0"

deny contains message if {
  some dependency in input.dependencies
  not allowed_scope(dependency.name)
  message := sprintf("dependency is not in the allowlist: %s", [dependency.name])
}

deny contains message if {
  some dependency in input.dependencies
  not approved_license(dependency.license)
  message := sprintf("dependency license is not approved: %s", [dependency.license])
}
