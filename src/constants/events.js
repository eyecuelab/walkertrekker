const events  = [
  {
    id: 1,
    type: 'random',
    antecedent: `The road ahead is blocked by a makeshift barricade of flaming oil drums. "Stop!" Three men, rifles drawn and pointed at your group, gesture to a metal locker in front of the obstruction. "This is a toll road! Put your food in the box if you want to pass!" Do you surrender food or backtrack to avoid the obstacle?`,
    optionAButton: `Give Food`,
    optionAText: `You put precious food in the box and pass through the barricade, wondering when you'll find food again. Looking back, you see the men have started fighting like dogs in the street. These are hard times.`,
    optionAResult: {
      food: -2,
    },
    optionBButton: `Backtrack`,
    optionBText: `You double back before the men can react and take an alternate route. Unfortunately, the new path is not as direct, adding additional distance to your destination.`,
    optionBResult: {
      stepTargets: 0.1
    },
    journal: 'Encoutered armed men demanding food as toll for crossing a barricade. We decided to ',
  },
  {
    id: 2,
    type: 'random',
    antecedent: `You hear a guttural moaning sound coming from a nearby storefront. Warily, you investigate, shining your flashlight inside. Through cracked and mud splattered glass you see an old man sprawled across the floor. He lies twisted on the ground, gravely injured. Do you offer medical assistance? Or leave him to die alone in the dark?`,
    optionAButton: `Give Meds`,
    optionAText: `As you give aid, the old man stirs. "You're the first people I've seen in days. I thought I was a goner for sure. Here, take my old service revolver. It still has 3 shots and has never let me down.`,
    optionAResult: {
      meds: -2,
      weapons: 4
    },
    optionBButton: `Ignore`,
    optionBText: `You continue, pretending not to hear his suffering. For years to come, that sad moaning haunts your dreams.`,
    optionBResult: {},
    journal: 'Found an injured elderly man, moaning in pain. We decided to ',
  },
  {
    id: 3,
    type: 'random',
    antecedent: `A child sprints towards your group, wild eyed and covered with blood. The living dead? It's hard to tell–you've never seen a zombie move that fast before, but you've never seen a zombie child either. Do you attack before it gets to your group? Or wait until it gets closer to investigate?`,
    optionAButton: `Attack Now`,
    optionAText: `Better safe than sorry. You attack. Again. And again. and finally you succeed. With both relief and disgust, you see the child was indeed a zombie.`,
    optionAResult: {
      weapons: -2
    },
    optionBButton: `Investigate`,
    optionBText: `A moment's hesitation was all it took. Too late, the zombie child is on top of you. You fight it off, but not before it extracts a terrible toll.`,
    optionBResult: {
      weapons: -2,
      health: -15
    },
    journal: 'Encountered a bloody zombie child. We decided to ',
  },
  {
    id: 4,
    type: 'random',
    antecedent: `A man in a filthy McDonalds uniform approaches you cautiously. His hands are in the air, alternatively clenching and opening to show that he's unharmed and means you no harm. "Hey brother, it's dangerous out here. Can you spare something to help keep a guy safe?"`,
    optionAButton: `Give Weapon`,
    optionAText: `He gratefully accepts the weapon, inspecting it intently. Now armed, he stands taller. He smiles. "Thanks ya'll. You probably just saved my life. Here, it's not much, but it's the least I can do." He hands you some food. "You stay safe too, OK?"`,
    optionAResult: {
      weapons: -1,
      food: 3,
    },
    optionBButton: `Ignore`,
    optionBText: `You decline and move past without a word. Sadly he shakes his head, knowing that he doesn't stand much of a chance unarmed.`,
    optionBResult: {},
    journal: 'Encouted a man asking if we could spare a weapon. We decided to ',
  },
  {
    id: 5,
    type: 'random',
    antecedent: `In the distance, you see a shadowy figure clinging to the top of an unlit streetlamp. Beneath her, a zombie claws at the air in impotent hunger. The zombie hasn't spotted you yet–it would be easy enough to slip by, unnoticed and unharmed. What do you do?`,
    optionAButton: `Attack Now`,
    optionAText: `With the element of surprise, the zombie goes down easy enough. You call up to the figure, but it doesn't respond. Sadly, you realize you were too late. Another casualty of the apocalypse.`,
    optionAResult: {
      weapons: -1,
    },
    optionBButton: `Ignore`,
    optionBText: `Quietly, you pass by, unnoticed. Best not to get involved, right?`,
    optionBResult: {},
    journal: 'Saw a zombie trying to get at a figure clutching a streetlamp. We decided to ',
  },
  {
    id: 6,
    type: 'random',
    antecedent: `The street you grew up on–how changed is the world that you didn't recognize it? There's your house. So many memories... life was so simple before. What happened here? You have to know... but it's more practical to keep moving and get to the next safehouse. Will you ever be home again? `,
    optionAButton: `Investigate`,
    optionAText: `As you enter through the backdoor, the smell assaults you. You know what's coming but you have to see it for yourself. A zombie stands in the kitchen, facing away from you. Who is it? It doesn't matter now. You put it down quickly. It is, or was, Dr. Johnson, a family friend. Looting the corpse, you find intact MEDS. But where is your family?`,
    optionAResult: {
      meds: 2,
      weapons: -1,
    },
    optionBButton: `Ignore`,
    optionBText: `You move past. Some things are better left unknown.`,
    optionBResult: {},
    journal: 'Found our old house, full of memories. We decided to ',
  },
  {
    id: 7,
    type: 'random',
    antecedent: `"You're alive!" says the stranger. "I was afraid you were among the dead ones. I met some others a few weeks ago, but our group gradually fell apart." Your gaze wanders from the stranger's eyes to the blood soaked rags wrapped around their right hand. "Oh, this? This is nothing. Just cut my hand on some glass. Hey, you got some Meds? That could really help me out."`,
    optionAButton: `Give Meds`,
    optionAText: `"Hey, thanks a lot. Funny to get a normal infection with everything else going on. I don't have much, but here, take this... a bite to eat is the least I can do." He hands you some FOOD.`,
    optionAResult: {
      meds: -2,
      food: 4,
    },
    optionBButton: `Ignore`,
    optionBText: `"I'm sorry friend," you say,"Nothing personal, but we don't have anything to spare."`,
    optionBResult: {},
    journal: 'Found an injured stranger offering food for meds. We decided to ',
  },
  {
    id: 8,
    type: 'random',
    antecedent: `The beam of your flashlight moves across the wreckage. This place has been hit by other scavengers and you begin to doubt anything of value is left. Your light moves across a window and you see eyes looking at you from the glass, full of fear and mistrust. A kid, probably no more than five years old. Filthy, probably starving. Maybe they need some food?`,
    optionAButton: `Give Food`,
    optionAText: `You offer the food. Tentatively, step by step, they move towards your outstretched hand. With a squeal they suddenly snatch it and dash out of sight. If they live for one more day, wasn't the sacrifice worth it?`,
    optionAResult: {
      food: -1,
    },
    optionBButton: `Ignore`,
    optionBText: `The little survivor seems to be getting on fine on their own. Probably will outlast you, anyway.`,
    optionBResult: {},
    journal: 'Found a young kid in some wreckage. We decided to ',
  },
  {
    id: 9,
    type: 'random',
    antecedent: `You pass an open manhole cover when the idea strikes you. Maybe below ground is safer than up here on the surface? If nothing else, it'll be easier than constantly navigating all this wreckage. A tunnel looks empty, at least as far as your light goes. Do you give the sewers a try?`,
    optionAButton: `Go Underground`,
    optionAText: `The sewers are free of zombies, but they're not the only danger you face in this dangerous world. Rats have grown desperate and bold, spreading disease as they scavenge. *Cough, cough* Did you catch something?`,
    optionAResult: {
      health: -15
    },
    optionBButton: `Ignore`,
    optionBText: `Who knows what's in those tunnels. Up here, you at least have somewhere to run, right?`,
    optionBResult: {},
    journal: 'Found an open manhole leading to the sewers. We decided to ',
  },
  {
    id: 10,
    type: 'random',
    antecedent: `You slip through the alleyways, moving as quietly as you can, when you hear the clip-clop of horse hooves on pavement. Peering out from the wreckage of a burned-out salon, you see a half-starved horse walking down the street. It looks like it's been through a lot. Do you give it food? Or is the horse your next meal?`,
    optionAButton: `Give Food`,
    optionAText: `It's skittish, but you manage to give the horse some of your food. It's too weak to carry you, but your generosity doesn't go unrewarded. Wedged in the saddle is a police-issued shotgun, still loaded and ready for action.`,
    optionAResult: {
      weapons: 3,
      food: -2,
    },
    optionBButton: `Get Food`,
    optionBText: `"Sorry, old girl."`,
    optionBResult: {
      food: 6
    },
    journal: 'Encountered a starving horse. We decided to ',
  },
  {
    id: 11,
    type: 'random',
    antecedent: `Walking along the outskirts of town, you hear the rapid rat-tat-tat of an automatic rifle in the distance. More survivors! Strength in numbers! But also, that sounds like a bad situation over there. That much gun fire can't be good. Go lend a hand or stay out of it?`,
    optionAButton: `Join the Fight`,
    optionAText: `You run towards the sound, finding a scraggly man mowing down a crowd of zombies ambling towards him. He turns his gun on you as you arrive and your hands shoot up. "We're alive!", you shout. "Don't shoot!" He looks you over. "Drop your weapons and hit the road. My friends Smith & Wesson here don't discriminate."`,
    optionAResult: {
      weapons: -2,
    },
    optionBButton: `Ignore`,
    optionBText: `You've got enough problems on your own without going looking for trouble.`,
    optionBResult: {},
    journal: 'Heard gunfire in the distance. We decided to ',
  },
  {
    id: 12,
    type: 'random',
    antecedent: `Rounding a corner, you spot an emergency clinic set up in a empty shopping mall parking lot. Surprisingly, the lights are on and the clinic is open! A harried doctor in white lab coat approaches. "We're trying to create penicillin," she says, "and we need bread. Do you have any to spare?" `,
    optionAButton: `Give Food`,
    optionAText: `You hand the food over. "The life you save might be your own! Here, have some of our first batch of medicine."`,
    optionAResult: {
      meds: 3,
      food: -2,
    },
    optionBButton: `Ignore`,
    optionBText: `It's not worth the risk of tampering with the food supply.`,
    optionBResult: {},
    journal: 'A medical clinic asks us for spare bread to make medicine. We decided to ',
  },
  {
    id: 13,
    type: 'random',
    antecedent: `An airplane appears in the sky directly above the group. Finally help has arrived?! Like something from an old war movie, a huge crate drops, parachute unfurling, it floats to the ground. First with excitement and then chagrin, you watch as the package descends directly into a mob of zombies amassed around an overturned school bus. You think you can handle them, but is it worth the risk?`,
    optionAButton: `Use Weapons`,
    optionAText: `The fight was brutal, but in the end, it turned out to be worth it. Working together, you bash the lock and throw the crate open. Food, medicine, and weapons greet you. But even more importantly, hope. That plane had to come from somewhere! There are other survivors. You might make it through this after all.`,
    optionAResult: {
      meds: 2,
      weapons: -1,
      food: 2,
      health: -10,
    },
    optionBButton: `Ignore`,
    optionBText: `The box could be filled with anything, and it's not worth the risk. If you ever come back this way, maybe you'll check it out then.`,
    optionBResult: {},
    journal: 'An airplane dropped a crate of supplies right into a zombie mob. We decided to ',
  },
  {
    id: 14,
    type: 'random',
    antecedent: `You walk past a theater and realize it's more or less intact. Peering through the ticket booth, it looks unoccupied. The heavy doors groan as you pull them open, revealing the lobby in disarray. It's quiet in here, unnerving. But there may be supplies–concessions, maybe? Do you loot the place?`,
    optionAButton: `Search`,
    optionAText: `You quickly find the kitchen, intact. Empty. However, the adjoining storage room is loaded with popcorn and soda pop. Food, of a sort.`,
    optionAResult: {
      food: 2,
    },
    optionBButton: `Ignore`,
    optionBText: `You quickly backtrack and continue towards the safehouse. Nothing good will come from looting an old theater.`,
    optionBResult: {},
    journal: 'Came across a movie theater that may have food left inside. We decided to ',
  },
  {
    id: 15,
    type: 'random',
    antecedent: `Your group slips into a long-abandoned Quick-E mart. The shelves that are still standing are empty, except for a few cans of beans on the bottom shelf. You stare at them, wishing you didn't see what you're seeing. Is the can bulging? Or is it just misshapened from being dropped? You are in no hurry to get botulism, but food isn't exactly plentiful these days. Do you make a quick meal of it?`,
    optionAButton: `Have a Bite`,
    optionAText: `"I'm sure it's fine," you all say to yourselves. "The outbreaks didn't start THAT long ago. We're just being paranoid." Egging each other on, you scarf down the cans. They taste fine. But they're not fine. Not even close.`,
    optionAResult: {
      health: -15,
    },
    optionBButton: `Ignore`,
    optionBText: `Better to lose a few pounds than lose everything to illness. You throw the can away. Better safe than sorry.`,
    optionBResult: {},
    journal: 'Found some suspicious cans of beans at the Quick-E mart. We decided to ',
  },
  {
    id: 16,
    type: 'random',
    antecedent: `You discover an abandoned school. As you search through the classrooms, you hear screaming and pounding at a door down the hallway. A teenager is frantically banging on the door of the cafeteria, and as you unlock it, you see the dead converging on him. At the far side of the room, cartons of unopened food are piled high. Do you help the kid? Or go for the food?`,
    optionAButton: `Save the Kid`,
    optionAText: `You unlock the door and rescue the boy. He runs past you to leave you to deal with the zombies. You manage to beat them back and get the door shut. Ungrateful little snot.`,
    optionAResult: {
      weapons: -1,
    },
    optionBButton: `Grab the Food`,
    optionBText: `Your hesitation gives the zombies enough time to reach the boy. You take advantage of the distraction and rush into the cafeteria and grab the supplies as the teenager's anguished screams echo throughout the school.`,
    optionBResult: {
      food: 3
    },
    journal: 'Came across a kid trapped with zombies in a school cafeteria still stocked with food. We decided to ',
  },
  {
    id: 17,
    type: 'random',
    antecedent: `A wrong turn has you in a dead end alley. A mob of zombies suddenly appear, cutting off your escape route. There's no way out. You're surprised how calm you feel. You nod to each other, accepting the inevitable. Suddenly a high-pitched battle cry fills the air! A woman dressed in black leaps from a nearby rooftop, sword in hand, and begins cutting down the dead. Do you join in the fight or make a run for it?`,
    optionAButton: `Join the Fight`,
    optionAText: `Weapons drawn, you join the fight and together you manage to fight off the zombies. "Nice work," she says. "Thanks for the help. Here, take my extra sword, you might need it." She hands you the gleaming blade.`,
    optionAResult: {
      weapons: 1,
      health: -5,
    },
    optionBButton: `Run Away`,
    optionBText: `As she expertly dispatches the zombies, you make your escape, slipping past the melee without a scratch.`,
    optionBResult: {},
    journal: 'Took a wrong turn, found a woman cutting down zombies with a sword. We decided to ',
  },
  {
    id: 18,
    type: 'random',
    antecedent: `A filthy woman looks at you in a confused silence. Her hair is a tangled rat's nest and grime covers her body. "Are you ok?" you ask. A grocery bag hangs at her side, stuffed with canned food. Now you notice the knife in her hand. "We're not going to hurt you", you try again in hushed tones. Like a switch flipping, she brandishes the knife and screams, "Get away from my food!" She crouches, ready to attack.`,
    optionAButton: `Fight Back`,
    optionAText: `She charges you and fights with wild abandon, and after a difficult struggle, you're forced to kill her.`,
    optionAResult: {
      food: 3,
      health: -10,
    },
    optionBButton: `Run Away`,
    optionBText: `The feral look in her eyes scares you and you run away.`,
    optionBResult: {},
    journal: 'Encoutered an armed woman garding food, ready to attack. We decided to ',
  },
  {
    id: 19,
    type: 'random',
    antecedent: `"Help me! Is anybody out there?" You hear the shout from a nearby police station. Cautiously, you push open the heavy double doors with weapons drawn. The station is deserted, except for the sound coming from the holding cells. An emaciated man sees you with sudden hope revealing on his face. "You gotta help me! I was locked up and haven't seen no one for days!" He's clearly not a zombie, but something about his demeanor worries you.`,
    optionAButton: `Release Him`,
    optionAText: `You use a weapon to smash open the lock and he swings the door open with visible relief. "I thought I was going to die in there! What the hell is going on? Where is everybody?" You recap the events leading up to, and since the plague was released.`,
    optionAResult: {
      weapons: -1,
    },
    optionBButton: `Ignore`,
    optionBText: `This guy was locked up for a reason, and you don't want another mouth to feed. Better to move on. He back out of the station to his anguished cries.`,
    optionBResult: {},
    journal: 'Found a man still locked in the police station cells. We decided to ',
  },
]

module.exports = events
