package sdlc

conventional_title if regex.match("^(feat|fix|docs|test|refactor|build|ci|chore|perf|revert)(\\([^)]+\\))?: .+", input.pr.title)

all_commits_signed if {
  every commit in input.pr.commits {
    commit.verified == true
  }
}

no_agent_approval if {
  every approval in input.pr.approvals {
    approval.actor_type != "Bot"
  }
}

deny contains message if {
  not conventional_title
  message := "PR title must use a conventional-commit prefix"
}

deny contains message if {
  not all_commits_signed
  message := "all PR commits must have verified signatures"
}

deny contains message if {
  not no_agent_approval
  message := "agents and bots cannot approve pull requests"
}

deny contains message if {
  input.pr.additions + input.pr.deletions > 800
  not input.pr.large_change_approved
  message := "PR exceeds the 800 changed-line limit without explicit approval"
}
