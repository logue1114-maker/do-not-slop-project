# Production and review acceptance checklist

Use this on a concrete patch, not as a score based on file or comment counts.

- [ ] The reviewer can launch the actual entry point and trace one action to its result.
- [ ] The diff names the protected data, outputs, errors and side effects; intentional behavior changes are separate from refactoring.
- [ ] An existing baseline or research specimen remains exact, with provenance/hash checks.
- [ ] Each changed role has a clear owner and reason. Closely related helpers remain together; no speculative managers or absent persistence layer.
- [ ] The change map identifies the appropriate file for the requested edit and its relevant test. It does not equate fewer touched files with measured effort.
- [ ] Rules are independent of presentation/input/platform globals; views do not decide legality. Prohibited imports/capability accesses fail a guard with a demonstrated negative case.
- [ ] Public inputs/outputs, mutation/clone behavior and failures are documented. Required malformed-input policy is explicit.
- [ ] Configuration stays with its owner. Visual dimensions do not alter world/rule units; platform settings are not hidden in domain logic.
- [ ] Initialization, listeners/resources and cleanup have named owners. Dispose after a meaningful state change, then remount; repeated input and stale output are checked when affected.
- [ ] Comments explain an invariant, reason, side effect or tradeoff. Names/contracts explain ordinary mechanics; stale comments are removed.
- [ ] Focused original/refactored tests and actual entry-point flows pass, including applicable failure/recovery and repeated-input cases.
- [ ] One isolated requested-style patch demonstrates the edit boundary and verifies protected behavior. Its files and reasons are listed.
- [ ] Results distinguish run/unrun checks, observed facts, hypotheses, human review and user approval.
- [ ] Scope, rights, README links and prior research/user-review preservation are checked before publication. No dependency is added merely to enforce ceremony.

For this package, run [the quickstart commands](MAINTAINER_QUICKSTART.md), inspect [the executed record](VERIFICATION.md), and review [the isolated patch](change-example/README.md). A future production feature must be evaluated against its own requirements; passing this bounded example is not a repository-wide quality certification.
