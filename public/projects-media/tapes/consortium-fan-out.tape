# charmbracelet/vhs tape
# Render with: vhs consortium-fan-out.tape
# Produces:   consortium-fan-out.gif (drop into ../consortium-fan-out.gif)
#
# Demonstrates the four consortium binaries — pinch (node-set ops), claw
# (parallel fan-out), molt (output aggregation), cast (NixOS deploys) —
# against the nixlab fleet (contra + seir, both always reachable).

Output ../consortium-fan-out.gif

Set Shell zsh
Set FontSize 20
Set Width 1400
Set Height 760
Set Padding 24
Set TypingSpeed 30ms

# Node-set algebra — pure parser, no network.
Type "pinch -e 'mm[01-03,05]'"
Enter
Sleep 1500ms

Type "pinch -f mm01 mm02 mm03 mm05"
Enter
Sleep 1500ms

Type "pinch -i 'node[1-5]' 'node[3-7]'"
Enter
Sleep 1500ms

# Fan-out a command with claw — replaces clush.
Type "claw -w 'contra,seir' -- uptime"
Enter
Sleep 4s

# Pipe through molt to coalesce identical output.
Type "claw -w 'contra,seir' -- uname -r | molt -b"
Enter
Sleep 4s

# cast eval — show the deploy plan for a host group without applying.
# Requires fleet.json; switch to the nixlab repo silently first.
Hide
Type "cd /home/olive/Repositories/nixlab && clear"
Enter
Sleep 200ms
Show

Type "cast eval --on contra"
Enter
Sleep 5s
