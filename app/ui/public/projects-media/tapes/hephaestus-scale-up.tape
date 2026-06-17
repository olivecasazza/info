# charmbracelet/vhs tape
# Render with: vhs hephaestus-scale-up.tape
# Produces:   hephaestus-scale-up.gif (drop into ../hephaestus-scale-up.gif)

Output ../hephaestus-scale-up.gif

Set Shell zsh
Set FontSize 14
Set Width 1200
Set Height 700
Set Padding 20
Set TypingSpeed 30ms

# Show the pool CRD we're about to scale
Type "kubectl get metalmachinepool edge -o yaml | tail -8"
Enter
Sleep 1500ms

# Bump minReplicas — this is what the Ray autoscaler would also patch
Type@50ms 'kubectl patch metalmachinepool edge --type=merge -p ''{"spec":{"minReplicas":16}}'''
Sleep 500ms
Enter
Sleep 1s

# Watch the reconciler bring cold boxes up
Type "kubectl get metalmachine -l site=edge -w"
Enter
Sleep 6s

# Ctrl-C out of the watch
Ctrl+C
Sleep 500ms

# Confirm Ready count + Prometheus counter moved
Type "kubectl get metalmachine -l site=edge --no-headers | awk '{print $2}' | sort | uniq -c"
Enter
Sleep 1500ms

Type "curl -s localhost:8080/metrics | grep -E 'hephaestus_(reconcile_total|pool_ready_replicas)' | head"
Enter
Sleep 2s
