# charmbracelet/vhs tape
# Render with: vhs bird-nix-repl.tape
# Produces:   bird-nix-repl.gif (drop into ../bird-nix-repl.gif)

Output ../bird-nix-repl.gif

Set Shell zsh
Set FontSize 14
Set Width 1100
Set Height 650
Set Padding 20
Set TypingSpeed 35ms

# Enter a shell with bird-nix in scope
Type "nix shell github:olivecasazza/bird-nix"
Enter
Sleep 2500ms

# Open nix repl with the lib pre-loaded
Type "nix repl --expr '(builtins.getFlake \"github:olivecasazza/bird-nix\").lib {}'"
Enter
Sleep 3s

# I — the identity bird
Type "I 42"
Enter
Sleep 800ms

# K — kestrel, always returns the first
Type "K \"hello\" \"ignored\""
Enter
Sleep 800ms

# B — bluebird, function composition
Type "B (x: x + 1) (y: y * 2) 3"
Enter
Sleep 800ms

# S K K — a classic law: S K K x = x
Type "S K K 99"
Enter
Sleep 1200ms

# Y — sage bird, fixed-point combinator (factorial)
Type "Y (f: n: if n == 0 then 1 else n * f (n - 1)) 5"
Enter
Sleep 1500ms

Ctrl+D
Sleep 1s
