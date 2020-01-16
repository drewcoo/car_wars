# Car Wars
An attempt to computerize the paper-and-pencil game Car Wars, my favorite game by far from . . . back then.

Steve Jackson Games has published an old rule book for [Car Wars Classic](http://www.sjgames.com/car-wars/games/classic/) that I'm using. Local copy here [car-wars-classic-rules.pdf](./car-wars-classic-rules.pdf) to avoid hotlinking.

There are also [errata for Car Wars Classic](http://www.sjgames.com/car-wars/errata/classic.html). I haven't checked yet to see if they're reflected in the rules pdf.

# Why?
To learn React and Redux and bone up on related tech.

But also because I've just wanted to for a while. It's a great game and this project is hard. Well, Knuth's "medium," probably.

# Options
Though I tried to stick to the rules as written, that wasn't always possible. Often because the rules weren't entirely clear. I've tried to note my deviations here and also intend to have these be set-able options with sensible defaults.

There are trade-offs here between similar things with potentially deep game implications:
- perfect knowledge and hidden reveals
- "playing chicken" and MAD strategy

## Consider
### Speed Change
At the beginning of any phase any car that hasn't changed speed yet that turn can change speed.

Choices:
- Simultaneously opt to change or not. (default)
- Simultaneously opt to change or not; if anyone changes speed, blindly offer "no change" players a chance to change,
- Simultaneously opt to change or not; if anyone changes speed, show the players who changed and "no change" players a chance to change.
- Take turns opting to change.

### Weapons Fire
At the end of any phase any character who hasn't fired yet this turn can fire any weapon that hasn't fired yet this turn.

Choices:
Similar choices to speed ones.

### Move Order
1. The fastest vehicle moves first.
2. If there are multiple vehicles at the same speed, the better reflex (rolled at beginning of match) decides whether to go or let someone else go.
3. If there are vehicles at the same speed with the same reflex roll, tie-breaking is undefined.

Choices:
- Whenever this happens (max once per phase), have tie-breaking rolls until there's a clear winner. (default)
- Make match tie-breakers at the beginning of the game and always show a definite, known order (and order of chooser).

### Knowledge of Other Cars
Choices:
- total knowledge of all vehicles (default)
- Knowledge only of what's visible as it becomes visible

## Prefer Not To
### Maneuver Granularity
Currently I lock all maneuvers into the maximal amount for a given difficulty value. So a D1 bend is always 15 degrees.

I would rather not change this, but *maybe* in the future I should consider these options:
- snap to maximal maneuver for difficulty (current)
- allow full range of angles

### Maneuver: Evening Out
Currently this is not implemented. I don't plan to implement it. But I could consider:
- Allow Evening Out
- No Evening Out
