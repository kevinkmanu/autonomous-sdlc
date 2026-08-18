package sdlc

default plan_linked = false

plan_linked if {
  input.pr.plan_id != ""
  input.pr.plan_id == input.plan.id
  input.authorization.planId == input.plan.id
}

deny contains message if {
  not plan_linked
  message := "PR must link the accepted plan and its authorization record"
}
