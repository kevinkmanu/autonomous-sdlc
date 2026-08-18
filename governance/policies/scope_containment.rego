package sdlc

path_in_scope(path, scope) if {
  some allowed in scope
  glob.match(allowed, ["/"], path)
}

deny contains message if {
  some path in input.pr.changed_files
  not path_in_scope(path, input.plan.affected_paths)
  message := sprintf("changed path is outside the accepted plan scope: %s", [path])
}
