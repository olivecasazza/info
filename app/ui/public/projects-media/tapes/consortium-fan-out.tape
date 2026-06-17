# charmbracelet/vhs tape
# Render with: vhs consortium-fan-out.tape
# Produces:   consortium-fan-out.gif (drop into ../consortium-fan-out.gif)
#
# Demonstrates the four consortium binaries — pinch (node-set ops), claw
# (parallel fan-out), molt (output aggregation), cast (NixOS deploys) —
# against the nixlab Mac Mini agents (mm01-mm05).

Output ../consortium-fan-out.gif

Set Shell zsh
Set FontSize 14
Set Width 1200
Set Height 720
Set Padding 20
Set TypingSpeed 30ms

# Node-set algebra — no network, just the parser.
Type "pinch -e 'mm[01-03,05]'"
Enter
Sleep 1500ms

Type "pinch -f mm01 mm02 mm03 mm05"
Enter
Sleep 1500ms

# Fan-out a command with claw — replaces clush.
Type "claw -w 'mm[01-05]' uptime"
Enter
Sleep 4s

# Pipe the same call through molt for grouped output.
Type "claw -w 'mm[01-05]' -- uname -r | molt -b"
Enter
Sleep 4s

# cast health — probe nixlab build hosts in one shot.
Type "cast health"
Enter
Sleep 5s

# Show how compact the dispatch is — peek the work plan for a deploy.
Type "cast eval --on 'mm[01-05]'"
Enter
Sleep 4s
