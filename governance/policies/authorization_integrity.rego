package sdlc

valid_authorization if {
  input.authorization.planId == input.plan.id
  input.authorization.planCommit == input.pr.plan_commit
  input.authorization.planHash == input.pr.plan_hash
  input.authorization.approved == true
}

deny contains message if {
  not valid_authorization
  message := "implementation PR must reference the exact accepted plan authorization"
}
