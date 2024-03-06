#!/usr/bin/env bash

if [ $# -eq 0 ]; then
	echo "Error: Please provide a suitable argument to proceed."
	echo "Use 'npm run ghp -- help' to know more."
	exit 1
fi

case "$1" in
"help")
	echo " ------------------------------------- Instructions ----------------------------------- "
	echo "1. To add a new repository: npm run ghp -- your_github_url_for_new_project commit_msg(optional)"
	echo '2. To push to an existing repository: npm run ghp -- -m commit_msg or "commit msg" or commit msg '
	;;
https*://*.git | git@*.git)
	message="first commit"
	if [[ $# -gt 1 ]]; then
		message="$2"
	fi

	ORIGIN="$1"
	git init && git add . && git commit -m "$message" && git branch -M main && git remote add origin "$ORIGIN" && git push -u origin main
	;;
"-m")
	shift
	message="$@"
	branch_name=$(git branch --show-current)
	git add . && git commit -m "$message" && git push origin "$branch_name"
	;;
*)
	echo "Error: didn't match with the followed pattern. "
	echo "Use 'npm run ghp -- help' to know more."
	exit 1
	;;
esac
